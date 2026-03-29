import { CalendarWorklogEntry } from '@/types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface CalendarWorklogBlockProps {
  entry: CalendarWorklogEntry;
  hourHeight: number;
  startHour: number;
  onClick: (entry: CalendarWorklogEntry) => void;
}

const ISSUE_COLORS = [
  { bg: 'bg-orbit-orange/20', border: 'border-orbit-orange/40', text: 'text-orbit-orange' },
  { bg: 'bg-cyan-break/20', border: 'border-cyan-break/40', text: 'text-cyan-break' },
  { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400' },
  { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400' },
  { bg: 'bg-rose-500/20', border: 'border-rose-500/40', text: 'text-rose-400' },
  { bg: 'bg-sky-500/20', border: 'border-sky-500/40', text: 'text-sky-400' },
  { bg: 'bg-lime-500/20', border: 'border-lime-500/40', text: 'text-lime-400' },
  { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-400' },
];

function hashIssueKey(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function CalendarWorklogBlock({ entry, hourHeight, startHour, onClick }: CalendarWorklogBlockProps) {
  const entryDate = new Date(entry.startTime);
  const entryHour = entryDate.getHours() + entryDate.getMinutes() / 60;
  const durationHours = entry.durationSeconds / 3600;

  const top = (entryHour - startHour) * hourHeight;
  const height = Math.max(durationHours * hourHeight, 24);

  const colorIdx = hashIssueKey(entry.issueKey) % ISSUE_COLORS.length;
  const color = ISSUE_COLORS[colorIdx];

  const isCompact = height < 48;

  return (
    <button
      type="button"
      onClick={() => onClick(entry)}
      className={`absolute left-1 right-1 rounded-md border ${entry.verificationStatus === 'FAILED' ? 'bg-rose-500/10 border-rose-500/40 ring-1 ring-rose-500/20' : `${color.bg} ${color.border}`} hover:brightness-125 transition-all duration-150 cursor-pointer overflow-hidden z-10 text-left`}
      style={{ top: `${top}px`, height: `${height}px` }}
      title={`${entry.issueKey}: ${entry.issueSummary} (${formatDuration(entry.durationSeconds)})`}
    >
      <div className={`px-2 ${isCompact ? 'py-0.5' : 'py-1.5'}`}>
        <div className={`flex items-center gap-1.5 ${isCompact ? '' : 'mb-0.5'}`}>
          <span className={`text-[10px] font-mono font-bold ${color.text} truncate`}>
            {entry.issueKey}
          </span>
          {entry.verificationStatus === 'FAILED' && (
            <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
          )}
          {entry.verificationStatus === 'SYNCED' && (
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          )}
          <span className="text-[9px] text-white/40 ml-auto shrink-0">
            {formatDuration(entry.durationSeconds)}
          </span>
        </div>
        {!isCompact && (
          <p className="text-[11px] text-white/50 leading-tight line-clamp-2">
            {entry.issueSummary}
          </p>
        )}
      </div>
    </button>
  );
}
