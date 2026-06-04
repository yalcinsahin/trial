import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, ArrowRight, CheckCircle, Plane } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { VEHICLE_CLASSES } from '@/constants';

interface CityData {
  name: string;
  state: string;
  slug: string;
  status: 'live' | 'coming_soon';
  airport: string;
  iata: string;
  headline: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
}

const CITY_DATA: Record<string, CityData> = {
  'jacksonville-fl': {
    name: 'Jacksonville',
    state: 'FL',
    slug: 'jacksonville-fl',
    status: 'live',
    airport: 'Jacksonville International Airport',
    iata: 'JAX',
    headline: "Jacksonville's Premier Airport Transfer",
    description:
      'BookAirportRide provides luxury black car airport transportation throughout Jacksonville, FL and surrounding areas including Ponte Vedra, St. Augustine, Orange Park, Fleming Island, and Fernandina Beach. Professional chauffeurs, fixed pricing, 24/7 availability.',
    metaTitle: 'Luxury Airport Transfer Jacksonville FL | BookAirportRide',
    metaDescription:
      'Premium black car airport transportation in Jacksonville, FL. Fixed pricing, professional drivers, real-time flight tracking. Book your JAX airport transfer today.',
  },
  'miami-fl': {
    name: 'Miami',
    state: 'FL',
    slug: 'miami-fl',
    status: 'coming_soon',
    airport: 'Miami International Airport',
    iata: 'MIA',
    headline: 'Miami Airport Transfers — Coming Soon',
    description:
      'BookAirportRide is expanding to Miami, FL. We will offer the same luxury black car airport transportation service serving MIA and FLL airports. Register your interest to be notified when we launch.',
    metaTitle: 'Luxury Airport Transfer Miami FL | BookAirportRide (Coming Soon)',
    metaDescription:
      'Premium black car airport transportation in Miami, FL — coming soon. Serving MIA and FLL airports. Register your interest today.',
  },
};

const CityPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? CITY_DATA[slug] : null;

  if (!city) {
    return <Navigate to="/cities" replace />;
  }

  const isLive = city.status === 'live';

  return (
    <Layout>
      <Helmet>
        <title>{city.metaTitle}</title>
        <meta name="description" content={city.metaDescription} />
        <meta property="og:title" content={city.metaTitle} />
        <meta property="og:description" content={city.metaDescription} />
        {isLive ? (
          <link rel="canonical" href={`https://bookairportride.com/cities/${city.slug}`} />
        ) : (
          <meta name="robots" content="noindex" />
        )}
      </Helmet>

      {/* Hero */}
      <section className="section-padding bg-brand-black text-warm-white">
        <div className="container-luxury">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-terra-cotta-500" />
              <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-400 flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                {city.name}, {city.state}
              </span>
            </div>
            <h1 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-semibold text-warm-white mb-6"
              style={{ letterSpacing: '-0.02em' }}>
              {city.headline}
            </h1>
            <p className="font-cormorant text-xl text-warm-white/70 leading-relaxed mb-8">
              {city.description}
            </p>
            <div className="flex items-center gap-3 mb-8">
              <Plane className="h-4 w-4 text-terra-cotta-400" />
              <span className="font-josefin text-xs uppercase tracking-wider text-warm-white/60">
                Serving {city.airport} ({city.iata})
              </span>
            </div>
            {isLive ? (
              <Link to="/book">
                <Button variant="primary" size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Book Your Transfer
                </Button>
              </Link>
            ) : (
              <Button variant="secondary" size="xl" className="!border-warm-white/30 !text-warm-white" disabled>
                Coming Soon — Register Interest
              </Button>
            )}
          </div>
        </div>
      </section>

      {isLive && (
        <>
          {/* Vehicle Classes */}
          <section className="section-padding bg-sea-salt-50">
            <div className="container-luxury">
              <div className="text-center mb-12">
                <h2 className="heading-section text-brand-black mb-4">
                  Our Fleet in {city.name}
                </h2>
                <p className="body-lg text-brand-black-400 max-w-2xl mx-auto">
                  Every vehicle is immaculately maintained and driven by a licensed, background-checked
                  professional.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {VEHICLE_CLASSES.map((vehicle) => (
                  <div key={vehicle.id} className="bg-warm-white border border-sea-salt-200 p-6">
                    <h3 className="font-cinzel text-base font-medium text-brand-black mb-2">
                      {vehicle.name}
                    </h3>
                    <p className="font-cormorant text-base text-brand-black-400 mb-4 leading-relaxed">
                      {vehicle.description}
                    </p>
                    <ul className="space-y-1.5">
                      {vehicle.amenities.slice(0, 3).map((a) => (
                        <li key={a} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-terra-cotta-500" />
                          <span className="font-josefin text-[10px] uppercase tracking-wide text-brand-black-400">
                            {a}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Service Area */}
          <section className="section-padding bg-warm-white">
            <div className="container-luxury">
              <div className="max-w-3xl mx-auto">
                <h2 className="heading-section text-brand-black mb-6">
                  {city.name} Service Area
                </h2>
                <p className="body-lg text-brand-black-400 mb-8">
                  We serve all of Northeast Florida including the greater Jacksonville metropolitan area.
                  No location is too far — we specialize in fixed-rate transfers to and from
                  {' '}{city.airport} ({city.iata}).
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    'Downtown Jacksonville', 'Ponte Vedra Beach', 'St. Augustine',
                    'Orange Park', 'Fleming Island', 'Fernandina Beach',
                    'Atlantic Beach', 'Neptune Beach', 'Jacksonville Beach',
                    'Amelia Island', 'Middleburg', 'Green Cove Springs',
                  ].map((area) => (
                    <div
                      key={area}
                      className="flex items-center gap-2 py-2 px-3 bg-sea-salt-50 border border-sea-salt-200"
                    >
                      <MapPin className="h-3 w-3 text-terra-cotta-500 flex-shrink-0" />
                      <span className="font-josefin text-[10px] uppercase tracking-wide text-brand-black-500">
                        {area}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-brand-black text-warm-white text-center">
            <div className="container-luxury">
              <h2 className="font-cinzel text-3xl font-semibold text-warm-white mb-4">
                Book Your {city.name} Airport Transfer
              </h2>
              <p className="font-cormorant text-xl text-warm-white/60 mb-8 max-w-xl mx-auto">
                Fixed pricing, instant confirmation, professional chauffeurs. Ready when you are.
              </p>
              <Link to="/book">
                <Button variant="primary" size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Reserve Your Ride
                </Button>
              </Link>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
};

export default CityPage;
