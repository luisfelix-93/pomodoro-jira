import { create } from 'zustand';
import { jiraApi } from '@/services/api/jira';
import {
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  format,
  parseISO,
  isSameDay,
} from 'date-fns';

export interface ReportWorklogEntry {
  id: string | number;
  issueKey: string;
  issueSummary: string;
  startTime: string;
  durationSeconds: number;
  comment: string;
}

export interface DailyAggregate {
  date: Date;
  label: string;
  totalSeconds: number;
  entries: ReportWorklogEntry[];
}

export interface TicketAggregate {
  issueKey: string;
  issueSummary: string;
  totalSeconds: number;
}

type ViewMode = 'daily' | 'weekly';

interface ReportsState {
  viewMode: ViewMode;
  selectedDate: Date;
  entries: ReportWorklogEntry[];
  isLoading: boolean;
  error: string | null;

  setViewMode: (mode: ViewMode) => void;
  setSelectedDate: (date: Date) => void;
  navigateDay: (direction: number) => void;
  navigateWeek: (direction: number) => void;
  goToToday: () => void;
  fetchReportData: () => Promise<void>;

  getDailyEntries: () => ReportWorklogEntry[];
  getDailyTotal: () => number;
  getWeeklyAggregates: () => DailyAggregate[];
  getWeeklyTotal: () => number;
  getTicketAggregates: () => TicketAggregate[];
  getClipboardText: () => string;
}

function getMonday(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  viewMode: 'daily',
  selectedDate: new Date(),
  entries: [],
  isLoading: false,
  error: null,

  setViewMode: (mode) => {
    set({ viewMode: mode });
    get().fetchReportData();
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchReportData();
  },

  navigateDay: (direction) => {
    const { selectedDate } = get();
    set({ selectedDate: addDays(selectedDate, direction) });
    get().fetchReportData();
  },

  navigateWeek: (direction) => {
    const { selectedDate } = get();
    set({ selectedDate: addWeeks(selectedDate, direction) });
    get().fetchReportData();
  },

  goToToday: () => {
    set({ selectedDate: new Date() });
    get().fetchReportData();
  },

  fetchReportData: async () => {
    const { selectedDate, viewMode } = get();

    let startDate: Date;
    let endDate: Date;

    if (viewMode === 'daily') {
      const weekStart = getMonday(selectedDate);
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
      startDate = weekStart;
      endDate = weekEnd;
    } else {
      startDate = getMonday(selectedDate);
      endDate = endOfWeek(selectedDate, { weekStartsOn: 1 });
    }

    set({ isLoading: true, error: null });

    try {
      const data = await jiraApi.getWeeklyWorklogs(
        startDate.toISOString(),
        endDate.toISOString(),
      );

      const mapped: ReportWorklogEntry[] = data.map((w: any) => ({
        id: w.id,
        issueKey: w.issueKey,
        issueSummary: w.task?.summary || w.issueKey,
        startTime: w.startTime,
        durationSeconds: w.durationSeconds,
        comment: w.comment || '',
      }));

      set({ entries: mapped, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch report data:', error);
      set({ isLoading: false, error: 'Não foi possível carregar os dados' });
    }
  },

  getDailyEntries: () => {
    const { entries, selectedDate } = get();
    return entries.filter((e) => isSameDay(parseISO(e.startTime), selectedDate));
  },

  getDailyTotal: () => {
    return get()
      .getDailyEntries()
      .reduce((sum, e) => sum + e.durationSeconds, 0);
  },

  getWeeklyAggregates: () => {
    const { entries, selectedDate } = get();
    const weekStart = getMonday(selectedDate);
    const days: DailyAggregate[] = [];

    for (let i = 0; i < 5; i++) {
      const date = addDays(weekStart, i);
      const dayEntries = entries.filter((e) =>
        isSameDay(parseISO(e.startTime), date),
      );
      days.push({
        date,
        label: format(date, 'EEE'),
        totalSeconds: dayEntries.reduce((s, e) => s + e.durationSeconds, 0),
        entries: dayEntries,
      });
    }

    return days;
  },

  getWeeklyTotal: () => {
    return get()
      .getWeeklyAggregates()
      .reduce((sum, d) => sum + d.totalSeconds, 0);
  },

  getTicketAggregates: () => {
    const { entries, selectedDate, viewMode } = get();
    const weekStart = getMonday(selectedDate);

    const relevantEntries =
      viewMode === 'daily'
        ? entries.filter((e) => isSameDay(parseISO(e.startTime), selectedDate))
        : entries.filter((e) => {
            const d = parseISO(e.startTime);
            return d >= weekStart && d <= addDays(weekStart, 4);
          });

    const map = new Map<string, TicketAggregate>();

    for (const entry of relevantEntries) {
      const existing = map.get(entry.issueKey);
      if (existing) {
        existing.totalSeconds += entry.durationSeconds;
      } else {
        map.set(entry.issueKey, {
          issueKey: entry.issueKey,
          issueSummary: entry.issueSummary,
          totalSeconds: entry.durationSeconds,
        });
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => b.totalSeconds - a.totalSeconds,
    );
  },

  getClipboardText: () => {
    const { viewMode } = get();

    if (viewMode === 'daily') {
      const dayEntries = get().getDailyEntries();
      const totalSeconds = get().getDailyTotal();

      const lines = dayEntries.map((e) => {
        const hours = (e.durationSeconds / 3600).toFixed(1);
        return `- ${e.issueKey}: ${hours}h - ${e.issueSummary}`;
      });

      const totalHours = (totalSeconds / 3600).toFixed(1);
      lines.push('', `Total: ${totalHours}h`);
      return lines.join('\n');
    }

    const tickets = get().getTicketAggregates();
    const totalSeconds = get().getWeeklyTotal();

    const lines = tickets.map((t) => {
      const hours = (t.totalSeconds / 3600).toFixed(1);
      return `- ${t.issueKey}: ${hours}h - ${t.issueSummary}`;
    });

    const totalHours = (totalSeconds / 3600).toFixed(1);
    lines.push('', `Total Semana: ${totalHours}h`);
    return lines.join('\n');
  },
}));
