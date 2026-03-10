import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { exchangeCodeForTokens } from '../auth/jiraAuth';
import { runtimeConfig } from '../config/runtimeConfig';

/** Navigate to a hash route, compatible with both file:// and http:// */
function navigateToHashRoute(route: string) {
  if (window.location.protocol === 'file:') {
    window.location.hash = `#${route}`;
    window.location.reload();
  } else {
    window.location.replace(`/#${route}`);
  }
}

export const CallbackPage: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const setAuthError = useAuthStore((state) => state.setAuthError);
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    // Dev: code arrives in query string (?code=...)
    // Electron production: code arrives in hash (#/callback?code=...)
    let code: string | null = null;
    const hashMatch = window.location.hash.match(/^#\/callback\?(.*)/);
    if (hashMatch) {
      const hashParams = new URLSearchParams(hashMatch[1]);
      code = hashParams.get('code');
    } else {
      const params = new URLSearchParams(window.location.search);
      code = params.get('code');
    }

    if (!code) {
      console.error('Callback: no authorization code in URL');
      setAuthError('Authorization code not found');
      navigateToHashRoute('/');
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
        navigateToHashRoute('/orbit');
      })
      .catch((err) => {
        console.error('Token exchange error:', err);
        setAuthError(err.message || 'Authentication failed');
        navigateToHashRoute('/');
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
