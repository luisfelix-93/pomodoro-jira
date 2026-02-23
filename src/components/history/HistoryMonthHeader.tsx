import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OrbitButton } from '@/components/ui/OrbitButton';

interface HistoryMonthHeaderProps {
    currentDate: Date;
    onDateChange: (newDate: Date) => void;
    totalHours: number;
    dailyAverage: number;
    bestDayDuration: number;
    bestDayDate: Date | null;
}

export function HistoryMonthHeader({ 
    currentDate, 
    onDateChange, 
    totalHours, 
    dailyAverage,
    bestDayDuration,
    bestDayDate
}: HistoryMonthHeaderProps) {
    const nextMonth = () => onDateChange(addMonths(currentDate, 1));
    const prevMonth = () => onDateChange(subMonths(currentDate, 1));

    return (
        <div className="flex flex-col gap-6 mb-6">
            <div className="flex items-center justify-between">
                <OrbitButton size="sm" variant="ghost" onClick={prevMonth}>
                    <ChevronLeft className="w-5 h-5" />
                </OrbitButton>
                
                <h2 className="text-xl font-bold font-mono text-white/90">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
                
                <OrbitButton size="sm" variant="ghost" onClick={nextMonth}>
                    <ChevronRight className="w-5 h-5" />
                </OrbitButton>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/5 rounded-lg p-4 flex flex-col items-center justify-center">
                    <span className="text-xs text-white/50 mb-1 uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-bold text-orbit-orange font-mono">
                        {totalHours.toFixed(1)}<span className="text-sm text-orbit-orange/60 ml-1">h</span>
                    </span>
                </div>
                
                <div className="bg-white/5 border border-white/5 rounded-lg p-4 flex flex-col items-center justify-center">
                    <span className="text-xs text-white/50 mb-1 uppercase tracking-wider">Daily Avg</span>
                    <span className="text-2xl font-bold text-white/90 font-mono">
                        {dailyAverage.toFixed(1)}<span className="text-sm text-white/40 ml-1">h</span>
                    </span>
                </div>
                
                <div className="bg-white/5 border border-white/5 rounded-lg p-4 flex flex-col items-center justify-center">
                    <span className="text-xs text-white/50 mb-1 uppercase tracking-wider">Best Day</span>
                    <span className="text-2xl font-bold text-green-400 font-mono flex items-baseline gap-2">
                        {bestDayDuration.toFixed(1)}<span className="text-sm text-green-400/60 font-sans">h</span>
                    </span>
                    {bestDayDate && (
                        <span className="text-[10px] text-white/40 mt-1">
                            on {format(bestDayDate, 'MMM d')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
