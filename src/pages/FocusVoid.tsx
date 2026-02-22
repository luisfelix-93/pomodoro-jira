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
  const { isRunning, start, pause, stop, timeLeft, timeElapsed, totalDuration, mode, setMode } = useTimerStore();
  const { formatTime } = usePomodoro();
  const { getActiveIssue } = useTaskStore();
  const activeIssue = getActiveIssue();
  
  const [showNotation, setShowNotation] = useState(false);

  // Calculate progress for ring
  const progress = mode === 'STOPWATCH' 
    ? (timeElapsed > 0 ? 100 : 0) // Full ring when running, empty when not
    : ((totalDuration - timeLeft) / totalDuration) * 100;

  const handleStop = () => {
    pause(); // Pause timer while noting
    setShowNotation(true);
  };

  const handleNotationComplete = async (note: string) => {
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
            {formatTime(mode === 'STOPWATCH' ? timeElapsed : timeLeft)}
          </div>
        </TimerRing>
        
        <div className="flex flex-col items-center gap-6">
           {/* Mode Selector - Only visible when timer hasn't started */}
           {!isRunning && (mode !== 'STOPWATCH' && totalDuration === timeLeft || mode === 'STOPWATCH' && timeElapsed === 0) && (
              <div className="flex bg-black/40 border border-white/10 rounded-full p-1 mb-2">
                 <button 
                   onClick={() => setMode('FOCUS')}
                   className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-colors ${mode === 'FOCUS' ? 'bg-orbit-orange text-black' : 'text-white/50 hover:text-white'}`}
                 >
                    POMODORO
                 </button>
                 <button 
                   onClick={() => setMode('STOPWATCH')}
                   className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-colors ${mode === 'STOPWATCH' ? 'bg-orbit-orange text-black' : 'text-white/50 hover:text-white'}`}
                 >
                    FOCUS
                 </button>
              </div>
           )}

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
      </div>

      <NotationModal 
        isOpen={showNotation} 
        onClose={() => setShowNotation(false)}
        onSave={handleNotationComplete}
      />
    </div>
  );
}
