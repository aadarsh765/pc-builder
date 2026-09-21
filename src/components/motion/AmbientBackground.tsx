import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="tech-ambient-bg" aria-hidden="true">
      <div className="tech-ambient-orb-1" />
      <div className="tech-ambient-orb-2" />
      <div className="absolute inset-0 tech-grid-bg opacity-70" />
    </div>
  );
};
