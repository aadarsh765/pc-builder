import React from 'react';

interface GlassSurfaceProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  className = '',
  intensity = 'medium',
}) => {
  const getBlurClass = () => {
    switch (intensity) {
      case 'low':
        return 'backdrop-blur-sm bg-slate-950/40 border-white/5';
      case 'high':
        return 'backdrop-blur-2xl bg-slate-950/80 border-white/15';
      case 'medium':
      default:
        return 'backdrop-blur-md bg-slate-900/60 border-white/10';
    }
  };

  return (
    <div className={`rounded-2xl border shadow-xl ${getBlurClass()} ${className}`}>
      {children}
    </div>
  );
};
