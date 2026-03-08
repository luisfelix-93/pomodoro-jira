import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { exchangeCodeForTokens } from '../auth/jiraAuth';
import { runtimeConfig } from '../config/runtimeConfig';

export const CallbackPage: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const setAuthError = useAuthStore((state) => state.setAuthError);
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      console.error('Callback: no authorization code in URL');
      setAuthError('Authorization code not found');
      window.location.replace('/#/');
      return;
    }

    const config = runtimeConfig.get();

    exchangeCodeForTokens(code, config.VITE_JIRA_CALLBACK_URL)
      .then((tokens) => {
        login({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || '',
          expiresIn: tokens.expires_in || 3600,
          scope: tokens.scope || '',
          cloudId: tokens.cloud_id || '',
        });

        // Redirect to HashRouter's /orbit route
        window.location.replace('/#/orbit');
      })
      .catch((err) => {
        console.error('Token exchange error:', err);
        setAuthError(err.message || 'Authentication failed');
        window.location.replace('/#/');
      });
  }, [login, setAuthError]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Autenticando no Jira...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
};
