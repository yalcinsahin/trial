import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin } from 'lucide-react';
import Footer from '../components/Footer';
import { US_CITIES, INTL_CITIES } from '../constants/cities';

export default function CitiesPage() {
  return (
    <>
      <Helmet>
        <title>Cities We Serve — BookAirportRide</title>
        <meta name="description" content="Premium black car airport service across the US and internationally. All cities and airports we serve." />
        <link rel="canonical" href="https://bookairportride.com/cities" />
      </Helmet>

      <div className="page-header">
        <p className="section-label" style={{ color: '#c4623a', marginBottom: '0.75rem' }}>Coverage</p>
        <h1 className="font-cinzel" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, color: '#fdfcfa', letterSpacing: '0.02em' }}>
          Cities We Serve
        </h1>
        <p className="font-cormorant" style={{ fontSize: '1.1rem', color: 'rgba(253,252,250,0.6)', marginTop: '0.75rem', maxWidth: '480px', margin: '0.75rem auto 0' }}>
          Launching in Jacksonville and expanding to the world's most important business and travel destinations.
        </p>
      </div>

      {/* US Cities */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#fdfcfa' }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <p className="section-label">United States</p>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e8ede8' }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {US_CITIES.map((city) => (
              <div
                key={city.slug}
                style={{
                  backgroundColor: city.status === 'live' ? '#161210' : '#f8f5f0',
                  border: `1px solid ${city.status === 'live' ? '#161210' : '#e8ede8'}`,
                  borderRadius: '2px',
                  padding: '1.5rem 1.25rem',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
                className="card-hover"
              >
                {city.status === 'live' && (
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: '6px', height: '6px', backgroundColor: '#c4623a', borderRadius: '50%' }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                  <MapPin size={9} color={city.status === 'live' ? '#c4623a' : '#c2d0c2'} />
                  <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: city.status === 'live' ? '#c4623a' : '#b0b8b0' }}>
                    {city.status === 'live' ? 'Live Now' : 'Coming Soon'}
                  </span>
                </div>
                <p className="font-cinzel" style={{ fontSize: '0.9rem', fontWeight: 600, color: city.status === 'live' ? '#fdfcfa' : '#161210', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
                  {city.name}
                </p>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: city.status === 'live' ? 'rgba(253,252,250,0.5)' : '#a0a8a0', letterSpacing: '0.08em' }}>
                  {city.state}
                </p>
                {city.status === 'live' && (
                  <Link
                    to="/reserve"
                    style={{
                      display: 'block',
                      marginTop: '1rem',
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: '0.6rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#c4623a',
                      textDecoration: 'none',
                    }}
                  >
                    Book Now →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* International */}
      <section style={{ padding: '4rem 1.5rem 6rem', backgroundColor: '#e8ede8' }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <p className="section-label">International Expansion</p>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#c2d0c2' }} />
          </div>
          <p className="font-cormorant" style={{ fontSize: '1.1rem', color: '#6a6460', maxWidth: '520px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            BookAirportRide is expanding internationally to serve the world's most-traveled business and luxury destinations.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {INTL_CITIES.map((city) => (
              <div
                key={city.name}
                style={{
                  backgroundColor: '#fdfcfa',
                  border: '1px solid #d4dfd4',
                  borderRadius: '2px',
                  padding: '1.5rem 1.25rem',
                }}
              >
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b0b8b0' }}>
                  Coming Soon
                </span>
                <p className="font-cinzel" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#161210', letterSpacing: '0.04em', marginTop: '0.5rem', marginBottom: '0.2rem' }}>
                  {city.name}
                </p>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#a0a8a0', letterSpacing: '0.06em' }}>
                  {city.country}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#161210', textAlign: 'center' }}>
        <div className="max-w-2xl mx-auto">
          <p className="section-label" style={{ color: '#c4623a', marginBottom: '1rem' }}>Currently Live</p>
          <h2 className="font-cinzel" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 600, color: '#fdfcfa', marginBottom: '1rem' }}>
            Serving Jacksonville, FL Right Now
          </h2>
          <p className="font-cormorant" style={{ fontSize: '1.1rem', color: 'rgba(253,252,250,0.6)', lineHeight: 1.65, marginBottom: '2.5rem' }}>
            Professional black car service serving Jacksonville International Airport (JAX) and all surrounding areas. Available 24/7.
          </p>
          <Link to="/reserve" className="btn-terra" style={{ padding: '0.9rem 2.5rem' }}>
            Reserve in Jacksonville
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
