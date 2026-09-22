import React from 'react';
import { LiquidGlassCard } from '../ui/liquid-glass-card';
import type { StateColor } from '../../styles/motionSystem';

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'active' | 'subtle';
  state?: StateColor;
  draggable?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  state,
  draggable = false,
  onClick,
  style,
}) => {
  const getStateClasses = () => {
    if (!state) return '';
    switch (state) {
      case 'healthy':
        return 'border-emerald-500/30';
      case 'warning':
        return 'border-amber-500/30';
      case 'critical':
        return 'border-rose-500/30';
      case 'benchmark':
        return 'border-purple-500/30';
      case 'primary':
      default:
        return 'border-cyan-500/30';
    }
  };

  return (
    <LiquidGlassCard
      variant={variant}
      draggable={draggable}
      onClick={onClick}
      style={style}
      className={`${getStateClasses()} ${className}`}
    >
      {children}
    </LiquidGlassCard>
  );
};

export default GlassCard;
