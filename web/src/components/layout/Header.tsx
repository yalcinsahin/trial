import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { NAV_LINKS } from '@/constants';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, profile, signOut, isDriver, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const dashboardPath = isAdmin ? '/admin' : isDriver ? '/driver-portal' : '/dashboard';

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-warm-white/95 backdrop-blur-sm border-b border-sea-salt-200 shadow-card'
          : 'bg-warm-white border-b border-sea-salt-200',
      ].join(' ')}
    >
      <div className="container-luxury">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="BookAirportRide Home">
            <div className="flex flex-col leading-none">
              <span className="font-cinzel text-lg font-semibold text-brand-black tracking-wide group-hover:text-terra-cotta-500 transition-colors duration-200">
                BookAirportRide
              </span>
              <span className="font-josefin text-[9px] uppercase tracking-widest text-terra-cotta-500">
                Luxury Airport Transfers
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  [
                    'font-josefin text-xs uppercase tracking-widest transition-colors duration-200',
                    isActive
                      ? 'text-terra-cotta-500'
                      : 'text-brand-black hover:text-terra-cotta-500',
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 font-josefin text-xs uppercase tracking-wider text-brand-black hover:text-terra-cotta-500 transition-colors"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="h-4 w-4" />
                  <span>{profile?.full_name?.split(' ')[0] ?? 'Account'}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-warm-white border border-sea-salt-200 shadow-luxury-lg py-1">
                    <Link
                      to={dashboardPath}
                      className="block px-4 py-2.5 font-josefin text-xs uppercase tracking-wider text-brand-black hover:bg-sea-salt-50 hover:text-terra-cotta-500"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 font-josefin text-xs uppercase tracking-wider text-brand-black hover:bg-sea-salt-50 hover:text-terra-cotta-500"
                    >
                      <LogOut className="h-3 w-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
            )}

            <Link to="/book">
              <Button variant="primary" size="sm">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-brand-black hover:text-terra-cotta-500 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-warm-white border-t border-sea-salt-200 shadow-luxury">
          <nav className="container-luxury py-6 flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  [
                    'font-josefin text-xs uppercase tracking-widest py-3 border-b border-sea-salt-100 transition-colors duration-200',
                    isActive ? 'text-terra-cotta-500' : 'text-brand-black',
                  ].join(' ')
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link to={dashboardPath} onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" size="md" fullWidth>
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="md" fullWidth onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="secondary" size="md" fullWidth>
                    Sign In
                  </Button>
                </Link>
              )}
              <Link to="/book" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" size="md" fullWidth>
                  Book Now
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
