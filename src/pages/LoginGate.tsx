import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { OrbitButton } from '@/components/ui/OrbitButton';
import { StarField } from '@/components/layout/StarField';
import { Rocket } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { redirectToLogin } from '@/auth/jiraAuth';

export function LoginGate() {
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAuthStore();

  const handleLogin = () => {
    redirectToLogin();
  };

  useEffect(() => {
    if (isAuthenticated) {
        navigate('/orbit');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <StarField />
      
      <GlassPanel className="w-full max-w-md p-8 flex flex-col items-center gap-8 animate-float">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-orbit-orange/10 p-4 rounded-full border border-orbit-orange/20">
            <Rocket className="w-10 h-10 text-orbit-orange" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">FocusApp</h1>
          <p className="text-white/60 text-center">
            Connect your Jira account to start orbiting your tasks.
          </p>
        </div>

        {error && (
            <div className="w-full bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm text-center">
                {error}
            </div>
        )}

        <div className="w-full flex flex-col gap-4">
          <OrbitButton onClick={handleLogin} disabled={isLoading} className="mt-2 w-full text-white font-bold h-12">
            {isLoading ? 'Checking session...' : 'Login with Atlassian'}
          </OrbitButton>
        </div>
      </GlassPanel>
      
      <div className="absolute bottom-4 flex flex-col items-center gap-1 text-white/20 text-xs hover:text-white/40 transition-colors">
        <span>v0.0.8 • FocusApp</span>
        <a 
          href="https://github.com/luisfelix-93/pomodoro-jira/blob/main/docs/PRIVACY.md" 
          target="_blank" 
          rel="noreferrer"
          className="underline hover:text-white/60 transition-colors"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
