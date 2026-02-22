import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jiraApi } from '@/services/api/jira';

interface AuthState {
  isAuthenticated: boolean;
  domain: string | null;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      domain: null,
      user: null,
      isLoading: true, // Start true while we check session
      error: null,

      checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await jiraApi.getStatus();
            if (response.isAuthenticated) {
                set({ 
                    isAuthenticated: true, 
                    domain: response.user?.domain,
                    user: response.user,
                    isLoading: false
                });
            } else {
                set({ isAuthenticated: false, isLoading: false, domain: null, user: null });
            }
        } catch (error) {
            console.error('Check auth error:', error);
            set({ isAuthenticated: false, isLoading: false, error: 'Could not verify session' });
        }
      },

      logout: async () => {
        try {
          await jiraApi.logout();
        } catch (error) {
          console.error('Backend logout failed:', error);
        }
        set({ 
          isAuthenticated: false, 
          domain: null,
          user: null 
        });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({ domain: state.domain }) as any, 
    }
  ) 
);
