import React from 'react';

export interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'active' | 'subtle';
  draggable?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  draggable = false,
  onClick,
  style,
}) => {
  const isInteractive = variant === 'interactive' || !!onClick;

  const getVariantClasses = () => {
    switch (variant) {
      case 'active':
        return 'bg-slate-900/80 border-cyan-500/40 shadow-[0_0_24px_-4px_rgba(6,182,212,0.25)]';
      case 'subtle':
        return 'bg-slate-950/40 backdrop-blur-md border border-white/5 shadow-md';
      case 'interactive':
        return 'glass-card glass-card-interactive';
      case 'default':
      default:
        return 'glass-card';
    }
  };

  return (
    <>
      {/* Shared Hidden SVG Refraction & Displacement Filter */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="glass-displacement">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div
        draggable={draggable}
        onClick={onClick}
        style={style}
        className={`rounded-2xl relative transition-all duration-220 ${getVariantClasses()} ${
          isInteractive ? 'cursor-pointer select-none' : ''
        } ${className}`}
      >
        {/* Specular Top Edge Highlight */}
        <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
        {children}
      </div>
    </>
  );
};

export default LiquidGlassCard;
