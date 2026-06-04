import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, CheckCircle, Plus, MapPin, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BookingStatusBadge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useBooking } from '@/hooks/useBooking';
import type { Booking } from '@/types';
import { format } from 'date-fns';

const VEHICLE_LABELS: Record<string, string> = {
  standard_sedan: 'Standard Sedan',
  business_sedan: 'Business Sedan',
  first_class_suv: 'First Class SUV',
  luxury_van: 'Luxury Van',
};

const DashboardPage: React.FC = () => {
  const { user, profile, isAuthenticated, isInitialized } = useAuth();
  const { fetchPassengerBookings } = useBooking();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;
    setIsLoading(true);
    const { bookings: data } = await fetchPassengerBookings(user.id);
    setBookings(data);
    setIsLoading(false);
  };

  if (!isInitialized) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/dashboard" replace />;
  }

  const upcomingBookings = bookings.filter((b) =>
    ['pending', 'confirmed', 'assigned', 'en_route', 'arrived', 'in_progress'].includes(b.status)
  );

  const pastBookings = bookings.filter((b) =>
    ['completed', 'cancelled', 'no_show'].includes(b.status)
  );

  return (
    <Layout>
      <Helmet>
        <title>My Dashboard — BookAirportRide</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-sea-salt-50 py-10">
        <div className="container-luxury">
          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-cinzel text-3xl font-semibold text-brand-black mb-1">
                My Dashboard
              </h1>
              <p className="font-cormorant text-xl text-brand-black-400">
                Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Traveler'}
              </p>
            </div>
            <Link to="/book">
              <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
                Book Transfer
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total Bookings', value: bookings.length, icon: CheckCircle },
              { label: 'Upcoming', value: upcomingBookings.length, icon: Clock },
              { label: 'Completed', value: pastBookings.filter((b) => b.status === 'completed').length, icon: CheckCircle },
              { label: 'Total Spent', value: `$${bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.total_price, 0).toFixed(0)}`, icon: MapPin },
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

          {/* Upcoming Bookings */}
          <div className="mb-10">
            <h2 className="font-cinzel text-xl font-medium text-brand-black mb-4">
              Upcoming Rides
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="md" />
              </div>
            ) : upcomingBookings.length === 0 ? (
              <Card padding="lg">
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-sea-salt-300 mx-auto mb-4" />
                  <p className="font-cinzel text-lg text-brand-black mb-2">No Upcoming Rides</p>
                  <p className="font-cormorant text-lg text-brand-black-400 mb-6">
                    Your scheduled transfers will appear here.
                  </p>
                  <Link to="/book">
                    <Button variant="primary" size="md">Book a Transfer</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </div>

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="font-cinzel text-xl font-medium text-brand-black mb-4">
                Past Rides
              </h2>
              <div className="space-y-4">
                {pastBookings.slice(0, 5).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
              {pastBookings.length > 5 && (
                <div className="mt-4 text-center">
                  <Button variant="ghost" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    View All Past Rides
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => (
  <Card padding="md">
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-cinzel text-base font-medium text-terra-cotta-500">
            {booking.reference_number}
          </span>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 text-terra-cotta-500 flex-shrink-0 mt-0.5" />
            <span className="font-cormorant text-base text-brand-black truncate">
              {booking.pickup_address}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 text-brand-black-300 flex-shrink-0 mt-0.5" />
            <span className="font-cormorant text-base text-brand-black truncate">
              {booking.dropoff_address}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="font-cinzel text-xl font-semibold text-brand-black">
          ${booking.total_price.toFixed(0)}
        </p>
        <p className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">
          {format(new Date(booking.scheduled_at), 'MMM d, yyyy')}
        </p>
        <span className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">
          {VEHICLE_LABELS[booking.vehicle_class] ?? booking.vehicle_class}
        </span>
      </div>
    </div>
  </Card>
);

export default DashboardPage;
