import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JiraUser } from '@/types';
import { jiraApi } from '@/services/api/jira';

interface AuthState {
  isAuthenticated: boolean;
  domain: string;
  email: string;
  token: string | null;
  user: JiraUser | null;
  isLoading: boolean;
  error: string | null;
  
  login: (domain: string, email: string, token: string) => Promise<void>;
  logout: () => void;
  setUser: (user: JiraUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set: any) => ({
      isAuthenticated: false,
      domain: '',
      email: '',
      token: null,
      user: null,
      isLoading: false,
      error: null,

      login: async (domain, email, token) => {
        set({ isLoading: true, error: null });
        try {
            // update state first 
            set({ domain, email, token });
            
            // verify credentials via Backend Proxy
            try {
                const response = await jiraApi.login(domain, email, token);
                
                if (response.success) {
                    set({ 
                        isAuthenticated: true, 
                        user: { 
                            accountId: response.user.accountId, 
                            displayName: response.user.displayName,
                            email: email,
                            active: true,
                            avatarUrls: {} as any
                        },
                        isLoading: false
                    });
                } else {
                    throw new Error('Login failed');
                }
            } catch (apiError: any) {
                // If API fails, revert sensitive state
                set({ 
                    isAuthenticated: false, 
                    token: null, 
                    user: null,
                    error: apiError.response?.data?.error || 'Authentication failed. Please check your credentials.'
                });
                set({ isLoading: false }); 
            }
        } catch (error) {
            set({ error: 'An unexpected error occurred', isLoading: false });
        }
      },

      logout: () => set({ 
        isAuthenticated: false, 
        token: null, 
        user: null 
      }),

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({ domain: state.domain, email: state.email }) as any, 
    }
  ) as any
);
