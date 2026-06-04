import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, required, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
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

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 flex items-center justify-center text-brand-black-400 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full bg-warm-white border text-brand-black font-josefin text-sm',
              'px-4 py-3 rounded-none',
              'placeholder:text-brand-black-300 placeholder:font-josefin',
              'transition-colors duration-150',
              'focus:outline-none focus:border-terra-cotta-500 focus:ring-1 focus:ring-terra-cotta-500',
              'disabled:bg-sea-salt-50 disabled:text-brand-black-300 disabled:cursor-not-allowed',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                : 'border-sea-salt-300 hover:border-sea-salt-400',
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 flex items-center justify-center text-brand-black-400">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className="font-josefin text-xs text-red-500 flex items-center gap-1">
            <span>{error}</span>
          </p>
        )}

        {hint && !error && (
          <p className="font-josefin text-xs text-brand-black-400">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
