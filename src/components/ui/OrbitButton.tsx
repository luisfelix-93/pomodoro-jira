import { cn } from '@/lib/utils';
import React from 'react';

interface OrbitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function OrbitButton({ 
  className, 
  variant = 'primary', 
  size = 'md',
  children,
  ...props 
}: OrbitButtonProps) {
  const variants = {
    primary: 'bg-orbit-orange hover:bg-orbit-orange-hover text-white shadow-lg shadow-orbit-orange/20 border-none',
    secondary: 'bg-cyan-break/20 hover:bg-cyan-break/30 text-cyan-break border border-cyan-break/50',
    ghost: 'bg-transparent hover:bg-white/5 text-white/80 hover:text-white',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-bold',
  };

  return (
    <button 
      className={cn(
        'rounded-full font-display transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
}
