import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Square, ArrowLeft } from 'lucide-react';
import { OrbitButton } from '@/components/ui/OrbitButton';
import { TimerRing } from '@/components/ui/TimerRing';
import { StarField } from '@/components/layout/StarField';
import { NotationModal } from '@/components/ui/NotationModal';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useTaskStore } from '@/store/useTaskStore';
import { useTimerStore } from '@/store/useTimerStore';
import { jiraApi } from '@/services/api/jira';

export function FocusVoid() {
  const navigate = useNavigate();
  const { isRunning, start, pause, stop, timeLeft, totalDuration, mode } = useTimerStore();
  const { formatTime } = usePomodoro();
  const { getActiveIssue } = useTaskStore();
  const activeIssue = getActiveIssue();
  
  const [showNotation, setShowNotation] = useState(false);

  // Calculate progress for ring
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  const handleStop = () => {
    pause(); // Pause timer while noting
    setShowNotation(true);
  };

  const handleNotationComplete = async (note: string) => {
    if (activeIssue && activeIssue.key) {
        try {
            await jiraApi.addWorklog(activeIssue.key, {
                timeSpentSeconds: totalDuration - timeLeft,
                comment: note,
                started: new Date().toISOString()
            });
            console.log(`Saved note for ${activeIssue.key}`);
        } catch (error) {
            console.error('Failed to save worklog:', error);
            // In a real app we'd show a toast here
        }
    }
    stop();
    setShowNotation(false);
    navigate('/orbit');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <StarField />

      <button 
        onClick={() => navigate('/orbit')}
        className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Orbit
      </button>

      <div className="z-10 flex flex-col items-center gap-8 animate-float">
        <div className="text-center space-y-2">
            <h2 className="text-orbit-orange font-bold text-xl tracking-widest uppercase">{mode} MODE</h2>
            <h1 className="text-4xl font-bold max-w-md leading-tight">
                {activeIssue ? activeIssue.fields.summary : 'No Active Task'}
            </h1>
            <p className="text-white/40 font-mono">{activeIssue?.key}</p>
        </div>

        <TimerRing progress={progress} size={320}>
          <div className="text-6xl font-bold font-mono tracking-tighter">
            {formatTime(timeLeft)}
          </div>
        </TimerRing>
        
        <div className="flex items-center gap-6">
           {!isRunning ? (
              <OrbitButton size="lg" onClick={start} className="pl-8 pr-6">
                <Play className="w-6 h-6 fill-current" /> RESUME
              </OrbitButton>
           ) : (
              <OrbitButton size="lg" variant="secondary" onClick={pause}>
                <Pause className="w-6 h-6 fill-current" /> PAUSE
              </OrbitButton>
           )}
           
           <OrbitButton variant="danger" size="lg" onClick={handleStop}>
             <Square className="w-5 h-5 fill-current" /> STOP
           </OrbitButton>
        </div>
      </div>

      <NotationModal 
        isOpen={showNotation} 
        onClose={() => setShowNotation(false)}
        onSave={handleNotationComplete}
      />
    </div>
  );
}
