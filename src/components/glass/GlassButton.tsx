import React from 'react';
import type { StateColor } from '../../styles/motionSystem';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  state?: StateColor;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  state,
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs rounded-lg gap-1.5';
      case 'lg':
        return 'px-6 py-3 text-base font-medium rounded-xl gap-2.5';
      case 'md':
      default:
        return 'px-4 py-2 text-sm font-medium rounded-xl gap-2';
    }
  };

  const getVariantClasses = () => {
    if (disabled) {
      return 'bg-slate-800/40 text-slate-500 border border-white/5 cursor-not-allowed opacity-60';
    }
    switch (variant) {
      case 'danger':
        return 'bg-gradient-to-r from-red-600/80 to-rose-700/80 text-white border-top border-white/20 shadow-lg hover:shadow-red-500/20 active:scale-95 transition-all';
      case 'secondary':
        return 'glass-button-secondary text-slate-200 hover:text-white';
      case 'ghost':
        return 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-transparent hover:border-white/10 active:scale-95 transition-all';
      case 'primary':
      default:
        return 'glass-button-primary text-white';
    }
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium tracking-wide transition-all active:scale-[0.97] duration-150 select-none ${getSizeClasses()} ${getVariantClasses()} ${className}`}
      {...props}
    >
      {icon && <span className="transition-transform duration-150 group-hover:scale-110">{icon}</span>}
      {children}
    </button>
  );
};
