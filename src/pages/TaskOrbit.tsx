import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/layout/StarField';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { OrbitButton } from '@/components/ui/OrbitButton';
import { useTaskStore } from '@/store/useTaskStore';
import { useAuthStore } from '@/store/useAuthStore';
import { RefreshCw, Play, History as HistoryIcon, CalendarDays, PieChart } from 'lucide-react';

export function TaskOrbit() {
  const navigate = useNavigate();
  const { issues, fetchTasks, isLoading, setActiveTask, activeTaskId } = useTaskStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStartFocus = (issueId: string) => {
    setActiveTask(issueId);
    navigate('/focus');
  };

  return (
    <div className="relative min-h-screen w-full p-8 flex flex-col overflow-hidden">
      <StarField />
      
      {/* Header */}
      <div className="z-10 flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-glow">
            Orbit Command
        </h1>
        <div className="flex gap-4">
             <OrbitButton size="sm" variant="secondary" onClick={() => navigate('/worklog')}>
                <CalendarDays className="w-4 h-4 mr-2" />
                Worklog
             </OrbitButton>
             <OrbitButton size="sm" variant="secondary" onClick={() => navigate('/reports')}>
                <PieChart className="w-4 h-4 mr-2" />
                Reports
             </OrbitButton>
             <OrbitButton size="sm" variant="secondary" onClick={() => navigate('/ledger')}>
                <HistoryIcon className="w-4 h-4 mr-2" />
                History
             </OrbitButton>
             <OrbitButton size="sm" variant="secondary" onClick={fetchTasks} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Sync Jira
             </OrbitButton>
             <OrbitButton size="sm" variant="danger" onClick={async () => { await logout(); navigate('/'); }}>Logout</OrbitButton>
        </div>
      </div>
      
      <div className="z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
         {/* Task List */}
         <GlassPanel className="col-span-1 lg:col-span-1 flex flex-col h-full max-h-[calc(100vh-140px)]">
            <h2 className="text-xl font-medium mb-4 text-orbit-orange/80 uppercase tracking-widest text-xs">Assigned to Me</h2>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {issues.length === 0 && !isLoading && (
                    <div className="text-center py-10 text-white/30 italic">
                        No active tasks found in orbit.
                    </div>
                )}
                
                {issues.map((issue) => (
                    <div 
                        key={issue.id}
                        onClick={() => setActiveTask(issue.key)}
                        className={`group p-4 rounded-lg border transition-all cursor-pointer hover:bg-white/5
                            ${activeTaskId === issue.key 
                                ? 'bg-white/10 border-orbit-orange/50 shadow-[0_0_15px_rgba(255,107,0,0.2)]' 
                                : 'bg-black/20 border-white/5 hover:border-white/20'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                                <h3 className="font-medium text-sm text-balance leading-relaxed text-white/90 group-hover:text-white transition-colors">
                                    {issue.fields.summary}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/50">
                                        {issue.key}
                                    </span>
                                    {issue.fields.priority?.iconUrl && (
                                        <img src={issue.fields.priority.iconUrl} alt="Priority" className="w-4 h-4 opacity-70" />
                                    )}
                                    <span className="text-[10px] uppercase tracking-wider text-orbit-orange/70">
                                        {issue.fields.status.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         </GlassPanel>

         {/* Active Task Details */}
         <GlassPanel className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center p-12 h-full text-center relative border-orbit-orange/20">
            {activeTaskId ? (
                <div className="animate-in fade-in zoom-in duration-300">
                    <div className="absolute top-4 right-4 text-xs font-mono text-white/20">
                        {activeTaskId}
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 max-w-2xl leading-tight">
                        {issues.find(i => i.key === activeTaskId)?.fields.summary}
                    </h2>
                    
                    <p className="text-white/40 mb-12 text-lg">
                        Ready to extract focus from this task?
                    </p>

                    <OrbitButton size="lg" onClick={() => handleStartFocus(activeTaskId)} className="text-lg px-12 py-6 shadow-[0_0_30px_rgba(255,107,0,0.3)] hover:shadow-[0_0_50px_rgba(255,107,0,0.5)] transition-shadow">
                        <Play className="w-6 h-6 mr-3 fill-current" />
                        INITIATE FOCUS
                    </OrbitButton>
                </div>
            ) : (
                 <div className="flex flex-col items-center gap-4 text-white/20">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 animate-[spin_10s_linear_infinite]" />
                    <p>Select a task from the list to engage thrusters.</p>
                 </div>
            )}
         </GlassPanel>
      </div>
    </div>
  );
}
