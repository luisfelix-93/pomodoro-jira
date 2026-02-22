import { useEffect, useState } from 'react';
import { Play, Pause, Square, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimerMode } from '@/store/useTimerStore';

// We receive this state from IPC, it's not our local Zustand state
// because the main window is the source of truth!
interface MiniTimerState {
  mode: TimerMode;
  timeLeft: number;
  timeElapsed: number;
  isRunning: boolean;
  totalDuration: number;
  taskCode?: string | null;
}

export function MiniTimer() {
  const [state, setState] = useState<MiniTimerState>({
    mode: 'IDLE',
    timeLeft: 0,
    timeElapsed: 0,
    isRunning: false,
    totalDuration: 0,
  });

  useEffect(() => {
    // Escuta atualizações de estado vindas da janela principal
    const cleanup = window.electron?.onStateSynced((newState: MiniTimerState) => {
      setState(newState);
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const handleAction = (action: 'play' | 'pause' | 'stop') => {
    window.electron?.sendTimerAction(action);
  };

  const handleExpand = () => {
    window.electron?.expandMainWindow();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const displayTime = state.mode === 'STOPWATCH' ? state.timeElapsed : state.timeLeft;

  return (
    <div className="w-screen h-screen flex flex-col bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl webkit-app-region-drag select-none group">
      
      {/* Top Bar (Draggable Area) */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
            {state.mode === 'FOCUS' ? 'Pomodoro' : 
             state.mode === 'STOPWATCH' ? 'Stopwatch' : 
             state.mode === 'SHORT_BREAK' ? 'Short Break' : 
             state.mode === 'LONG_BREAK' ? 'Long Break' : 'Idle'}
          </span>
          {state.taskCode && (
            <span className="text-xs font-semibold text-indigo-400">
              {state.taskCode}
            </span>
          )}
        </div>
        
        <button 
          onClick={handleExpand}
          className="webkit-app-region-no-drag p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          title="Expand to Full App"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-between px-4">
        
        <div className="text-4xl font-light tracking-tight text-white font-mono">
          {formatTime(displayTime)}
        </div>

        <div className="flex items-center gap-2 webkit-app-region-no-drag">
          {state.isRunning ? (
            <button
              onClick={() => handleAction('pause')}
              className="p-2.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
            >
              <Pause className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button
              onClick={() => handleAction('play')}
              className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          )}
          
          <button
            onClick={() => handleAction('stop')}
            className={cn(
              "p-2.5 rounded-full bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 transition-all active:scale-95",
              state.mode === 'IDLE' && "opacity-50 pointer-events-none"
            )}
            title="Stop Timer"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        </div>

      </div>

      {/* Progress Bar (Optional, visual flair for Countdown) */}
      {state.mode !== 'STOPWATCH' && state.totalDuration > 0 && (
         <div className="h-1 bg-white/10 w-full relative">
            <div 
              className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-1000 ease-linear"
               style={{ width: `${(1 - (state.timeLeft / state.totalDuration)) * 100}%` }}
            />
         </div>
      )}

    </div>
  );
}
