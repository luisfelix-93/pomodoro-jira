import { useReportsStore } from '@/store/useReportsStore';
import { WorklogList } from '@/components/reports/WorklogList';
import { Clock } from 'lucide-react';

export function DailyReport() {
  const getDailyEntries = useReportsStore((s) => s.getDailyEntries);
  const getDailyTotal = useReportsStore((s) => s.getDailyTotal);

  const entries = getDailyEntries();
  const totalSeconds = getDailyTotal();

  const totalHours = (totalSeconds / 3600).toFixed(1);

  return (
    <div className="flex flex-col gap-6 h-full animate-in fade-in duration-300">
      {/* Overview Card */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-white/50 uppercase tracking-widest">
            Total do Dia
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-white drop-shadow-glow">
              {totalHours}
              <span className="text-lg text-white/50 ml-1">h</span>
            </span>
          </div>
        </div>
        <div className="p-4 rounded-full bg-orbit-orange/10 text-orbit-orange">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      {/* Entries List */}
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        <h3 className="text-sm font-medium text-white/50 uppercase tracking-widest pl-1 shrink-0">
          Apontamentos
        </h3>
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <WorklogList entries={entries} mode="entries" />
        </div>
      </div>
    </div>
  );
}
