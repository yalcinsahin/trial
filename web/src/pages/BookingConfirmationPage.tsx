import { useParams, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Car, Phone } from 'lucide-react';
import Footer from '../components/Footer';

export default function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation() as { state: { booking?: Record<string, unknown>; price?: Record<string, number> } | null };

  const booking = state?.booking as Record<string, string | boolean | number> | undefined;
  const price = state?.price as { total?: number; baseFare?: number; distanceFee?: number; meetGreetFee?: number } | undefined;

  const vehicleNames: Record<string, string> = {
    'executive-suv': 'Executive SUV',
    'first-class-suv': 'First Class SUV',
    'executive-van': 'Executive Van',
    'vip-sprinter': 'VIP Sprinter',
  };

  return (
    <>
      <Helmet>
        <title>Booking Confirmed — BookAirportRide</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div style={{ minHeight: '100vh', backgroundColor: '#fdfcfa' }}>
        {/* Confirmation Header */}
        <div style={{ backgroundColor: '#161210', padding: '5rem 1.5rem 4rem', textAlign: 'center' }}>
          <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: 'rgba(196,98,58,0.15)', border: '1px solid rgba(196,98,58,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <CheckCircle size={22} color="#c4623a" />
          </div>
          <p className="section-label" style={{ color: '#c4623a', marginBottom: '0.75rem' }}>Booking Confirmed</p>
          <h1 className="font-cinzel" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, color: '#fdfcfa' }}>
            Your Ride is Reserved
          </h1>
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.8rem', color: 'rgba(253,252,250,0.5)', letterSpacing: '0.1em', marginTop: '0.75rem' }}>
            Reference: {id}
          </p>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
          {/* Confirmation notice */}
          <div style={{ backgroundColor: '#f0faf5', border: '1px solid #b8e0c8', borderRadius: '2px', padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle size={16} color="#2a7a4a" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: '#2a7a4a', letterSpacing: '0.06em' }}>
                Confirmation email sent
              </p>
              <p className="font-cormorant" style={{ fontSize: '0.95rem', color: '#4a7a5a', marginTop: '0.2rem' }}>
                A booking confirmation has been sent to {booking?.email as string || 'your email address'} with full trip details.
              </p>
            </div>
          </div>

          {/* Trip Details */}
          <div style={{ border: '1px solid #e8ede8', borderRadius: '2px', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#f8f5f0', padding: '1rem 1.5rem', borderBottom: '1px solid #e8ede8' }}>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#161210' }}>
                Trip Details
              </p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div className="grid grid-cols-1 gap-4">
                {booking?.pickupAddress && (
                  <div>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a0a8a0', marginBottom: '0.2rem' }}>From</p>
                    <p className="font-cormorant" style={{ fontSize: '1.1rem', color: '#161210' }}>{booking.pickupAddress as string}</p>
                  </div>
                )}
                {booking?.dropoffAddress && (
                  <div>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a0a8a0', marginBottom: '0.2rem' }}>To</p>
                    <p className="font-cormorant" style={{ fontSize: '1.1rem', color: '#161210' }}>{booking.dropoffAddress as string}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {booking?.pickupDate && (
                    <div>
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a0a8a0', marginBottom: '0.2rem' }}>Date</p>
                      <p className="font-cormorant" style={{ fontSize: '1.1rem', color: '#161210' }}>{booking.pickupDate as string}</p>
                    </div>
                  )}
                  {booking?.pickupTime && (
                    <div>
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a0a8a0', marginBottom: '0.2rem' }}>Time</p>
                      <p className="font-cormorant" style={{ fontSize: '1.1rem', color: '#161210' }}>{booking.pickupTime as string}</p>
                    </div>
                  )}
                </div>
                {booking?.vehicleClass && (
                  <div>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a0a8a0', marginBottom: '0.2rem' }}>Vehicle</p>
                    <p className="font-cormorant" style={{ fontSize: '1.1rem', color: '#161210' }}>{vehicleNames[booking.vehicleClass as string] || booking.vehicleClass as string}</p>
                  </div>
                )}
                {booking?.flightNumber && (
                  <div>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a0a8a0', marginBottom: '0.2rem' }}>Flight</p>
                    <p className="font-cormorant" style={{ fontSize: '1.1rem', color: '#161210' }}>{booking.airline as string} {booking.flightNumber as string}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Driver Assignment */}
          <div style={{ border: '1px solid #e8ede8', borderRadius: '2px', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#f8f5f0', padding: '1rem 1.5rem', borderBottom: '1px solid #e8ede8' }}>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#161210' }}>
                Driver Assignment
              </p>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#f8f5f0', border: '1px solid #e8ede8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Car size={14} color="#c4623a" />
              </div>
              <div>
                <p className="font-cormorant" style={{ fontSize: '1.05rem', color: '#161210' }}>
                  A professional driver will be assigned to your booking 24 hours before pickup.
                </p>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#a0a8a0', letterSpacing: '0.06em', marginTop: '0.25rem' }}>
                  You'll receive driver details, vehicle info, and contact number by email and SMS.
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          {price && (
            <div style={{ border: '1px solid #e8ede8', borderRadius: '2px', marginBottom: '1.5rem', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#f8f5f0', padding: '1rem 1.5rem', borderBottom: '1px solid #e8ede8' }}>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#161210' }}>
                  Payment Summary
                </p>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {[
                  { label: 'Base Fare', amount: price.baseFare },
                  { label: 'Distance Fee', amount: price.distanceFee },
                  ...(price.meetGreetFee ? [{ label: 'Meet & Greet', amount: price.meetGreetFee }] : []),
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', letterSpacing: '0.06em', color: '#8a8480' }}>{item.label}</span>
                    <span className="font-cormorant" style={{ fontSize: '1rem', color: '#4a4540' }}>${(item.amount || 0).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #e8ede8', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', color: '#161210' }}>Total Paid</span>
                  <span className="price-total" style={{ fontSize: '1.5rem' }}>${(price.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Important Info */}
          <div style={{ backgroundColor: '#f8f5f0', border: '1px solid #e8ede8', borderRadius: '2px', padding: '1.5rem', marginBottom: '2rem' }}>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#161210', marginBottom: '1rem' }}>
              Important Reminders
            </p>
            {[
              'Your driver will track your flight and adjust for any delays automatically.',
              'You will receive driver details 24 hours before your pickup.',
              'Please be ready at the designated pickup location at your scheduled time.',
              'For any changes, contact us at reservations@bookairportride.com.',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '4px', height: '4px', backgroundColor: '#c4623a', borderRadius: '50%', flexShrink: 0, marginTop: '0.45rem' }} />
                <p className="font-cormorant" style={{ fontSize: '0.95rem', color: '#6a6460', lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1rem', border: '1px solid #e8ede8', borderRadius: '2px', marginBottom: '2rem' }}>
            <Phone size={14} color="#c4623a" />
            <div>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a0a8a0' }}>Need Help?</p>
              <p className="font-cormorant" style={{ fontSize: '1rem', color: '#161210' }}>reservations@bookairportride.com</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/" className="btn-outline-dark">Back to Home</Link>
            <Link to="/reserve" className="btn-terra">Book Another Ride</Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
