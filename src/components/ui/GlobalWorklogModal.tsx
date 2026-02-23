import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { OrbitButton } from '@/components/ui/OrbitButton';
import { X } from 'lucide-react';
import { useTimerStore } from '@/store/useTimerStore';
import { useTaskStore } from '@/store/useTaskStore';
import { jiraApi } from '@/services/api/jira';

export function GlobalWorklogModal() {
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  
  const { 
    isPromptingWorklog, 
    setPromptingWorklog, 
    mode, 
    timeElapsed, 
    timeLeft, 
    totalDuration, 
    stop 
  } = useTimerStore();
  
  const { getActiveIssue } = useTaskStore();
  const activeIssue = getActiveIssue();

  if (!isPromptingWorklog) return null;

  const handleClose = () => {
    // Just hide the modal, let the user resume the timer if they paused
    setPromptingWorklog(false);
  };

  const handleSave = async () => {
    if (activeIssue && activeIssue.key) {
        try {
            const timeSpentSeconds = mode === 'STOPWATCH' ? timeElapsed : totalDuration - timeLeft;
            await jiraApi.addWorklog(activeIssue.key, {
                timeSpentSeconds,
                comment: note,
                started: new Date().toISOString()
            });
            console.log(`Saved note for ${activeIssue.key}`);
        } catch (error) {
            console.error('Failed to save worklog:', error);
            // In a real app we'd show a toast here
        }
    }
    
    // Cleanup and navigate
    stop();
    setPromptingWorklog(false);
    setNote('');
    navigate('/orbit');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
       <GlassPanel intensity="high" className="w-full max-w-lg p-6 animate-float" style={{ animationDuration: '0s' }}>
          <div className="flex justify-between items-center mb-6">
             <div>
               <h2 className="text-xl font-bold">Session Complete</h2>
               {activeIssue && (
                 <p className="text-sm text-orbit-orange mt-1 font-mono">{activeIssue.key}: {activeIssue.fields.summary}</p>
               )}
             </div>
             <button onClick={handleClose} className="text-white/40 hover:text-white transition-colors self-start mt-1">
                <X className="w-5 h-5" />
             </button>
          </div>

          <div className="mb-6">
             <label className="block text-sm font-medium text-white/60 mb-2">
                What did you work on?
             </label>
             <textarea 
                className="w-full bg-space-black/50 border border-white/10 rounded-lg p-3 h-24 focus:outline-none focus:border-orbit-orange resize-none"
                placeholder="Added login validation..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
             />
          </div>

          <div className="flex gap-4 justify-end">
             <OrbitButton variant="secondary" size="md" onClick={handleClose}>Resume Timer</OrbitButton>
             <OrbitButton size="md" onClick={handleSave}>Save Worklog</OrbitButton>
          </div>
       </GlassPanel>
    </div>
  );
}
