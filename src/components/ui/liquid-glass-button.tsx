import React from 'react';

export interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  children,
  variant = 'primary',
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
        return 'px-4.5 py-2 text-sm font-medium rounded-lg gap-2';
    }
  };

  const getVariantClasses = () => {
    if (disabled) {
      return 'bg-slate-900/40 text-slate-500 border border-white/5 cursor-not-allowed opacity-50 shadow-none';
    }
    switch (variant) {
      case 'danger':
        return 'bg-rose-950/80 hover:bg-rose-900 text-rose-100 border border-rose-500/40 shadow-[0_4px_14px_rgba(225,29,72,0.25)] active:scale-95 transition-all';
      case 'secondary':
        return 'glass-button-secondary text-slate-200 hover:text-white';
      case 'tertiary':
        return 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-transparent hover:border-white/10 active:scale-95 transition-all';
      case 'primary':
      default:
        return 'glass-button-primary text-white';
    }
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center font-sans tracking-wide transition-all duration-200 active:scale-[0.97] select-none ${getSizeClasses()} ${getVariantClasses()} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0 transition-transform duration-150 group-hover:scale-105">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default LiquidGlassButton;
