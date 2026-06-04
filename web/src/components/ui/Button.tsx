import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-terra-cotta-500 text-warm-white border border-terra-cotta-500 hover:bg-terra-cotta-600 hover:border-terra-cotta-600 active:bg-terra-cotta-700 disabled:bg-terra-cotta-200 disabled:border-terra-cotta-200 disabled:text-warm-white/60',
  secondary:
    'bg-transparent text-brand-black border border-brand-black hover:bg-brand-black hover:text-warm-white active:bg-brand-black-light disabled:border-sea-salt-300 disabled:text-sea-salt-400',
  ghost:
    'bg-transparent text-terra-cotta-500 border border-transparent hover:border-terra-cotta-200 hover:bg-terra-cotta-50 active:bg-terra-cotta-100 disabled:text-sea-salt-400',
  danger:
    'bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 active:bg-red-800 disabled:bg-red-200 disabled:border-red-200',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs tracking-wider',
  md: 'px-6 py-3 text-sm tracking-wider',
  lg: 'px-8 py-4 text-sm tracking-widest',
  xl: 'px-10 py-5 text-base tracking-widest',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-josefin uppercase transition-all duration-200 ease-luxury rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-terra-cotta-500 focus-visible:ring-offset-2 select-none';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    isLoading || disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
