import { cn } from '@/lib/utils';
import React from 'react';

interface TimerRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 100
  color?: string; // Hex or tailwind class
  children?: React.ReactNode;
  className?: string;
  isPaused?: boolean;
}

export function TimerRing({
  size = 300,
  strokeWidth = 12,
  progress,
  color = '#FF4500', // Orbit Orange default
  children,
  className,
  isPaused = false,
}: TimerRingProps) {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Background Ring */}
      <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
         <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
         />
         {/* Progress Ring */}
         <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn("transition-all duration-1000 ease-linear", isPaused && "opacity-50")}
            style={{ filter: `drop-shadow(0 0 10px ${color})` }}
         />
      </svg>
      
      {/* Content */}
      <div className="z-10 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
