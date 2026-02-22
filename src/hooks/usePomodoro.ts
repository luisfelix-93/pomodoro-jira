import { useEffect } from 'react';
import { useTimerStore } from '@/store/useTimerStore';

export function usePomodoro() {
  const { isRunning, tick, timeLeft, timeElapsed, mode, stop, pause } = useTimerStore();
  // const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && (mode === 'STOPWATCH' || timeLeft > 0)) {
      interval = setInterval(() => {
        tick();
      }, 1000);
      
      // Focus Mode checks
      if (mode === 'STOPWATCH' && timeElapsed > 0) {
        // 8-hour hard limit check
        if (timeElapsed >= 8 * 3600) {
            pause();
            new Notification("Focus Limit Reached", { body: "You've been focusing for 8 hours. Time to take a long break!" });
        }
        // 1-hour activity notification check
        else if (timeElapsed % 3600 === 0) {
            new Notification("Still focusing?", { body: `You've been working for ${timeElapsed / 3600} hour(s).` });
        }
      }

    } else if (timeLeft === 0 && isRunning && mode !== 'STOPWATCH') {
        // Pomodoro Timer finished
        stop();
        // Here we would trigger notification and sound
        new Notification("Pomodoro Finished!", { body: `Time for a ${mode === 'FOCUS' ? 'break' : 'focus session'}.` });
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timeElapsed, tick, stop, pause, mode]);

  return {
    formatTime: (seconds: number) => {
      if (seconds >= 3600 && mode === 'STOPWATCH') {
          const h = Math.floor(seconds / 3600);
          const m = Math.floor((seconds % 3600) / 60);
          const s = seconds % 60;
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
      
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
  };
}
