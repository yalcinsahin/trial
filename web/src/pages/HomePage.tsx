import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Clock, Plane, Users, Star, MapPin, Shield } from 'lucide-react';
import BookingWidget from '../components/BookingWidget';
import Footer from '../components/Footer';
import { VEHICLE_CLASSES } from '../constants/pricing';
import { US_CITIES } from '../constants/cities';

const TRUST_ITEMS = [
  { icon: Shield, label: 'Professional Drivers', desc: 'Vetted, licensed, insured chauffeurs' },
  { icon: Clock, label: '24/7 Service', desc: 'Available any hour, any day' },
  { icon: Plane, label: 'Flight Tracking', desc: 'We monitor your flight in real time' },
  { icon: Users, label: 'Meet & Greet', desc: 'Personal welcome at the terminal' },
  { icon: CheckCircle, label: 'Fixed Pricing', desc: 'No surge, no surprises. Ever.' },
];

const TESTIMONIALS = [
  {
    quote: "The driver was waiting exactly where they said, held a sign with my name, and helped with every bag. I'll never use another service for airport transfers.",
    author: 'Michael T.',
    title: 'Corporate Executive, Jacksonville FL',
    rating: 5,
  },
  {
    quote: "Flew in late from London — my flight was delayed two hours and my driver tracked it automatically and was there waiting. Absolutely impeccable.",
    author: 'Sarah K.',
    title: 'Frequent Flyer, New York NY',
    rating: 5,
  },
  {
    quote: "I booked the VIP Sprinter for our entire team of 12. Seamless from booking to drop-off. The vehicle was immaculate and the driver professional.",
    author: 'James R.',
    title: 'VP Operations, Atlanta GA',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>BookAirportRide — Premium Black Car Airport Service</title>
        <meta name="description" content="Luxury black car airport transfers. Professional drivers, flight tracking, meet and greet. Book online instantly." />
        <meta property="og:title" content="BookAirportRide — Premium Black Car Airport Service" />
        <meta property="og:description" content="Luxury black car airport transfers. Professional drivers, flight tracking, meet and greet." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://bookairportride.com" />
      </Helmet>

      {/* ───────── HERO ───────── */}
      <section
        style={{
          minHeight: '100vh',
          backgroundColor: '#161210',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(196,98,58,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(196,98,58,0.05) 0%, transparent 50%)`,
          }}
        />
        {/* Subtle grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(253,252,250,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(253,252,250,0.03) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 w-full" style={{ paddingTop: '5rem', position: 'relative', zIndex: 1 }}>
          <div className="max-w-3xl">
            <p className="section-label fade-up-1" style={{ color: '#c4623a', marginBottom: '1.5rem' }}>
              Jacksonville, FL · Nationwide · International
            </p>
            <h1
              className="font-cinzel fade-up-2"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 700,
                color: '#fdfcfa',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                marginBottom: '1.75rem',
              }}
            >
              Your Arrival.<br />
              <span style={{ color: '#c4623a' }}>Elevated.</span>
            </h1>
            <p
              className="font-cormorant fade-up-3"
              style={{ fontSize: '1.35rem', color: 'rgba(253,252,250,0.75)', lineHeight: 1.6, maxWidth: '520px', marginBottom: '2.5rem' }}
            >
              Premium black car airport transfers with professional chauffeurs, real-time flight tracking, and white-glove service.
            </p>
            <div className="flex flex-wrap gap-4 fade-up-4">
              <Link to="/reserve" className="btn-terra" style={{ fontSize: '0.8rem', padding: '0.9rem 2.5rem' }}>
                Reserve Your Ride
              </Link>
              <Link to="/services" className="btn-outline-white" style={{ fontSize: '0.8rem', padding: '0.9rem 2.5rem' }}>
                View Services
              </Link>
            </div>
          </div>

          {/* Booking Widget */}
          <div
            className="fade-up-5"
            style={{
              marginTop: '4rem',
              backgroundColor: 'rgba(22,18,16,0.85)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '2px',
              padding: '1.5rem',
              backdropFilter: 'blur(8px)',
            }}
          >
            <p className="section-label" style={{ color: 'rgba(253,252,250,0.5)', marginBottom: '1rem' }}>
              Quick Quote
            </p>
            <BookingWidget dark />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            opacity: 0.4,
            animation: 'fadeUp 1s 1.2s ease both',
          }}
        >
          <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fdfcfa' }}>
            Scroll
          </span>
          <div style={{ width: '1px', height: '2rem', background: 'linear-gradient(to bottom, #fdfcfa, transparent)' }} />
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#fdfcfa' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>The Process</p>
            <h2 className="font-cinzel" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 600, color: '#161210', letterSpacing: '0.02em' }}>
              Effortless from Start to Arrival
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              {
                step: '01',
                title: 'Book Online',
                desc: 'Reserve your ride in minutes. Enter your details, select your vehicle class, and confirm with secure payment.',
                icon: '✦',
              },
              {
                step: '02',
                title: 'We Track Your Flight',
                desc: 'Our system monitors your flight in real time. Delays, gate changes — your driver adjusts automatically.',
                icon: '✦',
              },
              {
                step: '03',
                title: 'Your Driver Awaits',
                desc: 'Your professional chauffeur greets you with a name sign at arrivals, assists with luggage, and whisks you away.',
                icon: '✦',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '2.5rem',
                  borderRight: i < 2 ? '1px solid #e8ede8' : 'none',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.25rem' }}>
                  <span className="font-cinzel" style={{ fontSize: '3.5rem', fontWeight: 700, color: '#e8ede8', lineHeight: 1 }}>
                    {item.step}
                  </span>
                  <span style={{ fontSize: '1rem', color: '#c4623a' }}>{item.icon}</span>
                </div>
                <h3 className="font-cinzel" style={{ fontSize: '1rem', fontWeight: 600, color: '#161210', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  {item.title}
                </h3>
                <p className="font-cormorant" style={{ fontSize: '1.05rem', color: '#4a4540', lineHeight: 1.65 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FLEET PREVIEW ───────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#f8f5f0' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="section-label" style={{ marginBottom: '0.75rem' }}>Our Fleet</p>
              <h2 className="font-cinzel" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 600, color: '#161210', letterSpacing: '0.02em' }}>
                Choose Your Vehicle Class
              </h2>
            </div>
            <Link to="/reserve" className="btn-terra" style={{ flexShrink: 0 }}>Book Now</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VEHICLE_CLASSES.map((v) => (
              <Link
                key={v.id}
                to="/reserve"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="card-hover"
                  style={{
                    backgroundColor: '#fdfcfa',
                    border: '1px solid #e8ede8',
                    borderRadius: '2px',
                    padding: '1.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {/* Vehicle icon placeholder */}
                  <div style={{ height: '3rem', display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ width: '2.5rem', height: '2px', background: '#c4623a' }} />
                  </div>
                  <h3 className="font-cinzel" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#161210', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    {v.name}
                  </h3>
                  <p className="font-cormorant" style={{ fontSize: '0.95rem', color: '#6a6460', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {v.description}
                  </p>
                  <div className="flex items-center gap-4 mb-3">
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#8a8480', letterSpacing: '0.08em' }}>
                      Up to {v.passengers} passengers
                    </span>
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#8a8480', letterSpacing: '0.08em' }}>
                      {v.bags} bags
                    </span>
                  </div>
                  <div style={{ borderTop: '1px solid #e8ede8', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', color: '#a0a8a0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Starting from
                      </span>
                      <p className="font-cinzel" style={{ fontSize: '1.2rem', fontWeight: 600, color: '#c4623a', marginTop: '0.1rem' }}>
                        ${v.minimumFare.toFixed(0)}
                      </p>
                    </div>
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#c4623a', letterSpacing: '0.08em' }}>
                      Select →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TRUST ───────── */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#161210' }}>
        <div className="max-w-7xl mx-auto">
          <p className="section-label text-center" style={{ color: '#c4623a', marginBottom: '3rem' }}>
            Why BookAirportRide
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {TRUST_ITEMS.map((item, i) => (
              <div key={i} className="text-center">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <item.icon size={22} color="#c4623a" />
                </div>
                <h4 className="font-cinzel" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fdfcfa', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  {item.label}
                </h4>
                <p className="font-cormorant" style={{ fontSize: '0.9rem', color: 'rgba(253,252,250,0.5)', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CITIES ───────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#e8ede8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Coverage</p>
            <h2 className="font-cinzel" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 600, color: '#161210', letterSpacing: '0.02em' }}>
              Cities We Serve
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {US_CITIES.slice(0, 10).map((city) => (
              <Link
                key={city.slug}
                to="/cities"
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    backgroundColor: city.status === 'live' ? '#161210' : '#fdfcfa',
                    border: city.status === 'live' ? '1px solid #161210' : '1px solid #c2d0c2',
                    borderRadius: '2px',
                    padding: '1rem',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <MapPin size={10} color={city.status === 'live' ? '#c4623a' : '#a0a8a0'} />
                    <span className="font-josefin" style={{ fontSize: '0.65rem', color: city.status === 'live' ? '#c4623a' : '#a0a8a0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {city.status === 'live' ? 'Live Now' : 'Coming Soon'}
                    </span>
                  </div>
                  <p className="font-cinzel" style={{ fontSize: '0.85rem', fontWeight: 600, color: city.status === 'live' ? '#fdfcfa' : '#161210', letterSpacing: '0.04em' }}>
                    {city.name}
                  </p>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: city.status === 'live' ? 'rgba(253,252,250,0.6)' : '#8a8480', letterSpacing: '0.08em' }}>
                    {city.state}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/cities" className="btn-outline-dark">View All Cities</Link>
          </div>
        </div>
      </section>

      {/* ───────── TESTIMONIALS ───────── */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#fdfcfa' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Client Experience</p>
            <h2 className="font-cinzel" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 600, color: '#161210', letterSpacing: '0.02em' }}>
              Trusted by Discerning Travelers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#f8f5f0',
                  border: '1px solid #e8ede8',
                  borderRadius: '2px',
                  padding: '2rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1.25rem' }}>
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} size={12} fill="#c4623a" color="#c4623a" />
                  ))}
                </div>
                <p className="font-cormorant" style={{ fontSize: '1.1rem', color: '#2a2420', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>
                <div style={{ borderTop: '1px solid #e8ede8', paddingTop: '1rem' }}>
                  <p className="font-cinzel" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#161210', letterSpacing: '0.08em' }}>
                    {t.author}
                  </p>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#a0a8a0', letterSpacing: '0.06em', marginTop: '0.2rem' }}>
                    {t.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA BANNER ───────── */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#161210', textAlign: 'center' }}>
        <div className="max-w-3xl mx-auto">
          <span className="terra-divider" style={{ display: 'block', margin: '0 auto 1.5rem' }} />
          <h2 className="font-cinzel" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, color: '#fdfcfa', letterSpacing: '0.02em', marginBottom: '1rem' }}>
            Ready to Experience the Difference?
          </h2>
          <p className="font-cormorant" style={{ fontSize: '1.15rem', color: 'rgba(253,252,250,0.65)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
            Book your premium airport transfer today. Transparent pricing, no surprises, just exceptional service.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/reserve" className="btn-terra" style={{ fontSize: '0.8rem', padding: '0.9rem 2.5rem' }}>
              Reserve Your Ride
            </Link>
            <Link to="/services" className="btn-outline-white" style={{ fontSize: '0.8rem', padding: '0.9rem 2.5rem' }}>
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
