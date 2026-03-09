import { runtimeConfig } from '../config/runtimeConfig';

const SERVER_URL = 'http://localhost:3001';

/**
 * Build the Atlassian authorize URL with all required params.
 * The SPA redirects the user to this URL to start the OAuth flow.
 */
export function buildAuthorizeUrl(): string {
  const config = runtimeConfig.get();

  const params = new URLSearchParams({
    audience: 'api.atlassian.com',
    client_id: config.VITE_JIRA_CLIENT_ID,
    scope: config.VITE_JIRA_SCOPES,
    redirect_uri: config.VITE_JIRA_CALLBACK_URL,
    state: crypto.randomUUID(),
    response_type: 'code',
    prompt: 'consent',
  });

  return `${config.VITE_JIRA_AUTH_URL}?${params.toString()}`;
}

/**
 * Redirect the user to Atlassian for authentication.
 */
export function redirectToLogin(): void {
  window.location.href = buildAuthorizeUrl();
}

/**
 * Exchange the authorization code for tokens via the server-side proxy.
 * The server adds client_secret and sends JSON — required by Atlassian.
 */
export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  cloud_id: string;
}> {
  const response = await fetch(`${SERVER_URL}/api/auth/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirect_uri: redirectUri }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Token exchange failed (${response.status})`);
  }

  return response.json();
}
