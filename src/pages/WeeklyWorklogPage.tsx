import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/layout/StarField';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { OrbitButton } from '@/components/ui/OrbitButton';
import { TicketPanel } from '@/components/worklog/TicketPanel';
import { WeeklyCalendarGrid } from '@/components/worklog/WeeklyCalendarGrid';
import { useWorklogCalendarStore } from '@/store/useWorklogCalendarStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useTaskStore } from '@/store/useTaskStore';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Upload, RefreshCw } from 'lucide-react';
import { format, addDays } from 'date-fns';

export function WeeklyWorklogPage() {
  const navigate = useNavigate();
  const { currentWeekStart, navigateWeek, goToCurrentWeek, fetchWeek, isLoading } = useWorklogCalendarStore();
  const { syncWorklogs, isLoading: isSyncing } = useHistoryStore();
  const fetchTasks = useTaskStore((s) => s.fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchWeek();
  }, [currentWeekStart, fetchWeek]);

  const handleSync = async () => {
    await syncWorklogs();
    await fetchWeek();
  };

  const weekEnd = addDays(currentWeekStart, 4);
  const weekLabel = `${format(currentWeekStart, 'dd MMM')} — ${format(weekEnd, 'dd MMM yyyy')}`;

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-hidden bg-black text-white flex flex-col pt-6 px-6 pb-4">
      <StarField />

      {/* Header */}
      <div className="flex justify-between items-center mb-4 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <OrbitButton size="sm" variant="ghost" onClick={() => navigate('/orbit')}>
            <ArrowLeft className="w-5 h-5" />
          </OrbitButton>
          <h1 className="text-xl font-bold tracking-wider">Worklog Calendar</h1>
        </div>

        {/* Week Navigation + Sync */}
        <div className="flex items-center gap-2">
          <OrbitButton size="sm" variant="ghost" onClick={() => navigateWeek(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </OrbitButton>

          <button
            onClick={goToCurrentWeek}
            className="text-sm font-medium text-white/60 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/5"
          >
            {weekLabel}
          </button>

          <OrbitButton size="sm" variant="ghost" onClick={() => navigateWeek(1)}>
            <ChevronRight className="w-4 h-4" />
          </OrbitButton>

          <OrbitButton
            size="sm"
            variant="secondary"
            onClick={goToCurrentWeek}
            className="ml-2 gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            Today
          </OrbitButton>

          <OrbitButton
            size="sm"
            className="ml-1 gap-1.5"
            onClick={handleSync}
            disabled={isSyncing}
          >
            {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            Sync to Jira
          </OrbitButton>
        </div>
      </div>

      {/* Main Content: Side-by-Side */}
      <div className="flex-1 flex gap-4 z-10 overflow-hidden">
        {/* Left Panel: Tickets */}
        <GlassPanel className="w-72 shrink-0 p-4 overflow-hidden">
          <TicketPanel />
        </GlassPanel>

        {/* Right Panel: Calendar Grid */}
        <GlassPanel className="flex-1 p-4 overflow-hidden">
          <WeeklyCalendarGrid weekStart={currentWeekStart} />
        </GlassPanel>
      </div>
    </div>
  );
}
