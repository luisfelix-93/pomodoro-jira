import { format, isSameDay } from 'date-fns';
import { X, Trash2 } from 'lucide-react';
import { useHistoryStore } from '@/store/useHistoryStore';

function getStatusBadge(log: { verificationStatus?: string; jiraWorklogId?: string }) {
    if (log.verificationStatus === 'FAILED') {
        return (
            <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/30">
                Failed
            </span>
        );
    }
    if (log.verificationStatus === 'SYNCED' || log.jiraWorklogId) {
        return (
            <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">
                Synced
            </span>
        );
    }
    if (log.verificationStatus === 'PENDING') {
        return (
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                Pending
            </span>
        );
    }
    return null;
}

interface DailyLogsDrawerProps {
    date: Date | null;
    onClose: () => void;
}

export function DailyLogsDrawer({ date, onClose }: DailyLogsDrawerProps) {
    const { currentDate, worklogsByMonth, deleteWorklog } = useHistoryStore();

    if (!date) return null;

    const cacheKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, '0')}`;
    const monthlyLogs = worklogsByMonth[cacheKey] || [];
    
    // Filter logs precisely for the selected day
    const dayLogs = monthlyLogs.filter(log => isSameDay(new Date(log.startTime), date));
    
    // Calculate total
    const totalSeconds = dayLogs.reduce((acc, log) => acc + log.durationSeconds, 0);

    const handleDelete = async (id: string | number) => {
        if (!confirm('Are you sure you want to delete this worklog?')) return;
        try {
            await deleteWorklog(id, cacheKey);
        } catch (error) {
            alert('Failed to delete worklog');
        }
    };

    return (
        <div className="absolute inset-y-0 right-0 w-[400px] max-w-full bg-black/80 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
                <div>
                    <h3 className="text-xl font-bold text-white/90">
                        {format(date, 'EEEE')}
                    </h3>
                    <p className="text-sm text-white/50">
                        {format(date, 'MMMM d, yyyy')}
                    </p>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Total Highlight */}
            <div className="bg-orbit-orange/10 border-b border-orange-500/20 p-6 shrink-0 flex items-center justify-between">
                <span className="text-orbit-orange/80 font-semibold">Total Focused</span>
                <span className="text-2xl font-mono font-bold text-orbit-orange">
                    {Math.floor(totalSeconds / 3600)}<span className="text-sm opacity-60">h</span>{' '}
                    {Math.floor((totalSeconds % 3600) / 60)}<span className="text-sm opacity-60">m</span>
                </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {dayLogs.length === 0 ? (
                    <div className="text-center text-white/40 italic py-10">
                        No worklogs recorded on this day.
                    </div>
                ) : (
                    dayLogs.map(log => (
                        <div key={log.id} className="bg-white/5 border border-white/5 rounded-lg p-4 group relative hover:border-white/20 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-orbit-orange text-sm font-bold">
                                        {log.issueKey}
                                    </span>
                                    {getStatusBadge(log)}
                                </div>
                                <span className="text-xs text-white/40 font-mono">
                                    {format(new Date(log.startTime), 'HH:mm')}
                                </span>
                            </div>
                            
                            <p className="text-sm text-white/80 mb-3 leading-relaxed">
                                {log.comment || <span className="text-white/30 italic">No description</span>}
                            </p>
                            
                            <div className="flex items-center justify-between mt-auto">
                                <span className="font-mono text-white/60 text-sm">
                                    {(log.durationSeconds / 60).toFixed(0)}m
                                </span>
                                
                                <button 
                                    onClick={() => handleDelete(log.id)}
                                    className="text-white/20 hover:text-red-400 transition-colors p-1.5 opacity-0 group-hover:opacity-100"
                                    title="Delete Worklog"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
