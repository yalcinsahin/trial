import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, required, className = '', id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="font-josefin text-xs uppercase tracking-wider text-brand-black"
          >
            {label}
            {required && (
              <span className="ml-1 text-terra-cotta-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={[
              'w-full appearance-none bg-warm-white border text-brand-black font-josefin text-sm',
              'px-4 py-3 pr-10 rounded-none',
              'transition-colors duration-150 cursor-pointer',
              'focus:outline-none focus:border-terra-cotta-500 focus:ring-1 focus:ring-terra-cotta-500',
              'disabled:bg-sea-salt-50 disabled:text-brand-black-300 disabled:cursor-not-allowed',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                : 'border-sea-salt-300 hover:border-sea-salt-400',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-black-400">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>

        {error && (
          <p className="font-josefin text-xs text-red-500">{error}</p>
        )}

        {hint && !error && (
          <p className="font-josefin text-xs text-brand-black-400">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
