import { create } from 'zustand';
import { jiraApi } from '@/services/api/jira';

interface Worklog {
    id: string | number;
    issueKey: string;
    comment: string;
    durationSeconds: number;
    startTime: string; // ISO
    jiraWorklogId?: string;
}

interface HistoryState {
    currentDate: Date; // Controls the currently viewed month/year in the calendar
    selectedDate: Date | null; // The specific day clicked to view details
    worklogsByMonth: Record<string, Worklog[]>; // Cache: 'YYYY-MM' -> logs
    isLoading: boolean;
    error: string | null;

    setCurrentDate: (date: Date) => void;
    setSelectedDate: (date: Date | null) => void;
    fetchMonth: (month: number, year: number, forceSync?: boolean) => Promise<void>;
    deleteWorklog: (id: string | number, dateStr: string) => Promise<void>; // dateStr is 'YYYY-MM' to update cache
    syncWorklogs: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
    currentDate: new Date(),
    selectedDate: null,
    worklogsByMonth: {},
    isLoading: false,
    error: null,

    setCurrentDate: (date) => set({ currentDate: date }),
    setSelectedDate: (date) => set({ selectedDate: date }),

    fetchMonth: async (month, year, forceSync = false) => {
        const cacheKey = `${year}-${String(month).padStart(2, '0')}`;
        const { worklogsByMonth } = get();

        // Use cache if available and not forcing a sync
        if (!forceSync && worklogsByMonth[cacheKey]) {
            return; 
        }

        set({ isLoading: true, error: null });
        try {
            const data = await jiraApi.getWorklogs(month, year);
            
            // Sort by start time desc just in case
            const sorted = data.sort((a: Worklog, b: Worklog) => 
                new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
            );

            set((state) => ({
                worklogsByMonth: {
                    ...state.worklogsByMonth,
                    [cacheKey]: sorted
                },
                isLoading: false
            }));
        } catch (error) {
            console.error('Failed to fetch worklogs for month', error);
            set({ isLoading: false, error: 'Failed to load history' });
        }
    },

    deleteWorklog: async (id, dateStr) => {
        try {
            await jiraApi.deleteWorklog(id);
            set((state) => {
                const logsForMonth = state.worklogsByMonth[dateStr] || [];
                return {
                    worklogsByMonth: {
                        ...state.worklogsByMonth,
                        [dateStr]: logsForMonth.filter(log => log.id !== id)
                    }
                };
            });
        } catch (error) {
            console.error('Failed to delete worklog', error);
            throw error;
        }
    },

    syncWorklogs: async () => {
        set({ isLoading: true, error: null });
        try {
            await jiraApi.syncWorklogs();
            // After sync, invalidate/refresh the current viewed month
            const { currentDate } = get();
            await get().fetchMonth(currentDate.getMonth(), currentDate.getFullYear(), true);
        } catch (error) {
            console.error('Sync failed', error);
            set({ isLoading: false, error: 'Failed to sync with Jira' });
        }
    }
}));
