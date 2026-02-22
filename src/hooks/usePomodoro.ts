import { useEffect } from 'react';
import { useTimerStore } from '@/store/useTimerStore';

export function usePomodoro() {
  const { isRunning, tick, timeLeft, mode, stop } = useTimerStore();
  // const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
        // Timer finished
        stop();
        // Here we would trigger notification and sound
        new Notification("Pomodoro Finished!", { body: `Time for a ${mode === 'FOCUS' ? 'break' : 'focus session'}.` });
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, tick, stop, mode]);

  return {
    formatTime: (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
  };
}
