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
  color: _color = 'cyan',
}) => {
  const getColorClasses = () => {
    if (!active) {
      return 'bg-zinc-900/80 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white';
    }
    return 'bg-white/15 text-white border-white/35 shadow-[0_0_12px_-2px_rgba(255,255,255,0.25)]';
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
