import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { OrbitButton } from '@/components/ui/OrbitButton';
import { format, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface DateSelectorProps {
  selectedDate: Date;
  viewMode: 'daily' | 'weekly';
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

function formatDateLabel(date: Date, viewMode: 'daily' | 'weekly'): string {
  if (viewMode === 'daily') {
    return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
  }

  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 4);
  return `${format(weekStart, 'dd MMM', { locale: ptBR })} — ${format(weekEnd, 'dd MMM yyyy', { locale: ptBR })}`;
}

export function DateSelector({
  selectedDate,
  viewMode,
  onPrevious,
  onNext,
  onToday,
}: DateSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <OrbitButton size="sm" variant="ghost" onClick={onPrevious}>
        <ChevronLeft className="w-4 h-4" />
      </OrbitButton>

      <button
        onClick={onToday}
        className="text-sm font-medium text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 min-w-[220px] text-center capitalize"
      >
        {formatDateLabel(selectedDate, viewMode)}
      </button>

      <OrbitButton size="sm" variant="ghost" onClick={onNext}>
        <ChevronRight className="w-4 h-4" />
      </OrbitButton>

      <OrbitButton
        size="sm"
        variant="secondary"
        onClick={onToday}
        className="ml-1 gap-1.5"
      >
        <Calendar className="w-3.5 h-3.5" />
        Hoje
      </OrbitButton>
    </div>
  );
}
