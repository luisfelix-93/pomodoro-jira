import { format, isSameMonth, isToday } from 'date-fns';

interface DayCellProps {
    date: Date;
    currentMonth: Date;
    durationSeconds: number;
    isSelected: boolean;
    onClick: () => void;
}

export function DayCell({ date, currentMonth, durationSeconds, isSelected, onClick }: DayCellProps) {
    const isCurrentMonth = isSameMonth(date, currentMonth);
    const durationHours = durationSeconds / 3600;
    
    // Determine heatmap color based on hours logged
    let bgClass = "bg-white/5 hover:bg-white/10"; // default
    
    if (durationHours > 0) {
        if (durationHours < 2) bgClass = "bg-orbit-orange/20 hover:bg-orbit-orange/30";
        else if (durationHours < 4) bgClass = "bg-orbit-orange/40 hover:bg-orbit-orange/50";
        else if (durationHours < 6) bgClass = "bg-orbit-orange/60 hover:bg-orbit-orange/70";
        else bgClass = "bg-orbit-orange hover:bg-orbit-orange/90";
    }

    // Styles for selected and today
    const ringClass = isSelected 
        ? "ring-2 ring-white/80 ring-offset-2 ring-offset-black/50 z-10" 
        : "";
        
    const textBaseClass = isCurrentMonth ? "text-white/80" : "text-white/20";
    const todayClass = isToday(date) ? "text-orbit-orange font-bold text-lg" : "";
    const textColor = durationHours >= 6 && isCurrentMonth ? "text-black/80 font-bold" : textBaseClass;
    
    // Fallback if today and high duration (keep contrast)
    const finalTextColor = isToday(date) && durationHours < 6 ? "text-orbit-orange font-bold text-lg" : textColor;

    return (
        <button
            onClick={onClick}
            className={`
                relative flex flex-col items-center justify-center p-2 
                rounded-lg transition-all duration-200 aspect-square
                ${bgClass} ${ringClass}
                ${!isCurrentMonth ? 'opacity-40' : 'opacity-100'}
            `}
        >
            <span className={`text-sm ${finalTextColor} ${todayClass}`}>
                {format(date, 'd')}
            </span>
            
            {durationHours > 0 && (
                <span className={`text-[10px] sm:text-xs mt-1 font-mono font-medium ${durationHours >= 6 ? 'text-black/60' : 'text-white/60'}`}>
                    {Number.isInteger(durationHours) ? durationHours : durationHours.toFixed(1)}h
                </span>
            )}
        </button>
    );
}
