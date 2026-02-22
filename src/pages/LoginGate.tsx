import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { OrbitButton } from '@/components/ui/OrbitButton';
import { StarField } from '@/components/layout/StarField';
import { Rocket, Key, Globe, Mail } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function LoginGate() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(domain, email, token);
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

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Jira Domain
            </label>
            <input 
              type="text" 
              placeholder="company.atlassian.net"
              className="w-full bg-space-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-orbit-orange transition-colors"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
             <input 
              type="email" 
              placeholder="you@company.com"
              className="w-full bg-space-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-orbit-orange transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Key className="w-4 h-4" /> API Token
            </label>
            <input 
              type="password" 
              placeholder="••••••••••••••••"
              className="w-full bg-space-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-orbit-orange transition-colors"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <OrbitButton type="submit" disabled={isLoading} className="mt-2 w-full text-white font-bold">
            {isLoading ? 'Connecting...' : 'Connect to Jira'}
          </OrbitButton>
        </form>
      </GlassPanel>
      
      <div className="absolute bottom-4 text-white/20 text-xs">
        v0.0.1 • FocusApp
      </div>
    </div>
  );
}
