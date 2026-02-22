import { create } from 'zustand';

export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK' | 'STOPWATCH' | 'IDLE';

interface TimerState {
  mode: TimerMode;
  timeLeft: number; // in seconds
  timeElapsed: number; // in seconds, tracks total time spent
  isRunning: boolean;
  totalDuration: number;

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

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  
  stop: () => {
     const state = get();
     set({ 
        isRunning: false, 
        timeLeft: DURATIONS[state.mode],
        timeElapsed: 0
     });
  },

  tick: () => {
    const state = get();
    if (!state.isRunning) return;
    
    if (state.mode === 'STOPWATCH') {
        set({ timeElapsed: state.timeElapsed + 1 });
    } else {
        if (state.timeLeft <= 0) {
            set({ isRunning: false, timeLeft: 0 });
        } else {
            set({ timeLeft: state.timeLeft - 1, timeElapsed: state.timeElapsed + 1 });
        }
    }
  },

  setMode: (mode) => set({ 
    mode, 
    timeLeft: DURATIONS[mode], 
    totalDuration: DURATIONS[mode],
    timeElapsed: 0,
    isRunning: false 
  }),
}));
