import React from 'react';

interface StatusIndicatorProps {
  status: 'compatible' | 'warning' | 'incompatible';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'md',
  animate = true,
}) => {
  const getConfig = () => {
    switch (status) {
      case 'compatible':
        return {
          bg: 'bg-emerald-500/15',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          dotBg: 'bg-emerald-400',
          animation: animate ? 'animate-pulse-gentle' : '',
          defaultLabel: 'Compatible',
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/15',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          dotBg: 'bg-amber-400',
          animation: animate ? 'animate-pulse-warning' : '',
          defaultLabel: 'Warning',
        };
      case 'incompatible':
      default:
        return {
          bg: 'bg-red-500/15',
          border: 'border-red-500/40',
          text: 'text-red-400',
          dotBg: 'bg-red-500',
          animation: '',
          defaultLabel: 'Incompatible',
        };
    }
  };

  const config = getConfig();

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs gap-1.5';
      case 'lg':
        return 'px-4 py-1.5 text-sm gap-2.5 font-medium';
      case 'md':
      default:
        return 'px-3 py-1 text-xs gap-2 font-medium';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-md transition-all duration-200 ${getSizeClasses()} ${config.bg} ${config.border} ${config.text} ${config.animation}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotBg}`} />
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};
