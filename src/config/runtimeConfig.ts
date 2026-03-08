export interface AppConfig {
  VITE_JIRA_CLIENT_ID: string;
  VITE_JIRA_AUTH_URL: string;
  VITE_JIRA_TOKEN_URL: string;
  VITE_JIRA_SCOPES: string;
  VITE_JIRA_CALLBACK_URL: string;
}

class RuntimeConfig {
  private config: AppConfig | null = null;

  async load(): Promise<void> {
    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`);
      }
      this.config = await response.json();
    } catch (error) {
      console.error('Error loading config.json:', error);
      // Fallback para variáveis de ambiente locais caso o config.json não exista em dev
      this.config = {
        VITE_JIRA_CLIENT_ID: import.meta.env.VITE_JIRA_CLIENT_ID || '',
        VITE_JIRA_AUTH_URL: import.meta.env.VITE_JIRA_AUTH_URL || 'https://auth.atlassian.com/authorize',
        VITE_JIRA_TOKEN_URL: import.meta.env.VITE_JIRA_TOKEN_URL || 'https://auth.atlassian.com/oauth/token',
        VITE_JIRA_SCOPES: import.meta.env.VITE_JIRA_SCOPES || 'read:jira-work manage:jira-project read:jira-user offline_access',
        VITE_JIRA_CALLBACK_URL: import.meta.env.VITE_JIRA_CALLBACK_URL || 'http://localhost:5173/callback',
      };
    }
  }

  get(): AppConfig {
    if (!this.config) {
      throw new Error('Config not loaded yet. Call load() first.');
    }
    return this.config;
  }
}

export const runtimeConfig = new RuntimeConfig();
