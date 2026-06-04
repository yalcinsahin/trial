import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, CheckCircle, Clock, Car, MapPin, Phone } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { BookingStatusBadge } from '@/components/ui/Badge';
import { useBooking } from '@/hooks/useBooking';
import type { Booking, BookingStatus } from '@/types';
import { format } from 'date-fns';

const lookupSchema = z.object({
  reference_number: z.string().min(6, 'Enter a valid reference number'),
});

type LookupData = z.infer<typeof lookupSchema>;

// ─── Status Timeline ──────────────────────────────────────────────────────────

const STATUS_TIMELINE: Array<{ status: BookingStatus; label: string; description: string }> = [
  { status: 'pending', label: 'Booking Received', description: 'Your booking is being processed' },
  { status: 'confirmed', label: 'Confirmed', description: 'Booking confirmed, driver being assigned' },
  { status: 'assigned', label: 'Driver Assigned', description: 'A professional chauffeur has been assigned' },
  { status: 'en_route', label: 'En Route', description: 'Your driver is on the way to pickup' },
  { status: 'arrived', label: 'Driver Arrived', description: 'Your driver is waiting at pickup' },
  { status: 'in_progress', label: 'In Progress', description: 'You are on your way!' },
  { status: 'completed', label: 'Completed', description: 'Journey complete. Thank you for riding with us.' },
];

const STATUS_ORDER: BookingStatus[] = [
  'pending', 'confirmed', 'assigned', 'en_route', 'arrived', 'in_progress', 'completed',
];

const BookingTimeline: React.FC<{ booking: Booking }> = ({ booking }) => {
  const currentIndex = STATUS_ORDER.indexOf(booking.status);
  const isCancelled = booking.status === 'cancelled' || booking.status === 'no_show';

  if (isCancelled) {
    return (
      <div className="p-4 bg-red-50 border border-red-100">
        <p className="font-josefin text-xs uppercase tracking-wider text-red-600">
          {booking.status === 'cancelled' ? 'Booking Cancelled' : 'No Show'}
        </p>
        {booking.cancellation_reason && (
          <p className="font-cormorant text-base text-red-500 mt-1">{booking.cancellation_reason}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {STATUS_TIMELINE.map((item, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={item.status} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div
                className={[
                  'w-8 h-8 flex items-center justify-center border-2 transition-colors duration-300 flex-shrink-0',
                  isCurrent
                    ? 'bg-terra-cotta-500 border-terra-cotta-500 text-warm-white'
                    : isCompleted
                    ? 'bg-brand-black border-brand-black text-warm-white'
                    : 'bg-warm-white border-sea-salt-200 text-sea-salt-300',
                ].join(' ')}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle className="h-3.5 w-3.5" />
                ) : isCurrent ? (
                  <Clock className="h-3.5 w-3.5" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
              {index < STATUS_TIMELINE.length - 1 && (
                <div
                  className={[
                    'w-px flex-1 my-1',
                    isCompleted ? 'bg-brand-black' : 'bg-sea-salt-200',
                  ].join(' ')}
                  style={{ minHeight: '24px' }}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-6">
              <p
                className={[
                  'font-josefin text-xs uppercase tracking-wider',
                  isCurrent
                    ? 'text-terra-cotta-500'
                    : isCompleted
                    ? 'text-brand-black'
                    : 'text-brand-black-300',
                ].join(' ')}
              >
                {item.label}
              </p>
              <p
                className={[
                  'font-cormorant text-base leading-relaxed',
                  isCompleted ? 'text-brand-black-500' : 'text-brand-black-300',
                ].join(' ')}
              >
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Booking Details ──────────────────────────────────────────────────────────

const BookingDetails: React.FC<{ booking: Booking }> = ({ booking }) => (
  <div className="space-y-6">
    {/* Status Badge */}
    <div className="flex items-center justify-between">
      <div>
        <span className="font-josefin text-[10px] uppercase tracking-widest text-brand-black-400">
          Reference
        </span>
        <p className="font-cinzel text-2xl font-semibold text-terra-cotta-500">
          {booking.reference_number}
        </p>
      </div>
      <BookingStatusBadge status={booking.status} />
    </div>

    {/* Trip Info */}
    <Card padding="md" variant="outlined">
      <div className="space-y-4">
        <div className="flex gap-3">
          <MapPin className="h-4 w-4 text-terra-cotta-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">Pickup</span>
            <p className="font-cormorant text-lg text-brand-black">{booking.pickup_address}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <MapPin className="h-4 w-4 text-brand-black-300 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">Dropoff</span>
            <p className="font-cormorant text-lg text-brand-black">{booking.dropoff_address}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Clock className="h-4 w-4 text-brand-black-300 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">Scheduled</span>
            <p className="font-cormorant text-lg text-brand-black">
              {format(new Date(booking.scheduled_at), 'MMMM d, yyyy — h:mm a')}
            </p>
          </div>
        </div>
        {booking.flight_number && (
          <div className="flex gap-3">
            <Car className="h-4 w-4 text-brand-black-300 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">Flight</span>
              <p className="font-cormorant text-lg text-brand-black">{booking.flight_number}</p>
            </div>
          </div>
        )}
      </div>
    </Card>

    {/* Timeline */}
    <div>
      <h3 className="font-cinzel text-base font-medium text-brand-black mb-4">Ride Status</h3>
      <BookingTimeline booking={booking} />
    </div>

    {/* Support */}
    <div className="pt-4 border-t border-sea-salt-200">
      <p className="font-josefin text-xs uppercase tracking-wider text-brand-black-400 mb-2">
        Need help?
      </p>
      <a
        href="tel:(904) 555-0100"
        className="flex items-center gap-2 font-josefin text-sm text-terra-cotta-500 hover:text-terra-cotta-600"
      >
        <Phone className="h-4 w-4" />
        (904) 555-0100 — 24/7 Support
      </a>
    </div>
  </div>
);

// ─── Track Ride Page ──────────────────────────────────────────────────────────

const TrackRidePage: React.FC = () => {
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);
  const { lookupBooking, isLoading, error } = useBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LookupData>({
    resolver: zodResolver(lookupSchema),
  });

  const handleLookup = async (data: LookupData) => {
    const { booking } = await lookupBooking(data.reference_number);
    if (booking) setFoundBooking(booking);
  };

  return (
    <Layout>
      <Helmet>
        <title>Track Your Ride — BookAirportRide</title>
        <meta
          name="description"
          content="Track your BookAirportRide airport transfer in real-time."
        />
      </Helmet>

      <div className="min-h-screen bg-sea-salt-50 py-12">
        <div className="container-luxury">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="font-cinzel text-3xl md:text-4xl font-semibold text-brand-black mb-2">
                Track Your Ride
              </h1>
              <p className="font-cormorant text-xl text-brand-black-400">
                Enter your booking reference to view real-time status.
              </p>
            </div>

            {/* Lookup Form */}
            {!foundBooking && (
              <Card padding="lg" variant="elevated">
                <form onSubmit={handleSubmit(handleLookup)} className="space-y-5">
                  <Input
                    label="Booking Reference Number"
                    placeholder="BAR-XXXXXXX"
                    hint="Found in your confirmation email"
                    error={errors.reference_number?.message ?? (error ?? undefined)}
                    {...register('reference_number')}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                    leftIcon={<Search className="h-4 w-4" />}
                  >
                    Find My Booking
                  </Button>
                </form>
              </Card>
            )}

            {/* Booking Details */}
            {foundBooking && (
              <Card padding="lg" variant="elevated">
                <BookingDetails booking={foundBooking} />
                <div className="mt-6 pt-4 border-t border-sea-salt-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFoundBooking(null)}
                  >
                    Look up another booking
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackRidePage;
