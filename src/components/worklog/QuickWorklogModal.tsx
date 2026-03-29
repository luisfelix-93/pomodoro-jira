import { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { OrbitButton } from '@/components/ui/OrbitButton';
import { X, Clock, MessageSquare, Trash2 } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { useWorklogCalendarStore } from '@/store/useWorklogCalendarStore';
import { JiraIssue, CalendarWorklogEntry } from '@/types';
import { format } from 'date-fns';

interface QuickWorklogModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledDate?: Date;
  prefilledHour?: number;
  prefilledIssue?: JiraIssue | null;
  editingEntry?: CalendarWorklogEntry | null;
}

export function QuickWorklogModal({
  isOpen,
  onClose,
  prefilledDate,
  prefilledHour,
  prefilledIssue,
  editingEntry,
}: QuickWorklogModalProps) {
  const issues = useTaskStore((s) => s.issues);
  const { createWorklog, editWorklog, deleteWorklog } = useWorklogCalendarStore();

  const isEditing = !!editingEntry;

  const [selectedIssueKey, setSelectedIssueKey] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState('1');
  const [comment, setComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (editingEntry) {
      const entryDate = new Date(editingEntry.startTime);
      setSelectedIssueKey(editingEntry.issueKey);
      setStartTime(
        `${String(entryDate.getHours()).padStart(2, '0')}:${String(entryDate.getMinutes()).padStart(2, '0')}`
      );
      setDuration(String(editingEntry.durationSeconds / 3600));
      setComment(editingEntry.comment || '');
    } else {
      setSelectedIssueKey(prefilledIssue?.key || '');
      setStartTime(
        prefilledHour !== undefined
          ? `${String(Math.floor(prefilledHour)).padStart(2, '0')}:${String(Math.round((prefilledHour % 1) * 60)).padStart(2, '0')}`
          : '09:00'
      );
      setDuration('1');
      setComment('');
    }
    setError(null);
  }, [isOpen, prefilledHour, prefilledIssue, editingEntry]);

  if (!isOpen) return null;

  const selectedIssue = issues.find((i) => i.key === selectedIssueKey);

  const dateLabel = editingEntry
    ? format(new Date(editingEntry.startTime), 'EEE, dd MMM')
    : prefilledDate
      ? format(prefilledDate, 'EEE, dd MMM')
      : 'Today';

  const handleSave = async () => {
    if (!isEditing && !selectedIssueKey) {
      setError('Please select a ticket');
      return;
    }

    const durationHours = parseFloat(duration);
    if (isNaN(durationHours) || durationHours <= 0) {
      setError('Duration must be greater than 0');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const [h, m] = startTime.split(':').map(Number);
      const durationSeconds = Math.round(durationHours * 3600);

      if (isEditing) {
        const startDate = new Date(editingEntry!.startTime);
        startDate.setHours(h, m, 0, 0);

        await editWorklog(
          editingEntry!.id,
          startDate.toISOString(),
          durationSeconds,
          comment
        );
      } else {
        const startDate = prefilledDate ? new Date(prefilledDate) : new Date();
        startDate.setHours(h, m, 0, 0);

        const summary = selectedIssue?.fields.summary || selectedIssueKey;

        await createWorklog(
          selectedIssueKey,
          summary,
          startDate.toISOString(),
          durationSeconds,
          comment
        );
      }

      onClose();
    } catch {
      setError(isEditing ? 'Failed to update worklog.' : 'Failed to save worklog.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingEntry) return;
    if (!confirm(`Delete worklog "${editingEntry.issueKey}" (${Math.round(editingEntry.durationSeconds / 60)}min)?`)) return;

    setIsSaving(true);
    try {
      await deleteWorklog(editingEntry.id);
      onClose();
    } catch {
      setError('Failed to delete worklog.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[3px]">
      <GlassPanel intensity="high" className="w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-lg font-bold">{isEditing ? 'Edit Worklog' : 'Log Work'}</h2>
            <p className="text-xs text-white/40 mt-0.5">
              {dateLabel}
              {isEditing && (
                <span className="ml-2 text-orbit-orange font-mono">{editingEntry!.issueKey}</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {isEditing && editingEntry?.verificationStatus === 'FAILED' && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="text-rose-400 text-xs">⚠ Sync failed — this worklog was not sent to Jira. It will be retried on next sync.</span>
            </div>
          )}
          {/* Ticket Selector — disabled in edit mode */}
          {!isEditing && (
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Ticket</label>
              <select
                value={selectedIssueKey}
                onChange={(e) => setSelectedIssueKey(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orbit-orange/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="bg-space-gray">Select a ticket...</option>
                {issues.map((issue) => (
                  <option key={issue.key} value={issue.key} className="bg-space-gray">
                    {issue.key} — {issue.fields.summary}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isEditing && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5">
              <p className="text-xs text-white/40">Ticket</p>
              <p className="text-sm text-white/80 mt-0.5">{editingEntry!.issueKey} — {editingEntry!.issueSummary}</p>
            </div>
          )}

          {/* Time & Duration row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">
                <Clock className="inline w-3 h-3 mr-1 -mt-0.5" />
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orbit-orange/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">
                Duration (hours)
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="12"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orbit-orange/50 transition-colors"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">
              <MessageSquare className="inline w-3 h-3 mr-1 -mt-0.5" />
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you work on?"
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orbit-orange/50 resize-none placeholder:text-white/20 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 px-1">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-between pt-1">
            <div>
              {isEditing && (
                <OrbitButton variant="danger" size="md" onClick={handleDelete} disabled={isSaving}>
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </OrbitButton>
              )}
            </div>
            <div className="flex gap-3">
              <OrbitButton variant="secondary" size="md" onClick={onClose}>
                Cancel
              </OrbitButton>
              <OrbitButton size="md" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Save Worklog'}
              </OrbitButton>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
