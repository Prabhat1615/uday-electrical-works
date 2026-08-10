import React from 'react';

export const Select = ({
  label,
  error,
  helperText,
  options = [],
  className = '',
  ...props
}) => {
  const selectClasses = error ? 'input-error' : 'input';
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <select className={`${selectClasses} ${className}`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-danger-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-text-muted">{helperText}</p>
      )}
    </div>
  );
};
