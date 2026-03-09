import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface AuthState {
  isAuthenticated: boolean;
  domain: string | null;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  
  login: (tokens: { accessToken: string, refreshToken: string, expiresIn: number, scope: string, cloudId: string }) => void;
  logout: () => Promise<void>;
  setUser: (user: any) => void;
  setAuthError: (error: string) => void;
  setLoading: (isLoading: boolean) => void;
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
    scope: string | null;
    cloudId: string | null;
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      domain: null,
      user: null,
      isLoading: false, // Moved session checking to OIDC auth context
      error: null,
      tokens: {
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        scope: null,
        cloudId: null
      },

      login: (tokens) => {
        set({
          isAuthenticated: true,
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: Date.now() + tokens.expiresIn * 1000,
            scope: tokens.scope,
            cloudId: tokens.cloudId
          },
          isLoading: false,
          error: null
        });
      },

      logout: async () => {
        // We'll trust the OIDC client to handle the actual IdP logout
        set({ 
          isAuthenticated: false, 
          domain: null,
          user: null,
          tokens: {
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            scope: null,
            cloudId: null
          }
        });
      },

      setUser: (user) => set({ user }),
      setAuthError: (error) => set({ error, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({ domain: state.domain, tokens: state.tokens }) as any, 
    }
  ) 
);
