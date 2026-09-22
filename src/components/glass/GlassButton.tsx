import React from 'react';
import { LiquidGlassButton } from '../ui/liquid-glass-button';
import type { StateColor } from '../../styles/motionSystem';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  state?: StateColor;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const mappedVariant = variant === 'ghost' ? 'tertiary' : variant;

  return (
    <LiquidGlassButton
      variant={mappedVariant as any}
      size={size}
      icon={icon}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </LiquidGlassButton>
  );
};

export default GlassButton;
