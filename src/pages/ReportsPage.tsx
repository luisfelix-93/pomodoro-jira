import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/layout/StarField';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { OrbitButton } from '@/components/ui/OrbitButton';
import { DateSelector } from '@/components/reports/DateSelector';
import { DailyReport } from '@/components/reports/DailyReport';
import { WeeklyReport } from '@/components/reports/WeeklyReport';
import { useReportsStore } from '@/store/useReportsStore';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ReportsPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const {
    viewMode,
    selectedDate,
    setViewMode,
    navigateDay,
    navigateWeek,
    goToToday,
    fetchReportData,
    getClipboardText,
    isLoading
  } = useReportsStore();

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleCopy = async () => {
    const text = getClipboardText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePrevious = () => {
    if (viewMode === 'daily') navigateDay(-1);
    else navigateWeek(-1);
  };

  const handleNext = () => {
    if (viewMode === 'daily') navigateDay(1);
    else navigateWeek(1);
  };

  return (
    <div className="relative w-[100vw] h-[100vh] overflow-hidden bg-black text-white flex flex-col pt-6 px-6 pb-4">
      <StarField />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <OrbitButton size="sm" variant="ghost" onClick={() => navigate('/orbit')}>
            <ArrowLeft className="w-5 h-5" />
          </OrbitButton>
          <h1 className="text-xl font-bold tracking-wider">Reports Dashboard</h1>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
          <button
            onClick={() => setViewMode('daily')}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
              viewMode === 'daily' 
                ? "bg-orbit-orange text-white shadow-md shadow-orbit-orange/20" 
                : "text-white/50 hover:text-white/80"
            )}
          >
            Diário
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
              viewMode === 'weekly' 
                ? "bg-orbit-orange text-white shadow-md shadow-orbit-orange/20" 
                : "text-white/50 hover:text-white/80"
            )}
          >
            Semanal
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center z-10 overflow-hidden px-4 md:px-0">
        <GlassPanel className="w-full max-w-4xl h-full flex flex-col p-6 overflow-hidden">
          
          {/* Controls Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 shrink-0">
            <DateSelector 
              selectedDate={selectedDate}
              viewMode={viewMode}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onToday={goToToday}
            />

            <OrbitButton 
              size="sm" 
              variant="secondary" 
              onClick={handleCopy}
              className="gap-2 min-w-[140px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Exportar
                </>
              )}
            </OrbitButton>
          </div>

          {/* Report View */}
          <div className="flex-1 overflow-hidden relative">
             {isLoading ? (
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 rounded-full border-2 border-orbit-orange border-t-transparent animate-spin" />
               </div>
             ) : (
                viewMode === 'daily' ? <DailyReport /> : <WeeklyReport />
             )}
          </div>

        </GlassPanel>
      </div>
    </div>
  );
}
