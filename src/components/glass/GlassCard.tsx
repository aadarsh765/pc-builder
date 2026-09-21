import React from 'react';
import type { StateColor } from '../../styles/motionSystem';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'active' | 'subtle';
  state?: StateColor;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  state,
  onClick,
  style,
}) => {
  const isInteractive = variant === 'interactive' || !!onClick;

  const getStateClasses = () => {
    if (!state) return '';
    switch (state) {
      case 'healthy':
        return 'border-emerald-500/30 glow-green';
      case 'warning':
        return 'border-amber-500/30 glow-amber';
      case 'critical':
        return 'border-red-500/30 glow-red';
      case 'benchmark':
        return 'border-purple-500/30 glow-purple';
      case 'primary':
      default:
        return 'border-cyan-500/30 glow-cyan';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'active':
        return 'bg-slate-800/80 border-cyan-500/50 shadow-[0_0_20px_-3px_rgba(6,182,212,0.25)]';
      case 'subtle':
        return 'bg-slate-900/40 backdrop-blur-md border border-white/5';
      case 'interactive':
        return 'glass-card glass-card-interactive';
      case 'default':
      default:
        return 'glass-card';
    }
  };

  return (
    <div
      onClick={onClick}
      style={style}
      className={`rounded-2xl relative transition-all duration-250 ${getVariantClasses()} ${getStateClasses()} ${
        isInteractive ? 'cursor-pointer select-none' : ''
      } ${className}`}
    >
      {/* Specular top highlight */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
