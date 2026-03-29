import axios from 'axios';
import { dbRequest } from './db';
import { UserConfig } from '@prisma/client';

/**
 * Ensures the OAuth access token is fresh before making Jira API calls.
 * If the token is expired or about to expire (within 5 minutes), 
 * uses the refresh_token to get a new access_token from Atlassian.
 * 
 * Returns the updated UserConfig record with all fields.
 */
export async function ensureFreshToken(config: UserConfig): Promise<UserConfig> {
  // If using Basic Auth (no accessToken/refreshToken), skip token refresh
  if (!config.accessToken || !config.refreshToken) {
    return config;
  }

  const now = new Date();
  const expiresAt = config.tokenExpiresAt ? new Date(config.tokenExpiresAt) : null;
  const bufferMs = 5 * 60 * 1000; // 5 minutes buffer

  // Token is still valid
  if (expiresAt && expiresAt.getTime() - now.getTime() > bufferMs) {
    return config;
  }

  console.log('🔄 Access token expired or expiring soon, refreshing...');

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Cannot refresh token: CLIENT_ID or CLIENT_SECRET not configured');
  }

  try {
    const response = await axios.post('https://auth.atlassian.com/oauth/token', {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: config.refreshToken,
    });

    const { access_token, refresh_token, expires_in } = response.data;

    const updated = await dbRequest.prisma.userConfig.update({
      where: { id: config.id },
      data: {
        accessToken: access_token,
        refreshToken: refresh_token || config.refreshToken,
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
      },
    });

    console.log('✅ Token refreshed successfully, expires in', expires_in, 'seconds');
    return updated;
  } catch (error: any) {
    console.error('❌ Token refresh failed:', error?.response?.data || error.message);
    throw new Error('Failed to refresh Jira access token. Please re-authenticate.');
  }
}
