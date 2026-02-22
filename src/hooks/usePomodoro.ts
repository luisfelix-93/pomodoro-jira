import { useEffect } from 'react';
import { useTimerStore } from '@/store/useTimerStore';

export function usePomodoro() {
  const { isRunning, tick, timeLeft, timeElapsed, mode, stop, pause } = useTimerStore();
  // const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      // Just run the tick every 1000ms. 
      // The tick() function inside useTimerStore will handle checking 
      // if time is up, or if absolute time elapsed has skipped forward.
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    // Focus Mode checks run on state changes, NOT inside the interval creation block
    // We check this separately whenever timeElapsed changes.
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  useEffect(() => {
     if (isRunning && mode === 'STOPWATCH' && timeElapsed > 0) {
        if (timeElapsed >= 8 * 3600) {
            pause();
            new Notification("Focus Limit Reached", { body: "You've been focusing for 8 hours. Time to take a long break!" });
        }
        else if (timeElapsed % 3600 === 0) {
            new Notification("Still focusing?", { body: `You've been working for ${timeElapsed / 3600} hour(s).` });
        }
     }
  }, [timeElapsed, mode, isRunning, pause]);

  useEffect(() => {
     if (isRunning && mode !== 'STOPWATCH' && timeLeft === 0) {
        stop();
        new Notification("Pomodoro Finished!", { body: `Time for a ${mode === 'FOCUS' ? 'break' : 'focus session'}.` });
     }
  }, [timeLeft, mode, isRunning, stop]);

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
