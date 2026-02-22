import { cn } from '@/lib/utils';
import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
}

export function GlassPanel({ 
  children, 
  className, 
  intensity = 'medium',
  ...props 
}: GlassPanelProps) {
  const intensityMap = {
    low: 'bg-space-gray/30 backdrop-blur-sm border-white/5',
    medium: 'bg-space-gray/50 backdrop-blur-md border-white/10',
    high: 'bg-space-gray/80 backdrop-blur-lg border-white/20',
  };

  return (
    <div 
      className={cn(
        'rounded-2xl border shadow-xl transition-all duration-300',
        intensityMap[intensity],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
