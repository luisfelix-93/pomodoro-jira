import { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { Search } from 'lucide-react';
import { JiraIssue } from '@/types';

interface TicketPanelProps {
  onTicketSelect?: (issue: JiraIssue) => void;
}

const STATUS_COLORS: Record<string, string> = {
  'To Do': 'bg-white/10 text-white/70',
  'In Progress': 'bg-amber-500/20 text-amber-400',
  'Em andamento': 'bg-amber-500/20 text-amber-400',
  'Done': 'bg-emerald-500/20 text-emerald-400',
  'Resolvido': 'bg-emerald-500/20 text-emerald-400',
};

function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || 'bg-white/10 text-white/60';
}

export function TicketPanel({ onTicketSelect }: TicketPanelProps) {
  const issues = useTaskStore((s) => s.issues);
  const isLoading = useTaskStore((s) => s.isLoading);
  const [search, setSearch] = useState('');

  const filtered = issues.filter((issue) => {
    const q = search.toLowerCase();
    return (
      issue.key.toLowerCase().includes(q) ||
      issue.fields.summary.toLowerCase().includes(q)
    );
  });

  const handleDragStart = (e: React.DragEvent, issue: JiraIssue) => {
    e.dataTransfer.setData('application/json', JSON.stringify(issue));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <h2 className="text-sm font-bold tracking-widest uppercase text-white/50 px-1">
        My Tickets
      </h2>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-orbit-orange/50 placeholder:text-white/20 transition-colors"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        {isLoading && (
          <div className="text-center text-white/30 text-sm py-8">Loading tickets...</div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center text-white/30 text-sm py-8">No tickets found</div>
        )}

        {filtered.map((issue) => (
          <div
            key={issue.key}
            draggable
            onDragStart={(e) => handleDragStart(e, issue)}
            onClick={() => onTicketSelect?.(issue)}
            className="group cursor-grab active:cursor-grabbing bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-orbit-orange/30 rounded-lg p-3 transition-all duration-200 select-none"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-mono text-orbit-orange font-semibold tracking-wide">
                {issue.key}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(issue.fields.status.name)}`}>
                {issue.fields.status.name}
              </span>
            </div>
            <p className="text-sm text-white/70 leading-snug line-clamp-2 group-hover:text-white/90 transition-colors">
              {issue.fields.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
