import { create } from 'zustand';

export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK' | 'STOPWATCH' | 'IDLE';

interface TimerState {
  mode: TimerMode;
  timeLeft: number; // in seconds
  timeElapsed: number; // in seconds, tracks total time spent
  isRunning: boolean;
  totalDuration: number;
  lastTickTime: number | null;

  start: () => void;
  pause: () => void;
  stop: () => void;
  tick: () => void;
  setMode: (mode: TimerMode) => void;
}

const DURATIONS: Record<TimerMode, number> = {
    FOCUS: 25 * 60,
    SHORT_BREAK: 5 * 60,
    LONG_BREAK: 15 * 60,
    STOPWATCH: 0,
    IDLE: 0
};

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'FOCUS',
  timeLeft: DURATIONS.FOCUS,
  timeElapsed: 0,
  totalDuration: DURATIONS.FOCUS,
  isRunning: false,
  lastTickTime: null,

  start: () => set({ isRunning: true, lastTickTime: Date.now() }),
  pause: () => set({ isRunning: false, lastTickTime: null }),
  
  stop: () => {
     const state = get();
     set({ 
        isRunning: false, 
        timeLeft: DURATIONS[state.mode],
        timeElapsed: 0,
        lastTickTime: null
     });
  },

  tick: () => {
    const state = get();
    if (!state.isRunning || !state.lastTickTime) return;

    const now = Date.now();
    // Calculate how many actual seconds passed since the last tick (could be > 1 if PC slept)
    // To handle setInterval inaccuracies, we accumulate milliseconds. But for simplicity,
    // we just see if at least 1000ms passed and deduct/add the exact whole seconds.
    const deltaMs = now - state.lastTickTime;
    const deltaSeconds = Math.floor(deltaMs / 1000);

    if (deltaSeconds >= 1) {
        if (state.mode === 'STOPWATCH') {
            set({ 
                timeElapsed: state.timeElapsed + deltaSeconds,
                lastTickTime: now - (deltaMs % 1000) // Keep the remainder for accuracy
            });
        } else {
            if (state.timeLeft - deltaSeconds <= 0) {
                set({ isRunning: false, timeLeft: 0, lastTickTime: null });
            } else {
                set({ 
                    timeLeft: state.timeLeft - deltaSeconds, 
                    timeElapsed: state.timeElapsed + deltaSeconds,
                    lastTickTime: now - (deltaMs % 1000)
                });
            }
        }
    }
  },

  setMode: (mode) => set({ 
    mode, 
    timeLeft: DURATIONS[mode], 
    totalDuration: DURATIONS[mode],
    timeElapsed: 0,
    isRunning: false,
    lastTickTime: null
  }),
}));
