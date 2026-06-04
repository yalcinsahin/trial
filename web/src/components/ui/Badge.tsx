import React from 'react';
import type { BookingStatus, DriverStatus, PayoutStatus } from '@/types';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-sea-salt-100 text-sea-salt-800 border-sea-salt-300',
  success: 'bg-green-50 text-green-800 border-green-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  neutral: 'bg-warm-white-200 text-brand-black-500 border-sea-salt-200',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => (
  <span
    className={[
      'inline-flex items-center font-josefin uppercase tracking-wider border rounded-sm',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

// ─── Status Badge Helpers ─────────────────────────────────────────────────────

export const BookingStatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const variantMap: Record<BookingStatus, BadgeVariant> = {
    pending: 'neutral',
    confirmed: 'info',
    assigned: 'info',
    en_route: 'warning',
    arrived: 'warning',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'error',
    no_show: 'error',
  };

  const labels: Record<BookingStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    assigned: 'Driver Assigned',
    en_route: 'En Route',
    arrived: 'Driver Arrived',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  };

  return <Badge variant={variantMap[status]}>{labels[status]}</Badge>;
};

export const DriverStatusBadge: React.FC<{ status: DriverStatus }> = ({ status }) => {
  const variantMap: Record<DriverStatus, BadgeVariant> = {
    pending_review: 'warning',
    approved: 'info',
    active: 'success',
    inactive: 'neutral',
    suspended: 'error',
    rejected: 'error',
  };

  const labels: Record<DriverStatus, string> = {
    pending_review: 'Pending Review',
    approved: 'Approved',
    active: 'Active',
    inactive: 'Inactive',
    suspended: 'Suspended',
    rejected: 'Rejected',
  };

  return <Badge variant={variantMap[status]}>{labels[status]}</Badge>;
};

export const PayoutStatusBadge: React.FC<{ status: PayoutStatus }> = ({ status }) => {
  const variantMap: Record<PayoutStatus, BadgeVariant> = {
    pending: 'neutral',
    processing: 'warning',
    paid: 'success',
    failed: 'error',
  };

  return <Badge variant={variantMap[status]}>{status}</Badge>;
};

export default Badge;
