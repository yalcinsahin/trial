import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined' | 'dark';
  onClick?: () => void;
  as?: keyof React.JSX.IntrinsicElements;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8 lg:p-10',
};

const variantClasses = {
  default: 'bg-warm-white border border-sea-salt-200 shadow-card',
  elevated: 'bg-warm-white border border-sea-salt-200 shadow-luxury',
  outlined: 'bg-transparent border border-sea-salt-300',
  dark: 'bg-brand-black-light border border-brand-black-700 text-warm-white',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  variant = 'default',
  onClick,
  as: Tag = 'div',
}) => {
  const classes = [
    'rounded-none',
    variantClasses[variant],
    paddingClasses[padding],
    onClick ? 'cursor-pointer hover:shadow-card-hover transition-shadow duration-300' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} onClick={onClick}>
      {children}
    </Tag>
  );
};

// ─── Card Sub-components ──────────────────────────────────────────────────────

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <h3 className={`font-cinzel text-xl font-medium text-brand-black ${className}`}>{children}</h3>
);

export const CardBody: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`font-cormorant text-lg text-brand-black-500 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-sea-salt-200 ${className}`}>{children}</div>
);

export default Card;
