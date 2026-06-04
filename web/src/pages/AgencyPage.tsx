import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DollarSign, Users, BarChart2, Headphones, ArrowRight, CheckCircle, Building } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { AGENCY_COMMISSION_PERCENTAGE } from '@/constants';

const AgencyPage: React.FC = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: `${AGENCY_COMMISSION_PERCENTAGE * 100}% Commission`,
      description:
        'Earn a competitive commission on every booking you refer. Commissions are tracked automatically and paid monthly.',
    },
    {
      icon: Users,
      title: 'Dedicated Account Manager',
      description:
        'Every agency partner receives a dedicated contact for white-glove support, special requests, and escalations.',
    },
    {
      icon: BarChart2,
      title: 'Real-Time Reporting',
      description:
        'Access your partner portal to view bookings, commissions earned, and monthly statements 24/7.',
    },
    {
      icon: Headphones,
      title: 'Priority Support',
      description:
        'Your clients get priority booking confirmation and a dedicated support line for day-of issues.',
    },
    {
      icon: Building,
      title: 'Co-Marketing Opportunities',
      description:
        'Approved partners are featured in our agency directory and eligible for co-branded materials.',
    },
    {
      icon: CheckCircle,
      title: 'Fixed, Transparent Pricing',
      description:
        'Quote clients confidently with our fixed-rate pricing. No surprises, no surge pricing, ever.',
    },
  ];

  const partnerTypes = [
    { type: 'Travel Agencies', description: 'Add luxury ground transportation to your service offering' },
    { type: 'Corporate Travel Managers', description: 'Reliable, invoiceable airport transfers for your executives' },
    { type: 'Hotels & Concierges', description: 'Offer seamless airport arrival experiences to your guests' },
    { type: 'Event Planners', description: 'Ground transportation solutions for conferences and events' },
    { type: 'Insurance Adjusters', description: 'Temporary transportation solutions for clients in need' },
    { type: 'Luxury Vacation Planners', description: 'Complete the premium experience with luxury airport transfers' },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Agency & Affiliate Partnership — BookAirportRide</title>
        <meta
          name="description"
          content="Partner with BookAirportRide and earn commission on every luxury airport transfer you refer. Travel agencies, hotels, and corporate partners welcome."
        />
      </Helmet>

      {/* Hero */}
      <section className="section-padding bg-brand-black text-warm-white">
        <div className="container-luxury">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-terra-cotta-500" />
              <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-400">
                Agency Partnerships
              </span>
            </div>
            <h1 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-semibold text-warm-white mb-6"
              style={{ letterSpacing: '-0.02em' }}>
              Earn While Your<br />
              <span className="text-terra-cotta-400">Clients Ride</span>
            </h1>
            <p className="font-cormorant text-xl md:text-2xl text-warm-white/70 leading-relaxed mb-10">
              Partner with BookAirportRide and earn {AGENCY_COMMISSION_PERCENTAGE * 100}% commission on every luxury airport
              transfer you book for your clients. No upfront costs, no minimum volumes.
            </p>
            <Link to="/agencies/apply">
              <Button variant="primary" size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Commission Highlight */}
      <section className="py-12 bg-terra-cotta-500">
        <div className="container-luxury">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-josefin text-xs uppercase tracking-widest text-warm-white/70">Commission Rate</span>
              <p className="font-cinzel text-5xl font-semibold text-warm-white mt-1">5%</p>
              <p className="font-cormorant text-xl text-warm-white/80">on every booking you refer</p>
            </div>
            <div className="hidden md:block w-px h-20 bg-warm-white/20" />
            <div>
              <span className="font-josefin text-xs uppercase tracking-widest text-warm-white/70">Payout Frequency</span>
              <p className="font-cinzel text-5xl font-semibold text-warm-white mt-1">Monthly</p>
              <p className="font-cormorant text-xl text-warm-white/80">direct deposit via Stripe</p>
            </div>
            <div className="hidden md:block w-px h-20 bg-warm-white/20" />
            <div>
              <span className="font-josefin text-xs uppercase tracking-widest text-warm-white/70">Setup Cost</span>
              <p className="font-cinzel text-5xl font-semibold text-warm-white mt-1">$0</p>
              <p className="font-cormorant text-xl text-warm-white/80">completely free to join</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-warm-white">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-terra-cotta-500" />
              <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-500">
                Partner Benefits
              </span>
              <div className="w-8 h-px bg-terra-cotta-500" />
            </div>
            <h2 className="heading-section text-brand-black mb-4">Everything You Need</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-5 p-6 border border-sea-salt-200">
                <div className="flex-shrink-0 w-12 h-12 bg-sea-salt-100 flex items-center justify-center">
                  <benefit.icon className="h-5 w-5 text-terra-cotta-500" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-medium text-brand-black mb-2">
                    {benefit.title}
                  </h3>
                  <p className="font-cormorant text-lg text-brand-black-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Partner */}
      <section className="section-padding bg-sea-salt-50">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <h2 className="heading-section text-brand-black mb-4">Who We Partner With</h2>
            <p className="body-lg text-brand-black-400 max-w-2xl mx-auto">
              Our partnership program is open to any business that regularly arranges transportation
              for clients.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partnerTypes.map(({ type, description }) => (
              <div key={type} className="bg-warm-white border border-sea-salt-200 p-6">
                <h3 className="font-cinzel text-base font-medium text-brand-black mb-2">{type}</h3>
                <p className="font-cormorant text-lg text-brand-black-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-black text-warm-white text-center">
        <div className="container-luxury">
          <h2 className="heading-section text-warm-white mb-4">Ready to Partner?</h2>
          <p className="body-lg text-warm-white/60 max-w-xl mx-auto mb-8">
            Complete the short application and our partnerships team will reach out within 2 business days.
          </p>
          <Link to="/agencies/apply">
            <Button variant="primary" size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Apply for Partnership
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default AgencyPage;
