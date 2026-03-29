import { create } from 'zustand';
import { CalendarWorklogEntry } from '@/types';
import { jiraApi } from '@/services/api/jira';
import { startOfWeek, endOfWeek, addWeeks } from 'date-fns';

interface WorklogCalendarState {
  currentWeekStart: Date;
  entries: CalendarWorklogEntry[];
  isLoading: boolean;
  error: string | null;

  navigateWeek: (direction: number) => void;
  goToCurrentWeek: () => void;
  fetchWeek: () => Promise<void>;
  addEntry: (entry: CalendarWorklogEntry) => void;
  removeEntry: (id: string | number) => void;
  updateEntry: (id: string | number, updates: Partial<CalendarWorklogEntry>) => void;
  createWorklog: (issueKey: string, issueSummary: string, startTime: string, durationSeconds: number, comment: string) => Promise<void>;
  editWorklog: (id: string | number, startTime: string, durationSeconds: number, comment: string) => Promise<void>;
  deleteWorklog: (id: string | number) => Promise<void>;
}

function getMonday(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export const useWorklogCalendarStore = create<WorklogCalendarState>((set, get) => ({
  currentWeekStart: getMonday(new Date()),
  entries: [],
  isLoading: false,
  error: null,

  navigateWeek: (direction) => {
    const { currentWeekStart } = get();
    set({ currentWeekStart: addWeeks(currentWeekStart, direction) });
  },

  goToCurrentWeek: () => {
    set({ currentWeekStart: getMonday(new Date()) });
  },

  fetchWeek: async () => {
    const { currentWeekStart } = get();
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

    const startISO = currentWeekStart.toISOString();
    const endISO = weekEnd.toISOString();

    set({ isLoading: true, error: null });

    try {
      const data = await jiraApi.getWeeklyWorklogs(startISO, endISO);

      const mapped: CalendarWorklogEntry[] = data.map((w: any) => ({
        id: w.id,
        issueKey: w.issueKey,
        issueSummary: w.task?.summary || w.issueKey,
        startTime: w.startTime,
        durationSeconds: w.durationSeconds,
        comment: w.comment || '',
        jiraWorklogId: w.jiraWorklogId,
        verificationStatus: w.verificationStatus,
      }));

      set({ entries: mapped, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch weekly worklogs:', error);
      set({ isLoading: false, error: 'Failed to load worklogs' });
    }
  },

  addEntry: (entry) => {
    set((state) => ({ entries: [...state.entries, entry] }));
  },

  removeEntry: (id) => {
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }));
  },

  updateEntry: (id, updates) => {
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  },

  createWorklog: async (issueKey, issueSummary, startTime, durationSeconds, comment) => {
    try {
      const result = await jiraApi.addWorklog(issueKey, {
        timeSpentSeconds: durationSeconds,
        comment,
        started: startTime,
      });

      const newEntry: CalendarWorklogEntry = {
        id: result.id,
        issueKey,
        issueSummary,
        startTime,
        durationSeconds,
        comment,
        verificationStatus: 'PENDING',
      };

      get().addEntry(newEntry);
    } catch (error) {
      console.error('Failed to create worklog:', error);
      throw error;
    }
  },

  editWorklog: async (id, startTime, durationSeconds, comment) => {
    try {
      await jiraApi.updateWorklog(id, { startTime, durationSeconds, comment });
      get().updateEntry(id, { startTime, durationSeconds, comment });
    } catch (error) {
      console.error('Failed to update worklog:', error);
      throw error;
    }
  },

  deleteWorklog: async (id) => {
    try {
      await jiraApi.deleteWorklog(id);
      get().removeEntry(id);
    } catch (error) {
      console.error('Failed to delete worklog:', error);
      throw error;
    }
  },
}));
