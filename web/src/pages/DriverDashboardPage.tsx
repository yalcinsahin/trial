import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Car, DollarSign, Clock, Star, MapPin, ToggleLeft, ToggleRight, CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BookingStatusBadge, DriverStatusBadge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useDriver } from '@/hooks/useDriver';
import type { Booking, DriverEarnings } from '@/types';
import { format, startOfWeek } from 'date-fns';

const DriverDashboardPage: React.FC = () => {
  const { user, profile, isAuthenticated, isInitialized } = useAuth();
  const { driver, fetchDriver, updateOnlineStatus, fetchAssignedBookings, fetchCompletedBookings, fetchEarnings, updateRideStatus } =
    useDriver(user?.id);
  const [assignedBookings, setAssignedBookings] = useState<Booking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<DriverEarnings[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      initializeDashboard();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const initializeDashboard = async () => {
    setIsLoading(true);
    await fetchDriver();
    setIsLoading(false);
  };

  useEffect(() => {
    if (driver) {
      setIsOnline(driver.is_online ?? false);
      loadBookingsAndEarnings();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driver]);

  const loadBookingsAndEarnings = async () => {
    if (!driver) return;
    const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
    const [assigned, completed, earned] = await Promise.all([
      fetchAssignedBookings(driver.id),
      fetchCompletedBookings(driver.id),
      fetchEarnings(driver.id, weekStart),
    ]);
    setAssignedBookings(assigned.bookings);
    setCompletedBookings(completed.bookings);
    setEarnings(earned.earnings);
  };

  const handleToggleOnline = async () => {
    if (!driver) return;
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    await updateOnlineStatus(driver.id, newStatus);
  };

  const handleRideStatusUpdate = async (bookingId: string, status: 'en_route' | 'arrived' | 'in_progress' | 'completed') => {
    await updateRideStatus(bookingId, status);
    await loadBookingsAndEarnings();
  };

  if (!isInitialized || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || profile?.role !== 'driver') {
    return <Navigate to="/login?redirect=/driver-portal" replace />;
  }

  const weeklyEarnings = earnings.reduce((sum, e) => sum + e.net_amount, 0);

  return (
    <Layout>
      <Helmet>
        <title>Driver Portal — BookAirportRide</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-sea-salt-50 py-10">
        <div className="container-luxury">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-cinzel text-3xl font-semibold text-brand-black mb-1">
                Driver Portal
              </h1>
              {driver && (
                <div className="flex items-center gap-3">
                  <p className="font-cormorant text-xl text-brand-black-400">
                    {driver.first_name} {driver.last_name}
                  </p>
                  <DriverStatusBadge status={driver.status} />
                </div>
              )}
            </div>

            {/* Online Toggle */}
            {driver?.status === 'active' && (
              <button
                onClick={handleToggleOnline}
                className={[
                  'flex items-center gap-3 px-5 py-3 border-2 transition-all duration-200',
                  isOnline
                    ? 'bg-brand-black border-brand-black text-warm-white'
                    : 'bg-warm-white border-sea-salt-300 text-brand-black',
                ].join(' ')}
              >
                {isOnline ? (
                  <ToggleRight className="h-5 w-5 text-terra-cotta-400" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-brand-black-300" />
                )}
                <span className="font-josefin text-xs uppercase tracking-wider">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'This Week', value: `$${weeklyEarnings.toFixed(0)}`, icon: DollarSign },
              { label: 'Active Rides', value: assignedBookings.length, icon: Car },
              { label: 'Completed Today', value: completedBookings.filter((b) => b.dropoff_at && format(new Date(b.dropoff_at), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length, icon: CheckCircle },
              { label: 'Rating', value: driver?.rating ? driver.rating.toFixed(1) : '—', icon: Star },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} padding="md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sea-salt-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-terra-cotta-500" />
                  </div>
                  <div>
                    <p className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">
                      {label}
                    </p>
                    <p className="font-cinzel text-2xl font-semibold text-brand-black">{value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Assigned Rides */}
          <div className="mb-10">
            <h2 className="font-cinzel text-xl font-medium text-brand-black mb-4">
              Active & Assigned Rides
            </h2>
            {assignedBookings.length === 0 ? (
              <Card padding="lg">
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-sea-salt-300 mx-auto mb-4" />
                  <p className="font-cinzel text-lg text-brand-black mb-2">No Active Rides</p>
                  <p className="font-cormorant text-lg text-brand-black-400">
                    {isOnline ? 'Waiting for a booking assignment...' : 'Go online to start receiving bookings.'}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {assignedBookings.map((booking) => (
                  <ActiveRideCard
                    key={booking.id}
                    booking={booking}
                    onStatusUpdate={handleRideStatusUpdate}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Completed */}
          {completedBookings.length > 0 && (
            <div>
              <h2 className="font-cinzel text-xl font-medium text-brand-black mb-4">
                Recent Completed Rides
              </h2>
              <div className="space-y-4">
                {completedBookings.slice(0, 5).map((booking) => (
                  <Card key={booking.id} padding="md">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-cinzel text-base font-medium text-terra-cotta-500">
                            {booking.reference_number}
                          </span>
                          <BookingStatusBadge status={booking.status} />
                        </div>
                        <p className="font-cormorant text-base text-brand-black-500">
                          {booking.passenger_name}
                        </p>
                        <p className="font-josefin text-xs text-brand-black-400 uppercase tracking-wider">
                          {booking.dropoff_at ? format(new Date(booking.dropoff_at), 'MMM d, h:mm a') : '—'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-cinzel text-xl font-semibold text-brand-black">
                          ${(booking.total_price * 0.8).toFixed(0)}
                        </p>
                        <p className="font-josefin text-[10px] text-brand-black-400 uppercase tracking-wider">
                          Your earnings
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const ActiveRideCard: React.FC<{
  booking: Booking;
  onStatusUpdate: (id: string, status: 'en_route' | 'arrived' | 'in_progress' | 'completed') => void;
}> = ({ booking, onStatusUpdate }) => {
  const nextStatusMap: Record<string, { status: 'en_route' | 'arrived' | 'in_progress' | 'completed'; label: string } | null> = {
    assigned: { status: 'en_route', label: 'Start Driving' },
    en_route: { status: 'arrived', label: 'Mark Arrived' },
    arrived: { status: 'in_progress', label: 'Passenger Onboard' },
    in_progress: { status: 'completed', label: 'Complete Ride' },
    completed: null,
  };

  const nextAction = nextStatusMap[booking.status];

  return (
    <Card padding="md" variant="elevated">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-cinzel text-base font-medium text-terra-cotta-500">
              {booking.reference_number}
            </span>
            <BookingStatusBadge status={booking.status} />
          </div>

          <p className="font-cinzel text-lg font-medium text-brand-black mb-2">
            {booking.passenger_name}
          </p>

          <div className="space-y-1.5 mb-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-terra-cotta-500 flex-shrink-0 mt-0.5" />
              <span className="font-cormorant text-base text-brand-black">{booking.pickup_address}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-brand-black-300 flex-shrink-0 mt-0.5" />
              <span className="font-cormorant text-base text-brand-black">{booking.dropoff_address}</span>
            </div>
          </div>

          <p className="font-josefin text-xs uppercase tracking-wider text-brand-black-400">
            Scheduled: {format(new Date(booking.scheduled_at), 'MMM d, h:mm a')}
            {booking.flight_number && ` · Flight ${booking.flight_number}`}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <p className="font-cinzel text-xl font-semibold text-brand-black">
            ${(booking.total_price * 0.8).toFixed(0)}
          </p>
          {nextAction && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStatusUpdate(booking.id, nextAction.status)}
            >
              {nextAction.label}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DriverDashboardPage;
