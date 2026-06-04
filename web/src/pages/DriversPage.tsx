import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  DollarSign,
  Clock,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Car,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';

// ─── Earnings Calculator ──────────────────────────────────────────────────────

const EarningsCalculator: React.FC = () => {
  const [ridesPerWeek, setRidesPerWeek] = useState(20);
  const avgFare = 95;
  const driverShare = 0.8;

  const weeklyGross = ridesPerWeek * avgFare;
  const weeklyNet = weeklyGross * driverShare;
  const monthlyNet = weeklyNet * 4.33;
  const annualNet = weeklyNet * 52;

  return (
    <div className="bg-sea-salt-50 border border-sea-salt-200 p-8">
      <h3 className="font-cinzel text-xl font-medium text-brand-black mb-6">
        Earnings Calculator
      </h3>

      <div className="mb-6">
        <label className="font-josefin text-xs uppercase tracking-wider text-brand-black block mb-3">
          Rides per week: <span className="text-terra-cotta-500">{ridesPerWeek}</span>
        </label>
        <input
          type="range"
          min="5"
          max="60"
          value={ridesPerWeek}
          onChange={(e) => setRidesPerWeek(Number(e.target.value))}
          className="w-full h-1 bg-sea-salt-300 appearance-none cursor-pointer accent-terra-cotta-500"
        />
        <div className="flex justify-between font-josefin text-[10px] text-brand-black-400 mt-1">
          <span>5 rides</span>
          <span>60 rides</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Weekly', value: weeklyNet },
          { label: 'Monthly', value: monthlyNet },
          { label: 'Annual', value: annualNet },
        ].map(({ label, value }) => (
          <div key={label} className="text-center p-4 bg-warm-white border border-sea-salt-200">
            <span className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400 block">
              {label}
            </span>
            <span className="font-cinzel text-2xl font-semibold text-brand-black block mt-1">
              ${Math.round(value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">
        * Based on avg. fare of ${avgFare} • {Math.round(driverShare * 100)}% driver share • Estimates only
      </p>
    </div>
  );
};

// ─── Drivers Page ─────────────────────────────────────────────────────────────

const DriversPage: React.FC = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Earn More, Keep More',
      description:
        'Take home 80% of every fare. With premium pricing across our luxury vehicle classes, top drivers earn $70,000–$120,000+ annually.',
    },
    {
      icon: Clock,
      title: 'Set Your Own Schedule',
      description:
        'You\'re your own boss. Drive when it works for you — mornings, evenings, weekends. Go online and offline with a tap.',
    },
    {
      icon: Shield,
      title: 'Fully Insured & Protected',
      description:
        'Commercial liability coverage is active during every trip. You\'re covered from the moment you accept a booking.',
    },
    {
      icon: Star,
      title: 'Premium Clientele',
      description:
        'Our clients are business travelers, frequent flyers, and families who value quality. Expect respectful, pre-screened passengers.',
    },
    {
      icon: TrendingUp,
      title: 'Weekly Direct Deposits',
      description:
        'Earnings are calculated weekly and deposited directly to your bank account via Stripe Connect — no delays.',
    },
    {
      icon: Calendar,
      title: 'Consistent Demand',
      description:
        'Jacksonville International handles millions of passengers annually. Demand is consistent, predictable, and growing.',
    },
  ];

  const requirements = [
    'Valid Florida driver\'s license (2+ years)',
    'Clean driving record (no major violations in 3 years)',
    'Personal auto insurance (we add commercial coverage)',
    'Background check clearance',
    'Vehicle: 2019 model year or newer',
    'Vehicle: Well-maintained, clean interior',
    'Sedan: Black, Silver, or White only',
    'SUV/Van: Black preferred',
    'Professional appearance and demeanor',
    'Smartphone (iPhone or Android)',
  ];

  return (
    <Layout>
      <Helmet>
        <title>Drive With Us — BookAirportRide</title>
        <meta
          name="description"
          content="Earn top income as a luxury airport transfer chauffeur in Jacksonville. Set your schedule, keep 80% of fares, weekly payouts."
        />
      </Helmet>

      {/* Hero */}
      <section className="section-padding bg-brand-black text-warm-white">
        <div className="container-luxury">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-terra-cotta-500" />
              <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-400">
                Drive With Us
              </span>
            </div>
            <h1 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-semibold text-warm-white mb-6"
              style={{ letterSpacing: '-0.02em' }}>
              Earn More.<br />
              Drive Smarter.
            </h1>
            <p className="font-cormorant text-xl md:text-2xl text-warm-white/70 leading-relaxed mb-10">
              Join Jacksonville's premier luxury airport transportation network. Keep 80% of every fare,
              set your own schedule, and serve premium clients who respect your time.
            </p>
            <Link to="/drivers/apply">
              <Button variant="primary" size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Apply to Drive
              </Button>
            </Link>
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
                Why Drive With Us
              </span>
              <div className="w-8 h-px bg-terra-cotta-500" />
            </div>
            <h2 className="heading-section text-brand-black mb-4">Built for Professional Drivers</h2>
            <p className="body-lg text-brand-black-400 max-w-2xl mx-auto">
              We designed our platform around driver success — because when you thrive, our clients
              experience excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-5">
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

      {/* Earnings Calculator */}
      <section className="section-padding bg-sea-salt-50">
        <div className="container-luxury">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="heading-section text-brand-black mb-4">Estimate Your Earnings</h2>
              <p className="body-lg text-brand-black-400">
                See what you could earn based on your desired hours.
              </p>
            </div>
            <EarningsCalculator />
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-padding bg-warm-white">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-terra-cotta-500" />
                <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-500">
                  Requirements
                </span>
              </div>
              <h2 className="heading-section text-brand-black mb-4">What You Need to Join</h2>
              <p className="body-lg text-brand-black-400 mb-8">
                We maintain a high standard to deliver a premium experience. Here's what we require:
              </p>
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-terra-cotta-500 flex-shrink-0 mt-0.5" />
                    <span className="font-cormorant text-lg text-brand-black-500">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-brand-black p-10 text-warm-white">
              <Car className="h-12 w-12 text-terra-cotta-400 mb-6" />
              <h3 className="font-cinzel text-2xl font-medium text-warm-white mb-4">
                Ready to Apply?
              </h3>
              <p className="font-cormorant text-xl text-warm-white/70 leading-relaxed mb-8">
                The application takes about 10 minutes. We review applications within 3 business days
                and will reach out for next steps including vehicle inspection and orientation.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  '10-minute online application',
                  'Review within 3 business days',
                  'Vehicle inspection + orientation',
                  'Start earning within 1 week',
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="font-cinzel text-lg font-semibold text-terra-cotta-400 w-5 flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span className="font-josefin text-xs uppercase tracking-wider text-warm-white/70">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <Link to="/drivers/apply">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Start Your Application
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DriversPage;
