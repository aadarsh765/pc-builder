import React from 'react';

interface GlassChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  color?: 'cyan' | 'green' | 'amber' | 'purple' | 'slate';
}

export const GlassChip: React.FC<GlassChipProps> = ({
  children,
  active = false,
  onClick,
  icon,
  className = '',
  color = 'cyan',
}) => {
  const getColorClasses = () => {
    if (!active) {
      return 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white';
    }
    switch (color) {
      case 'green':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)]';
      case 'amber':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-[0_0_12px_-2px_rgba(245,158,11,0.3)]';
      case 'purple':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/40 shadow-[0_0_12px_-2px_rgba(168,85,247,0.3)]';
      case 'cyan':
      default:
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_-2px_rgba(6,182,212,0.3)]';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-lg border backdrop-blur-md transition-all duration-150 active:scale-95 ${getColorClasses()} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
