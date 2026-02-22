import { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { OrbitButton } from '@/components/ui/OrbitButton';
import { X } from 'lucide-react';

export interface NotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  type?: 'session_end' | 'idle_return';
}

export function NotationModal({ isOpen, onClose, onSave, type = 'session_end' }: NotationModalProps) {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(note);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
       <GlassPanel intensity="high" className="w-full max-w-lg p-6 animate-float" style={{ animationDuration: '0s' }}>
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold">
                {type === 'session_end' ? 'Session Complete' : 'Welcome Back'}
             </h2>
             <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
             </button>
          </div>

          <div className="mb-6">
             <label className="block text-sm font-medium text-white/60 mb-2">
                What did you work on?
             </label>
             <textarea 
                className="w-full bg-space-black/50 border border-white/10 rounded-lg p-3 h-24 focus:outline-none focus:border-orbit-orange resize-none"
                placeholder="Added login validation..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
             />
          </div>

          <div className="flex gap-4 justify-end">
             <OrbitButton variant="secondary" size="md" onClick={onClose}>Discard</OrbitButton>
             <OrbitButton size="md" onClick={handleSave}>Save Draft</OrbitButton>
          </div>
       </GlassPanel>
    </div>
  );
}
