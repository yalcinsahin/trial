import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Cities', href: '/cities' },
  { label: 'Drive With Us', href: '/drive-with-us' },
  { label: 'Travel Partners', href: '/travel-partners' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: transparent ? 'transparent' : '#161210',
          borderBottom: transparent ? 'none' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="font-cinzel text-warm-white no-underline"
            style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.12em', color: '#fdfcfa', textDecoration: 'none' }}
          >
            BookAirportRide
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: location.pathname === link.href ? '#c4623a' : '#fdfcfa',
                  textDecoration: 'none',
                  opacity: location.pathname === link.href ? 1 : 0.85,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link to="/reserve" className="btn-terra hidden sm:inline-block" style={{ padding: '0.55rem 1.4rem', fontSize: '0.7rem' }}>
              Reserve Now
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden"
              style={{ color: '#fdfcfa', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: '280px',
          backgroundColor: '#161210',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <span className="font-cinzel" style={{ color: '#fdfcfa', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em' }}>
            BookAirportRide
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ color: '#fdfcfa', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-6 gap-6 flex-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              style={{
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: location.pathname === link.href ? '#c4623a' : '#fdfcfa',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-6">
          <Link to="/reserve" className="btn-terra" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
            Reserve Now
          </Link>
        </div>
      </div>
    </>
  );
}
