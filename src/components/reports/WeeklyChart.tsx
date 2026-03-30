import type { DailyAggregate } from '@/store/useReportsStore';

interface WeeklyChartProps {
  aggregates: DailyAggregate[];
  maxSeconds?: number;
}

function formatHours(seconds: number): string {
  const h = (seconds / 3600).toFixed(1);
  return `${h}h`;
}

const DAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

export function WeeklyChart({ aggregates, maxSeconds }: WeeklyChartProps) {
  const effectiveMax =
    maxSeconds ||
    Math.max(...aggregates.map((d) => d.totalSeconds), 8 * 3600);

  return (
    <div className="flex items-end justify-between gap-3 h-44 px-2">
      {aggregates.map((day, i) => {
        const ratio = effectiveMax > 0 ? day.totalSeconds / effectiveMax : 0;
        const heightPercent = Math.max(ratio * 100, 2);
        const isEmpty = day.totalSeconds === 0;

        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            {/* Hours label */}
            <span
              className={`text-[11px] font-medium tabular-nums transition-colors ${
                isEmpty ? 'text-white/15' : 'text-white/60'
              }`}
            >
              {isEmpty ? '—' : formatHours(day.totalSeconds)}
            </span>

            {/* Bar container */}
            <div className="w-full flex justify-center h-28">
              <div className="relative w-10 h-full flex items-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ease-out ${
                    isEmpty
                      ? 'bg-white/5'
                      : 'bg-gradient-to-t from-orbit-orange/80 to-orbit-orange/40'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Glow effect for non-empty bars */}
                  {!isEmpty && (
                    <div className="absolute inset-0 rounded-t-lg bg-orbit-orange/20 blur-md -z-10" />
                  )}
                </div>
              </div>
            </div>

            {/* Day label */}
            <span
              className={`text-xs font-medium uppercase tracking-wider transition-colors ${
                isEmpty ? 'text-white/20' : 'text-white/50'
              }`}
            >
              {DAY_LABELS[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
