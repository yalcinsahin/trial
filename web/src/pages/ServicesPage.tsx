import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plane, Briefcase, CalendarDays, Clock, Navigation } from 'lucide-react';
import Footer from '../components/Footer';

const SERVICES = [
  {
    icon: Plane,
    title: 'Airport Transfers',
    description: 'Seamless pickup and drop-off at all major airports. We track your flight, monitor delays, and ensure your driver is always waiting — never early, never late.',
    vehicles: ['Executive SUV', 'First Class SUV', 'Executive Van', 'VIP Sprinter'],
    startingPrice: 85,
    features: ['Flight tracking included', 'Meet & Greet available', 'Fixed pricing', '24/7 availability'],
  },
  {
    icon: Briefcase,
    title: 'Corporate Rides',
    description: 'Elevate your business travel. Impress clients, transport executives, and handle corporate logistics with a level of professionalism that reflects your brand.',
    vehicles: ['Executive SUV', 'First Class SUV'],
    startingPrice: 85,
    features: ['Monthly billing available', 'Corporate account setup', 'Priority driver assignment', 'Confidentiality assured'],
  },
  {
    icon: CalendarDays,
    title: 'Event Transportation',
    description: 'Weddings, galas, sporting events, concerts — make every entrance memorable. Coordinated multi-vehicle logistics for groups of any size.',
    vehicles: ['First Class SUV', 'Executive Van', 'VIP Sprinter'],
    startingPrice: 110,
    features: ['Multi-vehicle coordination', 'Red carpet service', 'Customized scheduling', 'Group packages available'],
  },
  {
    icon: Clock,
    title: 'Hourly Charter',
    description: 'Time is your most valuable asset. Keep your driver on standby for the entire day — meetings, errands, appointments, all handled with effortless continuity.',
    vehicles: ['Executive SUV', 'First Class SUV'],
    startingPrice: 95,
    features: ['Minimum 3-hour booking', 'Waiting time included', 'Multiple stops', 'Privacy divider available'],
  },
  {
    icon: Navigation,
    title: 'Long Distance',
    description: 'From city to city, coast to coast. Premium point-to-point transfers for journeys that deserve the comfort and reliability of a professional chauffeur.',
    vehicles: ['Executive SUV', 'First Class SUV', 'VIP Sprinter'],
    startingPrice: 165,
    features: ['Interstate transfers', 'Overnight capability', 'Custom routing', 'Complimentary refreshments'],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Luxury Airport Transfer Services — BookAirportRide</title>
        <meta name="description" content="Premium black car services including airport transfers, corporate rides, event transportation, and hourly charter." />
        <link rel="canonical" href="https://bookairportride.com/services" />
      </Helmet>

      <div className="page-header">
        <p className="section-label" style={{ color: '#c4623a', marginBottom: '0.75rem' }}>What We Offer</p>
        <h1 className="font-cinzel" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, color: '#fdfcfa', letterSpacing: '0.02em' }}>
          Premium Transportation Services
        </h1>
        <p className="font-cormorant" style={{ fontSize: '1.15rem', color: 'rgba(253,252,250,0.6)', marginTop: '0.75rem', maxWidth: '520px', margin: '0.75rem auto 0' }}>
          Every service refined to the highest standard of luxury and reliability.
        </p>
      </div>

      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#e8ede8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            {SERVICES.map((service, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#fdfcfa',
                  border: '1px solid #d4dfd4',
                  borderRadius: '2px',
                  padding: '2.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '2.5rem',
                  alignItems: 'start',
                }}
                className="flex-col-on-mobile"
              >
                {/* Left: Icon + Title + Desc */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: '#f8f5f0', border: '1px solid #e8ede8', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <service.icon size={16} color="#c4623a" />
                    </div>
                    <h2 className="font-cinzel" style={{ fontSize: '1rem', fontWeight: 600, color: '#161210', letterSpacing: '0.05em' }}>
                      {service.title}
                    </h2>
                  </div>
                  <p className="font-cormorant" style={{ fontSize: '1.05rem', color: '#4a4540', lineHeight: 1.7 }}>
                    {service.description}
                  </p>
                </div>

                {/* Middle: Vehicles + Features */}
                <div>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8480', marginBottom: '0.6rem' }}>
                    Vehicle Options
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {service.vehicles.map(v => (
                      <span key={v} style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.06em', color: '#4a4540', backgroundColor: '#f0ede8', border: '1px solid #e8e0d8', padding: '0.3rem 0.7rem', borderRadius: '1px' }}>
                        {v}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8480', marginBottom: '0.6rem' }}>
                    Included
                  </p>
                  {service.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <div style={{ width: '4px', height: '4px', backgroundColor: '#c4623a', borderRadius: '50%', flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', color: '#6a6460', letterSpacing: '0.05em' }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Right: Price + CTA */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#a0a8a0', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Starting from
                  </p>
                  <p className="font-cinzel" style={{ fontSize: '2rem', fontWeight: 700, color: '#c4623a', lineHeight: 1, marginBottom: '1.5rem' }}>
                    ${service.startingPrice}
                  </p>
                  <Link to="/reserve" className="btn-terra">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#161210', textAlign: 'center' }}>
        <div className="max-w-2xl mx-auto">
          <p className="section-label" style={{ color: '#c4623a', marginBottom: '1rem' }}>All Services Include</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
            {['Fixed Pricing', 'Professional Drivers', 'Real-Time Tracking', 'Easy Online Booking'].map(item => (
              <div key={item}>
                <div style={{ width: '2px', height: '1.5rem', backgroundColor: '#c4623a', margin: '0 auto 0.75rem' }} />
                <p className="font-cinzel" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fdfcfa', letterSpacing: '0.06em' }}>{item}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '3rem' }}>
            <Link to="/reserve" className="btn-terra" style={{ fontSize: '0.8rem', padding: '0.9rem 2.5rem' }}>
              Reserve Your Ride
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
