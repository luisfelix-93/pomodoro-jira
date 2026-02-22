import { Request, Response } from 'express';
import { dbRequest } from '../services/db';
import { JiraClient } from '../services/jira';

export class AuthController {
  
  static async login(req: Request, res: Response): Promise<void> {
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
