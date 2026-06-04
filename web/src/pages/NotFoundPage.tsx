import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';

const NotFoundPage: React.FC = () => (
  <Layout>
    <Helmet>
      <title>Page Not Found — BookAirportRide</title>
      <meta name="robots" content="noindex" />
    </Helmet>

    <div className="min-h-screen bg-sea-salt-50 flex items-center justify-center py-12">
      <div className="container-luxury">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <span
              className="font-cinzel font-semibold text-sea-salt-200 select-none"
              style={{ fontSize: 'clamp(6rem, 20vw, 12rem)', lineHeight: 1 }}
            >
              404
            </span>
          </div>

          {/* Accent line */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-0.5 bg-terra-cotta-500" />
          </div>

          <h1 className="font-cinzel text-3xl md:text-4xl font-semibold text-brand-black mb-4">
            Page Not Found
          </h1>

          <p className="font-cormorant text-xl text-brand-black-400 leading-relaxed mb-10 max-w-lg mx-auto">
            We couldn't find the page you were looking for. It may have moved, been removed, or
            perhaps you took a wrong turn. Let's get you back on the right road.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button variant="primary" size="lg" leftIcon={<Home className="h-4 w-4" />}>
                Go Home
              </Button>
            </Link>
            <Link to="/book">
              <Button variant="secondary" size="lg" leftIcon={<Search className="h-4 w-4" />}>
                Book a Ride
              </Button>
            </Link>
          </div>

          <div className="mt-10">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 font-josefin text-xs uppercase tracking-wider text-brand-black-400 hover:text-terra-cotta-500 transition-colors mx-auto"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default NotFoundPage;
