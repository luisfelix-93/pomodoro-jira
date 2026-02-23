import { useEffect, useMemo } from 'react';
import { StarField } from '@/components/layout/StarField';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { OrbitButton } from '@/components/ui/OrbitButton';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, RefreshCw } from 'lucide-react';
import { useHistoryStore } from '@/store/useHistoryStore';
import { HistoryMonthHeader } from '@/components/history/HistoryMonthHeader';
import { CalendarGrid } from '@/components/history/CalendarGrid';
import { DailyLogsDrawer } from '@/components/history/DailyLogsDrawer';

export function LogLedger() {
  const navigate = useNavigate();
  const { 
    currentDate, 
    selectedDate, 
    setCurrentDate, 
    setSelectedDate, 
    fetchMonth, 
    syncWorklogs, 
    isLoading,
    worklogsByMonth
  } = useHistoryStore();

  useEffect(() => {
    fetchMonth(currentDate.getMonth(), currentDate.getFullYear());
  }, [currentDate.getMonth(), currentDate.getFullYear(), fetchMonth]);

  const cacheKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, '0')}`;
  const monthlyLogs = worklogsByMonth[cacheKey] || [];

  const metrics = useMemo(() => {
     let maxSeconds = 0;
     let bestDay: string | null = null;
     const dailySums: Record<string, number> = {};

     monthlyLogs.forEach(log => {
        const dateStr = new Date(log.startTime).toISOString().split('T')[0];
        dailySums[dateStr] = (dailySums[dateStr] || 0) + log.durationSeconds;
        
        if (dailySums[dateStr] > maxSeconds) {
            maxSeconds = dailySums[dateStr];
            bestDay = dateStr;
        }
     });

     const totalSeconds = Object.values(dailySums).reduce((a, b) => a + b, 0);
     const totalHours = totalSeconds / 3600;
     const activeDays = Object.keys(dailySums).length;
     const dailyAverage = activeDays > 0 ? (totalSeconds / activeDays) / 3600 : 0;
     
     // Need a proper date object avoiding timezone shift for best day
     // appending T12:00:00 ensures it falls on the same correct day locally
     const bestDayDate = bestDay ? new Date(`${bestDay}T12:00:00`) : null;

     return {
         totalHours,
         dailyAverage,
         bestDayDuration: maxSeconds / 3600,
         bestDayDate
     };
  }, [monthlyLogs]);

  return (
    <div className="relative min-h-[100vh-2rem] w-[100vw] h-[100vh] overflow-hidden bg-black text-white flex flex-col pt-8 px-8 pb-4">
      <StarField />
      
      {/* Header Area */}
      <div className="flex justify-between items-center mb-8 z-10 shrink-0">
        <div className="flex items-center gap-4">
             <OrbitButton size="sm" variant="ghost" onClick={() => navigate('/orbit')}>
                <ArrowLeft className="w-5 h-5" />
             </OrbitButton>
             <h1 className="text-2xl font-bold tracking-wider">Log Ledger</h1>
        </div>
        <OrbitButton size="sm" className="gap-2" onClick={syncWorklogs} disabled={isLoading}>
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Sync to Jira
        </OrbitButton>
      </div>
      
      {/* Main Content Area */}
      <GlassPanel className="flex-1 p-8 relative overflow-hidden z-10 flex flex-col">
          <HistoryMonthHeader 
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              totalHours={metrics.totalHours}
              dailyAverage={metrics.dailyAverage}
              bestDayDuration={metrics.bestDayDuration}
              bestDayDate={metrics.bestDayDate}
          />
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
             <CalendarGrid 
                 currentDate={currentDate}
                 selectedDate={selectedDate}
                 onSelectDate={setSelectedDate}
             />
          </div>
      </GlassPanel>

      {/* Slide-out Drawer for Daily Details */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${selectedDate ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Backdrop */}
          <div 
             className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
             onClick={() => setSelectedDate(null)}
          />
          {/* Drawer Content */}
          <div className={`absolute top-0 right-0 h-full w-[400px] max-w-full bg-[#0a0a0a] shadow-[0_0_50px_rgba(0,0,0,0.8)] border-l border-white/10 flex flex-col transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${selectedDate ? 'translate-x-0' : 'translate-x-full'}`}>
              <DailyLogsDrawer 
                  date={selectedDate} 
                  onClose={() => setSelectedDate(null)} 
              />
          </div>
      </div>
    </div>
  );
}
