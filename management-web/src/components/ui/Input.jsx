import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const inputClasses = error ? 'input-error' : 'input';
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input className={`${inputClasses} ${className}`} {...props} />
      {error && (
        <p className="text-xs text-danger-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-text-muted">{helperText}</p>
      )}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  helperText,
  className = '',
  rows = 3,
  ...props
}) => {
  const textareaClasses = error ? 'input-error' : 'input';
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <textarea
        className={`${textareaClasses} ${className} resize-none`}
        rows={rows}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-text-muted">{helperText}</p>
      )}
    </div>
  );
};
