import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';

const VALUES = [
  { title: 'Precision', desc: 'Every minute matters in airport transportation. We operate with military-grade punctuality and proactive monitoring.' },
  { title: 'Discretion', desc: 'Your privacy is sacrosanct. Our drivers and staff operate with the highest levels of professional confidentiality.' },
  { title: 'Excellence', desc: 'From our immaculate vehicles to our impeccably trained chauffeurs — we accept nothing less than extraordinary.' },
  { title: 'Integrity', desc: 'Fixed pricing, no hidden fees, no surge charges. What you see is exactly what you pay. Always.' },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About BookAirportRide — Premium Black Car Service</title>
        <meta name="description" content="BookAirportRide is Jacksonville's premier black car airport service, founded on the belief that your journey deserves more than a rideshare." />
        <link rel="canonical" href="https://bookairportride.com/about" />
      </Helmet>

      <div className="page-header">
        <p className="section-label" style={{ color: '#c4623a', marginBottom: '0.75rem' }}>Our Story</p>
        <h1 className="font-cinzel" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, color: '#fdfcfa', letterSpacing: '0.02em' }}>
          About BookAirportRide
        </h1>
      </div>

      {/* Mission */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#fdfcfa' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label" style={{ marginBottom: '1.25rem' }}>Our Mission</p>
              <h2 className="font-cinzel" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 600, color: '#161210', letterSpacing: '0.02em', lineHeight: 1.25, marginBottom: '1.5rem' }}>
                Elevating Every Journey,<br />One Arrival at a Time
              </h2>
              <p className="font-cormorant" style={{ fontSize: '1.15rem', color: '#4a4540', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                BookAirportRide was founded in Jacksonville, Florida with a singular conviction: that airport transportation should be as refined as the journey itself. Too many travelers arrive from first-class flights only to scramble for unreliable rideshares or impersonal shuttle buses.
              </p>
              <p className="font-cormorant" style={{ fontSize: '1.15rem', color: '#4a4540', lineHeight: 1.75 }}>
                We built the infrastructure — the technology, the driver network, the operational protocols — to deliver a seamlessly luxury experience from the moment your wheels touch down to the moment you step through your door.
              </p>
            </div>
            <div>
              <div style={{ backgroundColor: '#161210', borderRadius: '2px', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '8rem', height: '8rem', backgroundColor: 'rgba(196,98,58,0.08)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
                <p className="font-cinzel" style={{ fontSize: '3rem', fontWeight: 700, color: '#c4623a', lineHeight: 1, marginBottom: '0.5rem' }}>24/7</p>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', color: 'rgba(253,252,250,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2rem' }}>Always Available</p>

                <p className="font-cinzel" style={{ fontSize: '3rem', fontWeight: 700, color: '#c4623a', lineHeight: 1, marginBottom: '0.5rem' }}>100%</p>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', color: 'rgba(253,252,250,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2rem' }}>Fixed Pricing</p>

                <p className="font-cinzel" style={{ fontSize: '3rem', fontWeight: 700, color: '#c4623a', lineHeight: 1, marginBottom: '0.5rem' }}>4</p>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', color: 'rgba(253,252,250,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Vehicle Classes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#f8f5f0' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>What Guides Us</p>
            <h2 className="font-cinzel" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 600, color: '#161210', letterSpacing: '0.02em' }}>
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                <div style={{ width: '3rem', height: '1px', backgroundColor: '#c4623a', margin: '0 auto 1.25rem' }} />
                <h3 className="font-cinzel" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#161210', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  {v.title}
                </h3>
                <p className="font-cormorant" style={{ fontSize: '1.05rem', color: '#6a6460', lineHeight: 1.65 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#e8ede8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label" style={{ marginBottom: '1rem' }}>Where We Operate</p>
              <h2 className="font-cinzel" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 600, color: '#161210', letterSpacing: '0.02em', marginBottom: '1.25rem' }}>
                Jacksonville First. Then the World.
              </h2>
              <p className="font-cormorant" style={{ fontSize: '1.1rem', color: '#4a4540', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                We launched in Jacksonville, Florida — one of the Southeast's fastest-growing cities — as our proving ground for operational excellence. Our infrastructure is built from day one to scale to all 50 states and major international markets.
              </p>
              <p className="font-cormorant" style={{ fontSize: '1.1rem', color: '#4a4540', lineHeight: 1.7 }}>
                Our expansion roadmap includes Miami, Orlando, Atlanta, New York, and Los Angeles in the US, followed by London, Dubai, Paris, and beyond. Every market launch follows the same commitment to quality that defines us in Jacksonville.
              </p>
              <div style={{ marginTop: '2rem' }}>
                <Link to="/cities" className="btn-outline-dark">View All Markets</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Current Markets', value: '1', note: 'Jacksonville, FL' },
                { label: 'Planned US Cities', value: '15+', note: 'By 2025' },
                { label: 'Intl. Markets', value: '9', note: 'In development' },
                { label: 'Vehicle Classes', value: '4', note: 'Capacity for any group' },
              ].map(s => (
                <div key={s.label} style={{ backgroundColor: '#fdfcfa', border: '1px solid #d4dfd4', borderRadius: '2px', padding: '1.5rem' }}>
                  <p className="font-cinzel" style={{ fontSize: '2rem', fontWeight: 700, color: '#c4623a', lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#161210', marginTop: '0.5rem' }}>{s.label}</p>
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', color: '#a0a8a0', letterSpacing: '0.06em', marginTop: '0.2rem' }}>{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#161210', textAlign: 'center' }}>
        <div className="max-w-2xl mx-auto">
          <p className="section-label" style={{ color: '#c4623a', marginBottom: '1rem' }}>Get in Touch</p>
          <h2 className="font-cinzel" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 600, color: '#fdfcfa', marginBottom: '1rem' }}>
            We'd Love to Hear From You
          </h2>
          <p className="font-cormorant" style={{ fontSize: '1.1rem', color: 'rgba(253,252,250,0.6)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
            For booking inquiries, partnership discussions, or general questions, our team is available 24/7.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            <a href="mailto:info@bookairportride.com" style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.8rem', letterSpacing: '0.1em', color: '#c4623a', textDecoration: 'none' }}>
              info@bookairportride.com
            </a>
            <a href="mailto:reservations@bookairportride.com" style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.8rem', letterSpacing: '0.1em', color: 'rgba(253,252,250,0.5)', textDecoration: 'none' }}>
              reservations@bookairportride.com
            </a>
          </div>
          <div style={{ marginTop: '2.5rem' }}>
            <Link to="/reserve" className="btn-terra" style={{ padding: '0.9rem 2.5rem' }}>
              Book a Ride
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
