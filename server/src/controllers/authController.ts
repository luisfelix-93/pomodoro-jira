import { Request, Response } from 'express';
import { dbRequest } from '../services/db';
import { JiraClient } from '../services/jira';
import axios from 'axios';

export class AuthController {
  
  static async login(req: Request, res: Response): Promise<void> {
    const clientId = process.env.CLIENT_ID;
    const redirectUri = 'http://localhost:3001/api/auth/callback';
    
    if (!clientId) {
      res.status(500).json({ error: 'OAuth CLIENT_ID not configured on server' });
      return;
    }

    const state = Math.random().toString(36).substring(7);
    const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=read:jira-user%20read:jira-work%20write:jira-work%20offline_access&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&response_type=code&prompt=consent`;
    
    res.redirect(authUrl);
  }

  static async callback(req: Request, res: Response): Promise<void> {
    const { code } = req.query;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = 'http://localhost:3001/api/auth/callback';

    if (!code || !clientId || !clientSecret) {
      res.status(400).send('OAuth callback error: Missing code or credentials');
      return;
    }

    try {
      // 1. Exchange code for access token
      const tokenResponse = await axios.post('https://auth.atlassian.com/oauth/token', {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      });

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      // 2. Get accessible resources to find the cloudId
      const resourcesResponse = await axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      if (!resourcesResponse.data || resourcesResponse.data.length === 0) {
         res.status(403).send('No accessible Jira sites found for this user.');
         return;
      }

      // We'll just take the first accessible Jira site for now
      const site = resourcesResponse.data[0];
      const cloudId = site.id;
      const domain = site.url;

      // 3. Save to DB
      await dbRequest.prisma.userConfig.create({
        data: {
          jiraDomain: domain,
          accessToken: access_token,
          refreshToken: refresh_token,
          cloudId: cloudId,
          tokenExpiresAt: new Date(Date.now() + expires_in * 1000)
        }
      });

      // 4. Redirect to Frontend (Orbit App)
      // We assume frontend runs on http://localhost:5173 for Dev.
      res.redirect('http://localhost:5173/orbit');
    } catch (error: any) {
      console.error('OAuth Callback Error:', error?.response?.data || error.message);
      res.status(500).send('OAuth callback failed');
    }
  }

  /**
   * Token Exchange Proxy (Option A).
   * SPA sends the authorization code; server exchanges it using client_secret.
   * Atlassian requires Content-Type: application/json + client_secret.
   */
  static async exchange(req: Request, res: Response): Promise<void> {
    const { code, redirect_uri } = req.body;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    if (!code || !clientId || !clientSecret) {
      res.status(400).json({ error: 'Missing code or server credentials' });
      return;
    }

    try {
      const tokenResponse = await axios.post(
        'https://auth.atlassian.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirect_uri || 'http://localhost:5173/callback',
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { access_token, refresh_token, expires_in, scope } = tokenResponse.data;

      // Fetch accessible resources to get cloudId
      const resourcesResponse = await axios.get(
        'https://api.atlassian.com/oauth/token/accessible-resources',
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      const cloudId = resourcesResponse.data?.[0]?.id || '';

      // Persist to DB
      await dbRequest.prisma.userConfig.create({
        data: {
          jiraDomain: resourcesResponse.data?.[0]?.url || '',
          accessToken: access_token,
          refreshToken: refresh_token,
          cloudId,
          tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
        },
      });

      res.json({
        access_token,
        refresh_token,
        expires_in,
        scope,
        cloud_id: cloudId,
      });
    } catch (error: any) {
      console.error('Token exchange error:', error?.response?.data || error.message);
      res.status(error?.response?.status || 500).json({
        error: error?.response?.data?.error_description || 'Token exchange failed',
      });
    }
  }

  static async loginBasic(req: Request, res: Response): Promise<void> {
    const { domain, email, token } = req.body;

    if (!domain || !email || !token) {
      res.status(400).json({ error: 'Missing credentials' });
      return;
    }

    try {
      // 1. Validate with Jira
      const jira = new JiraClient({ domain, email, apiToken: token });
      const myself = await jira.getMyself();

      // 2. Save to DB
      await dbRequest.prisma.userConfig.create({
        data: {
          jiraDomain: domain,
          email,
          apiToken: token,
          accountId: myself.accountId,
        },
      });

      res.json({ success: true, user: { accountId: myself.accountId, displayName: myself.displayName } });
    } catch (error: any) {
        console.error('Login error:', error);
      res.status(401).json({ error: error.message || 'Authentication failed' });
    }
  }

  static async status(req: Request, res: Response): Promise<void> {
    try {
        const config = await dbRequest.prisma.userConfig.findFirst({
            orderBy: { id: 'desc' }
        });

        if (config) {
            res.json({ isAuthenticated: true, user: { email: config.email, domain: config.jiraDomain } });
        } else {
            res.json({ isAuthenticated: false });
        }
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ error: 'Database error' });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
        await dbRequest.prisma.userConfig.deleteMany();
        res.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
  }
}
