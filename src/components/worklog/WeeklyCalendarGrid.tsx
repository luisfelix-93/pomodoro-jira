import { useState, useRef, useCallback, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { CalendarWorklogBlock } from './CalendarWorklogBlock';
import { QuickWorklogModal } from './QuickWorklogModal';
import { useWorklogCalendarStore } from '@/store/useWorklogCalendarStore';
import { CalendarWorklogEntry, JiraIssue } from '@/types';

const START_HOUR = 0;
const END_HOUR = 24;
const FOCUS_START = 8;
const HOUR_HEIGHT = 48;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const HOURS = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

interface WeeklyCalendarGridProps {
  weekStart: Date;
}

export function WeeklyCalendarGrid({ weekStart }: WeeklyCalendarGridProps) {
  const entries = useWorklogCalendarStore((s) => s.entries);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | undefined>();
  const [modalHour, setModalHour] = useState<number | undefined>();
  const [modalIssue, setModalIssue] = useState<JiraIssue | null>(null);
  const [editingEntry, setEditingEntry] = useState<CalendarWorklogEntry | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  // Auto-scroll to 08:00 on mount
  useEffect(() => {
    if (gridRef.current) {
      const scrollTarget = FOCUS_START * HOUR_HEIGHT;
      gridRef.current.scrollTop = scrollTarget;
    }
  }, [weekStart]);

  const handleSlotClick = (dayIndex: number, hour: number) => {
    setEditingEntry(null);
    setModalDate(weekDays[dayIndex]);
    setModalHour(hour);
    setModalIssue(null);
    setModalOpen(true);
  };

  const handleDragOver = (e: React.DragEvent, dayIndex: number, hour: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverSlot(`${dayIndex}-${hour}`);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, dayIndex: number, hour: number) => {
    e.preventDefault();
    setDragOverSlot(null);

    try {
      const data = e.dataTransfer.getData('application/json');
      const issue: JiraIssue = JSON.parse(data);

      setEditingEntry(null);
      setModalDate(weekDays[dayIndex]);
      setModalHour(hour);
      setModalIssue(issue);
      setModalOpen(true);
    } catch {
      console.error('Invalid drop data');
    }
  };

  const handleBlockClick = (entry: CalendarWorklogEntry) => {
    setEditingEntry(entry);
    setModalDate(undefined);
    setModalHour(undefined);
    setModalIssue(null);
    setModalOpen(true);
  };

  const getEntriesForDay = useCallback(
    (dayDate: Date) => {
      const dayStr = format(dayDate, 'yyyy-MM-dd');
      return entries.filter((e) => {
        const entryDate = new Date(e.startTime);
        return format(entryDate, 'yyyy-MM-dd') === dayStr;
      });
    },
    [entries]
  );

  const isOffHours = (hour: number) => hour < 8 || hour >= 18;

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Day Headers */}
        <div className="grid shrink-0" style={{ gridTemplateColumns: '48px repeat(5, 1fr)' }}>
          <div /> {/* empty corner */}
          {weekDays.map((day, i) => {
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            return (
              <div
                key={i}
                className={`text-center py-2 border-b border-white/[0.06] ${isToday ? 'text-orbit-orange' : 'text-white/50'}`}
              >
                <div className="text-[10px] font-medium uppercase tracking-widest">
                  {WEEKDAY_LABELS[i]}
                </div>
                <div className={`text-lg font-bold mt-0.5 ${isToday ? 'text-orbit-orange' : 'text-white/80'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scrollable Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar" ref={gridRef}>
          <div className="grid relative" style={{ gridTemplateColumns: '48px repeat(5, 1fr)' }}>
            {HOURS.map((hour) => (
              <div key={`label-${hour}`} className="contents">
                {/* Hour Label */}
                <div className={`h-[48px] flex items-start justify-end pr-2 pt-0 text-[10px] font-mono -translate-y-2 ${isOffHours(hour) ? 'text-white/15' : 'text-white/30'}`}>
                  {String(hour).padStart(2, '0')}:00
                </div>

                {/* Day Columns */}
                {weekDays.map((_day, dayIndex) => {
                  const slotKey = `${dayIndex}-${hour}`;
                  const isDropTarget = dragOverSlot === slotKey;
                  const dimmed = isOffHours(hour);

                  return (
                    <div
                      key={slotKey}
                      className={`h-[48px] border-b border-r border-white/[0.04] relative transition-colors duration-100 ${
                        isDropTarget
                          ? 'bg-orbit-orange/10'
                          : dimmed
                            ? 'bg-white/[0.01] hover:bg-white/[0.02]'
                            : 'hover:bg-white/[0.03]'
                      }`}
                      onClick={() => handleSlotClick(dayIndex, hour)}
                      onDragOver={(e) => handleDragOver(e, dayIndex, hour)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, dayIndex, hour)}
                    />
                  );
                })}
              </div>
            ))}

            {/* Rendered Worklog Blocks (overlaid) */}
            {weekDays.map((day, dayIndex) => {
              const dayEntries = getEntriesForDay(day);
              if (dayEntries.length === 0) return null;

              return dayEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="absolute"
                  style={{
                    left: `calc(48px + ${dayIndex} * ((100% - 48px) / 5))`,
                    width: `calc((100% - 48px) / 5)`,
                    top: 0,
                    height: `${TOTAL_HOURS * HOUR_HEIGHT}px`,
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ pointerEvents: 'auto' }}>
                    <CalendarWorklogBlock
                      entry={entry}
                      hourHeight={HOUR_HEIGHT}
                      startHour={START_HOUR}
                      onClick={handleBlockClick}
                    />
                  </div>
                </div>
              ));
            })}

            {/* Current time indicator */}
            <CurrentTimeIndicator weekDays={weekDays} />
          </div>
        </div>
      </div>

      <QuickWorklogModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEntry(null); }}
        prefilledDate={modalDate}
        prefilledHour={modalHour}
        prefilledIssue={modalIssue}
        editingEntry={editingEntry}
      />
    </>
  );
}

function CurrentTimeIndicator({ weekDays }: { weekDays: Date[] }) {
  const now = new Date();
  const todayStr = format(now, 'yyyy-MM-dd');
  const todayIndex = weekDays.findIndex((d) => format(d, 'yyyy-MM-dd') === todayStr);

  if (todayIndex === -1) return null;

  const currentHour = now.getHours() + now.getMinutes() / 60;
  const top = (currentHour - START_HOUR) * HOUR_HEIGHT;

  return (
    <div
      className="absolute h-[2px] bg-orbit-orange z-20 pointer-events-none"
      style={{
        left: `calc(48px + ${todayIndex} * ((100% - 48px) / 5))`,
        width: `calc((100% - 48px) / 5)`,
        top: `${top}px`,
      }}
    >
      <div className="w-2 h-2 rounded-full bg-orbit-orange absolute -left-1 -top-[3px]" />
    </div>
  );
}
