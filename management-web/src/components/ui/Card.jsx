import React from 'react';

export const Card = ({
  children,
  hover = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'card';
  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-5 border-b border-surface-200 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-5 border-t border-surface-200 bg-surface-50 ${className}`}>
    {children}
  </div>
);
