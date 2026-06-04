import { Link } from 'react-router-dom';
// Social icons as inline SVGs since lucide-react doesn't include brand icons
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#161210', color: '#fdfcfa' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company */}
          <div>
            <p className="font-cinzel mb-4" style={{ fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.1em', color: '#fdfcfa' }}>
              BookAirportRide
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'rgba(253,252,250,0.65)', lineHeight: '1.7' }}>
              Premium black car airport transportation. Professional drivers. Fixed pricing. Available 24/7.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                style={{ color: 'rgba(253,252,250,0.6)', transition: 'color 0.2s ease' }}
                onMouseOver={e => (e.currentTarget.style.color = '#c4623a')}
                onMouseOut={e => (e.currentTarget.style.color = 'rgba(253,252,250,0.6)')}
              >
                <InstagramIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                style={{ color: 'rgba(253,252,250,0.6)', transition: 'color 0.2s ease' }}
                onMouseOver={e => (e.currentTarget.style.color = '#c4623a')}
                onMouseOut={e => (e.currentTarget.style.color = 'rgba(253,252,250,0.6)')}
              >
                <FacebookIcon />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                style={{ color: 'rgba(253,252,250,0.6)', transition: 'color 0.2s ease' }}
                onMouseOver={e => (e.currentTarget.style.color = '#c4623a')}
                onMouseOut={e => (e.currentTarget.style.color = 'rgba(253,252,250,0.6)')}
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="section-label mb-4" style={{ color: '#c4623a' }}>Services</p>
            {['Airport Transfers', 'Corporate Rides', 'Event Transportation', 'Hourly Charter', 'Long Distance'].map(s => (
              <Link
                key={s}
                to="/services"
                style={{
                  display: 'block',
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  color: 'rgba(253,252,250,0.6)',
                  textDecoration: 'none',
                  marginBottom: '0.6rem',
                  transition: 'color 0.2s ease',
                }}
                onMouseOver={e => (e.currentTarget.style.color = '#fdfcfa')}
                onMouseOut={e => (e.currentTarget.style.color = 'rgba(253,252,250,0.6)')}
              >
                {s}
              </Link>
            ))}
          </div>

          {/* Cities */}
          <div>
            <p className="section-label mb-4" style={{ color: '#c4623a' }}>Cities</p>
            {['Jacksonville, FL', 'Miami, FL', 'Orlando, FL', 'Atlanta, GA', 'New York, NY', 'Los Angeles, CA'].map(c => (
              <Link
                key={c}
                to="/cities"
                style={{
                  display: 'block',
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  color: 'rgba(253,252,250,0.6)',
                  textDecoration: 'none',
                  marginBottom: '0.6rem',
                  transition: 'color 0.2s ease',
                }}
                onMouseOver={e => (e.currentTarget.style.color = '#fdfcfa')}
                onMouseOut={e => (e.currentTarget.style.color = 'rgba(253,252,250,0.6)')}
              >
                {c}
              </Link>
            ))}
          </div>

          {/* Partners */}
          <div>
            <p className="section-label mb-4" style={{ color: '#c4623a' }}>Partners</p>
            {[
              { label: 'Drive With Us', to: '/drive-with-us' },
              { label: 'Travel Agency Partners', to: '/travel-partners' },
              { label: 'About BookAirportRide', to: '/about' },
              { label: 'Contact Us', to: '/about' },
            ].map(item => (
              <Link
                key={item.label}
                to={item.to}
                style={{
                  display: 'block',
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  color: 'rgba(253,252,250,0.6)',
                  textDecoration: 'none',
                  marginBottom: '0.6rem',
                  transition: 'color 0.2s ease',
                }}
                onMouseOver={e => (e.currentTarget.style.color = '#fdfcfa')}
                onMouseOut={e => (e.currentTarget.style.color = 'rgba(253,252,250,0.6)')}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.08em', color: 'rgba(253,252,250,0.4)' }}>
            © {new Date().getFullYear()} BookAirportRide. All rights reserved. Jacksonville, FL.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Terms of Service', to: '/terms' },
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Cancellation Policy', to: '/cancellation' },
            ].map(item => (
              <Link
                key={item.label}
                to={item.to}
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  color: 'rgba(253,252,250,0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseOver={e => (e.currentTarget.style.color = '#fdfcfa')}
                onMouseOut={e => (e.currentTarget.style.color = 'rgba(253,252,250,0.4)')}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
