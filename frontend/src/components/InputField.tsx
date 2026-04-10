import React from 'react';

type InputFieldProps = {
  label: string;
  type?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type = 'text', error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full rounded-lg border px-3 py-2.5 outline-none transition-all focus:ring-2 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
          } ${className}`}
          {...props}
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    );
  }
);

InputField.displayName = 'InputField';