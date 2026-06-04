import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'terra-cotta' | 'white' | 'black';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
  xl: 'h-16 w-16 border-4',
};

const colorClasses = {
  'terra-cotta': 'border-terra-cotta-200 border-t-terra-cotta-500',
  white: 'border-white/20 border-t-white',
  black: 'border-brand-black-200 border-t-brand-black',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'terra-cotta',
  className = '',
  label = 'Loading...',
}) => (
  <div
    role="status"
    aria-label={label}
    className={`inline-flex items-center justify-center ${className}`}
  >
    <span
      className={[
        'rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
      ].join(' ')}
    />
    <span className="sr-only">{label}</span>
  </div>
);

export const FullPageLoader: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-warm-white z-50">
    <LoadingSpinner size="lg" />
    {message && (
      <p className="mt-4 font-josefin text-sm uppercase tracking-wider text-brand-black-400">
        {message}
      </p>
    )}
  </div>
);

export default LoadingSpinner;
