import { 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    eachDayOfInterval,
    isSameDay
} from 'date-fns';
import { DayCell } from './DayCell';
import { useHistoryStore } from '@/store/useHistoryStore';

interface CalendarGridProps {
    currentDate: Date;
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
}

export function CalendarGrid({ currentDate, selectedDate, onSelectDate }: CalendarGridProps) {
    const worklogsByMonth = useHistoryStore(state => state.worklogsByMonth);
    
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart); // defaults to Sunday
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Current month cache key
    const cacheKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, '0')}`;
    const monthlyLogs = worklogsByMonth[cacheKey] || [];

    // Pre-calculate durations per day to avoid O(N^2) in render
    const durationByDay = new Map<string, number>();
    monthlyLogs.forEach(log => {
        // use YYYY-MM-DD as key
        const dateStr = new Date(log.startTime).toISOString().split('T')[0];
        const currentMs = durationByDay.get(dateStr) || 0;
        durationByDay.set(dateStr, currentMs + log.durationSeconds);
    });

    return (
        <div className="w-full">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-xs text-white/40 uppercase tracking-wider font-semibold py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const durationSeconds = durationByDay.get(dateStr) || 0;
                    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

                    return (
                        <DayCell 
                            key={day.toISOString() + idx}
                            date={day}
                            currentMonth={currentDate}
                            durationSeconds={durationSeconds}
                            isSelected={isSelected}
                            onClick={() => onSelectDate(day)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
