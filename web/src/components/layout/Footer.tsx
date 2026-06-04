import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { FOOTER_LINKS, SUPPORT_EMAIL, SUPPORT_PHONE, COMPANY_ADDRESS } from '@/constants';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-warm-white">
      {/* Main Footer */}
      <div className="container-luxury py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6 group">
              <span className="font-cinzel text-xl font-semibold text-warm-white group-hover:text-terra-cotta-400 transition-colors duration-200 block">
                BookAirportRide
              </span>
              <span className="font-josefin text-[9px] uppercase tracking-widest text-terra-cotta-400 mt-0.5 block">
                Luxury Airport Transfers
              </span>
            </Link>

            <p className="font-cormorant text-base text-warm-white/70 leading-relaxed mb-6">
              Jacksonville's premier luxury black car airport transportation service. Fixed
              pricing, professional drivers, available 24/7.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="flex items-center gap-2.5 font-josefin text-xs text-warm-white/60 hover:text-terra-cotta-400 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                {SUPPORT_PHONE}
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2.5 font-josefin text-xs text-warm-white/60 hover:text-terra-cotta-400 transition-colors"
              >
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                {SUPPORT_EMAIL}
              </a>
              <span className="flex items-center gap-2.5 font-josefin text-xs text-warm-white/60">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                {COMPANY_ADDRESS}
              </span>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-cinzel text-sm font-medium uppercase tracking-wider text-warm-white mb-6">
              Services
            </h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-josefin text-xs uppercase tracking-wide text-warm-white/60 hover:text-terra-cotta-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-cinzel text-sm font-medium uppercase tracking-wider text-warm-white mb-6">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-josefin text-xs uppercase tracking-wide text-warm-white/60 hover:text-terra-cotta-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Social Column */}
          <div>
            <h3 className="font-cinzel text-sm font-medium uppercase tracking-wider text-warm-white mb-6">
              Legal
            </h3>
            <ul className="flex flex-col gap-3 mb-8">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-josefin text-xs uppercase tracking-wide text-warm-white/60 hover:text-terra-cotta-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <h3 className="font-cinzel text-sm font-medium uppercase tracking-wider text-warm-white mb-4">
              Follow Us
            </h3>
            <div className="flex items-center gap-4">
              {[
                { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-warm-white/40 hover:text-terra-cotta-400 transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-warm-white/10">
        <div className="container-luxury py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-josefin text-[10px] uppercase tracking-widest text-warm-white/40">
            &copy; {currentYear} BookAirportRide. All rights reserved.
          </p>
          <p className="font-josefin text-[10px] uppercase tracking-widest text-warm-white/30">
            Licensed &amp; Insured • Jacksonville, FL
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
