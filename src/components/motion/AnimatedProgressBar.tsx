import React from 'react';

interface AnimatedProgressBarProps {
  progress: number; // 0 to 100
  color?: 'cyan' | 'green' | 'amber' | 'red' | 'purple';
  height?: string;
  showShimmer?: boolean;
  className?: string;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  color = 'cyan',
  height = 'h-2.5',
  showShimmer = true,
  className = '',
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const getColorGradient = () => {
    switch (color) {
      case 'green':
        return 'from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]';
      case 'amber':
        return 'from-amber-500 to-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
      case 'red':
        return 'from-red-500 to-rose-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]';
      case 'purple':
        return 'from-purple-500 to-indigo-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]';
      case 'cyan':
      default:
        return 'from-cyan-500 to-blue-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]';
    }
  };

  return (
    <div className={`w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/5 ${height} ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r ${getColorGradient()} transition-all duration-700 ease-out ${
          showShimmer ? 'animate-shimmer' : ''
        }`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};
