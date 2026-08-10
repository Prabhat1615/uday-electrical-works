import React from 'react';

export const PageTransition = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const FadeIn = ({ children, delay = 0, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const SlideIn = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  className = '' 
}) => (
  <div className={className}>
    {children}
  </div>
);

export const ScaleIn = ({ children, delay = 0, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const StaggerContainer = ({ children, className = '', staggerDelay = 0.05 }) => (
  <div className={className}>
    {children}
  </div>
);

export const StaggerItem = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);
