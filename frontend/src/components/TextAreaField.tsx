import { TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextAreaField = ({ label, error, ...props }: Props) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <textarea
        {...props}
        className={`min-h-24 w-full rounded-lg border px-3 py-2.5 outline-none transition-all resize-none ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
        }`}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
};
