import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, ArrowRight, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { City } from '@/types';

const CITIES: (Omit<City, 'id' | 'created_at' | 'updated_at'> & { airports: string[] })[] = [
  {
    name: 'Jacksonville',
    state: 'FL',
    slug: 'jacksonville-fl',
    status: 'live',
    timezone: 'America/New_York',
    airports: ['Jacksonville International (JAX)'],
    meta_title: 'Luxury Airport Transfer Jacksonville FL',
    meta_description: 'Premium black car airport transportation in Jacksonville, FL. Fixed pricing, professional drivers, flight tracking.',
  },
  {
    name: 'Miami',
    state: 'FL',
    slug: 'miami-fl',
    status: 'coming_soon',
    timezone: 'America/New_York',
    airports: ['Miami International (MIA)', 'Fort Lauderdale-Hollywood (FLL)'],
    meta_title: null,
    meta_description: null,
  },
  {
    name: 'Orlando',
    state: 'FL',
    slug: 'orlando-fl',
    status: 'coming_soon',
    timezone: 'America/New_York',
    airports: ['Orlando International (MCO)', 'Orlando Sanford (SFB)'],
    meta_title: null,
    meta_description: null,
  },
  {
    name: 'Atlanta',
    state: 'GA',
    slug: 'atlanta-ga',
    status: 'coming_soon',
    timezone: 'America/New_York',
    airports: ['Hartsfield-Jackson Atlanta International (ATL)'],
    meta_title: null,
    meta_description: null,
  },
  {
    name: 'Charlotte',
    state: 'NC',
    slug: 'charlotte-nc',
    status: 'coming_soon',
    timezone: 'America/New_York',
    airports: ['Charlotte Douglas International (CLT)'],
    meta_title: null,
    meta_description: null,
  },
];

const CitiesPage: React.FC = () => (
  <Layout>
    <Helmet>
      <title>Service Areas — BookAirportRide</title>
      <meta
        name="description"
        content="BookAirportRide luxury airport transportation service areas. Currently serving Jacksonville, FL. Coming soon to Miami, Orlando, Atlanta, and Charlotte."
      />
    </Helmet>

    {/* Hero */}
    <section className="section-padding bg-sea-salt-50 border-b border-sea-salt-200">
      <div className="container-luxury text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-px bg-terra-cotta-500" />
          <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-500">
            Coverage
          </span>
          <div className="w-8 h-px bg-terra-cotta-500" />
        </div>
        <h1 className="font-cinzel text-4xl md:text-5xl font-semibold text-brand-black mb-4"
          style={{ letterSpacing: '-0.02em' }}>
          Service Areas
        </h1>
        <p className="font-cormorant text-xl text-brand-black-400 max-w-2xl mx-auto">
          Starting in Jacksonville and expanding rapidly across the Southeast. More cities are
          being added regularly.
        </p>
      </div>
    </section>

    {/* Live Cities */}
    <section className="section-padding bg-warm-white">
      <div className="container-luxury">
        <h2 className="font-cinzel text-2xl font-medium text-brand-black mb-8 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-terra-cotta-500 animate-pulse" />
          Available Now
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {CITIES.filter((c) => c.status === 'live').map((city) => (
            <div
              key={city.slug}
              className="border-2 border-terra-cotta-500 bg-warm-white p-8 hover:shadow-luxury-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-cinzel text-2xl font-medium text-brand-black">
                    {city.name}
                  </h3>
                  <p className="font-josefin text-xs uppercase tracking-wider text-brand-black-400 mt-1">
                    {city.state}
                  </p>
                </div>
                <Badge variant="success">Live</Badge>
              </div>

              <div className="flex items-start gap-2 mb-6">
                <MapPin className="h-4 w-4 text-terra-cotta-500 flex-shrink-0 mt-0.5" />
                <div>
                  {city.airports.map((airport) => (
                    <p key={airport} className="font-cormorant text-lg text-brand-black-500">
                      {airport}
                    </p>
                  ))}
                </div>
              </div>

              <Link to={`/cities/${city.slug}`}>
                <Button variant="primary" size="md" fullWidth rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Book in {city.name}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <h2 className="font-cinzel text-2xl font-medium text-brand-black mb-8 flex items-center gap-3">
          <Clock className="h-5 w-5 text-brand-black-400" />
          Coming Soon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CITIES.filter((c) => c.status === 'coming_soon').map((city) => (
            <div
              key={city.slug}
              className="border border-sea-salt-200 bg-warm-white p-8 opacity-75"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-cinzel text-2xl font-medium text-brand-black">
                    {city.name}
                  </h3>
                  <p className="font-josefin text-xs uppercase tracking-wider text-brand-black-400 mt-1">
                    {city.state}
                  </p>
                </div>
                <Badge variant="warning">Coming Soon</Badge>
              </div>

              <div className="flex items-start gap-2 mb-6">
                <MapPin className="h-4 w-4 text-brand-black-300 flex-shrink-0 mt-0.5" />
                <div>
                  {city.airports.map((airport) => (
                    <p key={airport} className="font-cormorant text-lg text-brand-black-400">
                      {airport}
                    </p>
                  ))}
                </div>
              </div>

              <Button variant="secondary" size="md" fullWidth disabled>
                Notify Me When Live
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Expansion Interest */}
    <section className="py-16 bg-sea-salt-50 border-t border-sea-salt-200">
      <div className="container-luxury text-center">
        <h2 className="font-cinzel text-2xl font-medium text-brand-black mb-4">
          Don't See Your City?
        </h2>
        <p className="font-cormorant text-xl text-brand-black-400 max-w-xl mx-auto mb-8">
          We're actively expanding. Let us know where you need service and we'll prioritize
          markets with the most demand.
        </p>
        <Button variant="primary" size="lg">
          Request a City
        </Button>
      </div>
    </section>
  </Layout>
);

export default CitiesPage;
