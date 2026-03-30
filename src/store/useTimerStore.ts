import { create } from 'zustand';

export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK' | 'STOPWATCH' | 'IDLE';

interface TimerState {
  mode: TimerMode;
  timeLeft: number; // in seconds
  timeElapsed: number; // in seconds, tracks total time spent
  isRunning: boolean;
  totalDuration: number;
  lastTickTime: number | null;
  isPromptingWorklog: boolean;

  focusDuration: number; // in minutes

  start: () => void;
  pause: () => void;
  stop: () => void;
  tick: () => void;
  setMode: (mode: TimerMode) => void;
  setPromptingWorklog: (prompting: boolean) => void;
  setFocusDuration: (minutes: number) => void;
}

const getDurations = (focusDurationMinutes: number): Record<TimerMode, number> => ({
    FOCUS: focusDurationMinutes * 60,
    SHORT_BREAK: 5 * 60,
    LONG_BREAK: 15 * 60,
    STOPWATCH: 0,
    IDLE: 0
});

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'IDLE',
  focusDuration: 25,
  timeLeft: 0,
  timeElapsed: 0,
  totalDuration: 0,
  isRunning: false,
  lastTickTime: null,
  isPromptingWorklog: false,

  start: () => set({ isRunning: true, lastTickTime: Date.now() }),
  pause: () => set({ isRunning: false, lastTickTime: null }),
  
  stop: () => {
     set({ 
        mode: 'IDLE',
        isRunning: false, 
        timeLeft: 0,
        totalDuration: 0,
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
                set({ 
                    isRunning: false, 
                    timeLeft: 0, 
                    lastTickTime: null,
                    isPromptingWorklog: state.mode === 'FOCUS'
                });
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

  setMode: (mode) => {
    const durations = getDurations(get().focusDuration);
    set({ 
      mode, 
      timeLeft: durations[mode], 
      totalDuration: durations[mode],
      timeElapsed: 0,
      isRunning: false,
      lastTickTime: null
    });
  },

  setPromptingWorklog: (isPromptingWorklog) => set({ isPromptingWorklog }),

  setFocusDuration: (minutes) => {
    const state = get();
    const isFocus = state.mode === 'FOCUS';
    const newTotal = minutes * 60;
    set({ 
        focusDuration: minutes,
        ...(isFocus && !state.isRunning ? { 
            timeLeft: newTotal, 
            totalDuration: newTotal 
        } : {})
    });
  }
}));
