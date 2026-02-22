import { useEffect, useState } from 'react';
import { StarField } from '@/components/layout/StarField';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { OrbitButton } from '@/components/ui/OrbitButton';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, RefreshCw, Trash2 } from 'lucide-react';
import { jiraApi } from '@/services/api/jira';

interface Worklog {
    id: string | number;
    issueKey: string;
    comment: string;
    durationSeconds: number;
    startTime: string; // ISO
    jiraWorklogId?: string;
}

export function LogLedger() {
  const navigate = useNavigate();
  const [worklogs, setWorklogs] = useState<Worklog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWorklogs = async () => {
    setIsLoading(true);
    try {
        const data = await jiraApi.getWorklogs();
        // Sort by start time desc
        const sorted = data.sort((a: Worklog, b: Worklog) => 
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        setWorklogs(sorted);
    } catch (error) {
        console.error('Failed to fetch worklogs', error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSync = async () => {
      setIsLoading(true);
      try {
          await jiraApi.syncWorklogs();
          await fetchWorklogs();
      } catch (error) {
          console.error('Sync failed', error);
      } finally {
          setIsLoading(false);
      }
  };

  const handleDelete = async (id: string | number) => {
      if (!confirm('Are you sure you want to delete this worklog?')) return;
      
      try {
          await jiraApi.deleteWorklog(id);
          setWorklogs(prev => prev.filter(log => log.id !== id));
      } catch (error) {
          console.error('Failed to delete worklog', error);
          alert('Failed to delete worklog');
      }
  };

  useEffect(() => {
    fetchWorklogs();
  }, []);

  return (
    <div className="relative min-h-screen w-full p-8 flex flex-col">
      <StarField />
      
      <div className="flex justify-between items-center mb-8 z-10">
        <div className="flex items-center gap-4">
             <OrbitButton size="sm" variant="ghost" onClick={() => navigate('/orbit')}>
                <ArrowLeft className="w-5 h-5" />
             </OrbitButton>
             <h1 className="text-2xl font-bold">Log Ledger</h1>
        </div>
        <OrbitButton size="sm" className="gap-2" onClick={handleSync} disabled={isLoading}>
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Sync to Jira
        </OrbitButton>
      </div>
      
      <GlassPanel className="flex-1 p-6 relative overflow-hidden z-10 flex flex-col">
         {worklogs.length === 0 && !isLoading && (
             <div className="text-center text-white/30 italic mt-20">
                 No worklogs recorded locally. Start a focus session!
             </div>
         )}
         
         <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
             {worklogs.map((log) => (
                 <div key={log.id} className="bg-white/5 border border-white/5 p-4 rounded-lg flex justify-between items-center hover:bg-white/10 transition-colors group">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-orbit-orange text-sm font-bold">{log.issueKey}</span>
                            <span className="text-xs text-white/40">
                                {new Date(log.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                             {log.jiraWorklogId && (
                                <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">Synced</span>
                            )}
                        </div>
                        <p className="text-sm text-white/80">{log.comment || 'No description'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xl font-mono font-bold text-white/60">
                            {Math.floor(log.durationSeconds / 60)}m
                        </div>
                        <button 
                            onClick={() => handleDelete(log.id)}
                            className="text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2"
                            title="Delete Worklog"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                 </div>
             ))}
         </div>
      </GlassPanel>
    </div>
  );
}
