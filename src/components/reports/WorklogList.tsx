import type { ReportWorklogEntry, TicketAggregate } from '@/store/useReportsStore';

interface WorklogListProps {
  entries?: ReportWorklogEntry[];
  ticketAggregates?: TicketAggregate[];
  mode?: 'entries' | 'tickets';
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function WorklogList({
  entries = [],
  ticketAggregates = [],
  mode = 'entries',
}: WorklogListProps) {
  if (mode === 'tickets') {
    if (ticketAggregates.length === 0) {
      return (
        <div className="text-center py-8 text-white/25 text-sm italic">
          Nenhum ticket encontrado para este período.
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {ticketAggregates.map((ticket) => (
          <div
            key={ticket.issueKey}
            className="group flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[11px] font-mono bg-orbit-orange/15 text-orbit-orange px-2 py-0.5 rounded-md shrink-0">
                {ticket.issueKey}
              </span>
              <span className="text-sm text-white/70 truncate group-hover:text-white/90 transition-colors">
                {ticket.issueSummary}
              </span>
            </div>
            <span className="text-sm font-medium text-cyan-break/80 shrink-0 ml-4 tabular-nums">
              {formatDuration(ticket.totalSeconds)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-white/25 text-sm italic">
        Nenhum worklog registrado neste dia.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="group flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[11px] font-mono bg-orbit-orange/15 text-orbit-orange px-2 py-0.5 rounded-md shrink-0">
              {entry.issueKey}
            </span>
            <span className="text-sm text-white/70 truncate group-hover:text-white/90 transition-colors">
              {entry.issueSummary}
            </span>
          </div>
          <span className="text-sm font-medium text-cyan-break/80 shrink-0 ml-4 tabular-nums">
            {formatDuration(entry.durationSeconds)}
          </span>
        </div>
      ))}
    </div>
  );
}
