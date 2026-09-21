import React from 'react';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className = '' }) => {
  return (
    <main className={`animate-page-enter ${className}`}>
      {children}
    </main>
  );
};
