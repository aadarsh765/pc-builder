/**
 * Centralized Hardware Motion & Material Tokens
 */

export const MOTION_TOKENS = {
  duration: {
    FAST: 150,     // Micro-interactions, press states, instant feedback
    NORMAL: 250,   // Standard transitions, dropdowns, card reveals
    EMPHASIS: 400, // Selection glows, drawer shifts, focus highlights
    DATA: 700,     // Count-up numbers, progress bar fills, bottleneck meters
  },
  easing: {
    FLUID_SPRING: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth engineering spring ease-out
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    LINEAR: 'linear',
  },
  glass: {
    borderRadius: {
      sm: '12px',
      md: '16px',
      lg: '24px',
    },
    backdropBlur: {
      sm: '8px',
      md: '12px',
      lg: '20px',
    }
  },
  colorStates: {
    primary: {
      accent: '#06b6d4', // Cyan 500
      glow: 'rgba(6, 182, 212, 0.35)',
      border: 'rgba(56, 189, 248, 0.3)',
    },
    healthy: {
      accent: '#10b981', // Emerald 500
      glow: 'rgba(16, 185, 129, 0.35)',
      border: 'rgba(52, 211, 153, 0.3)',
    },
    warning: {
      accent: '#f59e0b', // Amber 500
      glow: 'rgba(245, 158, 11, 0.35)',
      border: 'rgba(251, 191, 36, 0.3)',
    },
    critical: {
      accent: '#ef4444', // Red 500
      glow: 'rgba(239, 68, 68, 0.35)',
      border: 'rgba(248, 113, 113, 0.3)',
    },
    benchmark: {
      accent: '#a855f7', // Purple 500
      glow: 'rgba(168, 85, 247, 0.35)',
      border: 'rgba(192, 132, 252, 0.3)',
    }
  }
} as const;

export type StateColor = 'primary' | 'healthy' | 'warning' | 'critical' | 'benchmark';
