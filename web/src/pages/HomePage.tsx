import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Headphones,
  MapPin,
  Star,
  ChevronRight,
  Plane,
  Car,
  Users,
  Briefcase,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { VEHICLE_CLASSES } from '@/constants';

// ─── Hero Section ─────────────────────────────────────────────────────────────

const HeroSection: React.FC = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black">
    {/* Background Image Simulation */}
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 bg-gradient-luxury opacity-90"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 50%, rgba(196,98,58,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(196,98,58,0.05) 0%, transparent 50%)',
        }}
      />
      {/* Decorative lines */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 80px, rgba(255,255,255,0.05) 80px, transparent 81px)',
        }}
      />
    </div>

    {/* Diagonal accent */}
    <div className="absolute right-0 top-0 w-1/3 h-full opacity-10"
      style={{
        background: 'linear-gradient(135deg, transparent 0%, rgba(196,98,58,0.3) 100%)',
        clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
      }}
    />

    <div className="container-luxury relative z-10 text-center lg:text-left py-32">
      <div className="max-w-3xl">
        {/* Eyebrow */}
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
          <div className="w-10 h-px bg-terra-cotta-500" />
          <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-400">
            Jacksonville, Florida
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-cinzel text-5xl md:text-6xl lg:text-7xl font-semibold text-warm-white leading-tight mb-6"
          style={{ letterSpacing: '-0.02em' }}
        >
          Jacksonville's
          <br />
          <span className="text-terra-cotta-400">Premier</span> Airport
          <br />
          Transfer
        </h1>

        {/* Subtext */}
        <p className="font-cormorant text-xl md:text-2xl text-warm-white/70 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
          Luxury black car service with fixed pricing, professional chauffeurs, and
          real-time flight tracking. Arrive in style, every time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <Link to="/book">
            <Button variant="primary" size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Book Now
            </Button>
          </Link>
          <Link to="/cities">
            <Button
              variant="secondary"
              size="xl"
              className="!border-warm-white/30 !text-warm-white hover:!bg-warm-white hover:!text-brand-black"
            >
              Learn More
            </Button>
          </Link>
        </div>

        {/* Trust signals */}
        <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6">
          {[
            { label: 'Fixed Pricing', icon: CheckCircle },
            { label: 'Flight Tracked', icon: Plane },
            { label: '24/7 Service', icon: Clock },
          ].map(({ label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-terra-cotta-400" />
              <span className="font-josefin text-xs uppercase tracking-wider text-warm-white/60">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
      <span className="font-josefin text-[9px] uppercase tracking-widest text-warm-white">
        Scroll
      </span>
      <div className="w-px h-8 bg-warm-white/50 animate-pulse" />
    </div>
  </section>
);

// ─── How It Works ─────────────────────────────────────────────────────────────

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Book Online',
      description:
        'Enter your pickup location, destination, date, and flight details. Choose your preferred vehicle class and receive an instant fixed price quote.',
      icon: Car,
    },
    {
      number: '02',
      title: 'We Confirm',
      description:
        'Receive instant booking confirmation via email and SMS. We monitor your flight in real-time and assign a professional chauffeur to your reservation.',
      icon: CheckCircle,
    },
    {
      number: '03',
      title: 'Arrive in Style',
      description:
        'Your driver meets you at arrivals with a name sign. Relax in a luxury vehicle while we handle the rest. No surprises, just a seamless journey.',
      icon: Star,
    },
  ];

  return (
    <section className="section-padding bg-warm-white">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-terra-cotta-500" />
            <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-500">
              Simple Process
            </span>
            <div className="w-8 h-px bg-terra-cotta-500" />
          </div>
          <h2 className="heading-section text-brand-black mb-4">How It Works</h2>
          <p className="body-lg text-brand-black-400 max-w-2xl mx-auto">
            Three effortless steps to your next luxury airport transfer.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-sea-salt-200 z-0" />
              )}

              <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                {/* Step number + icon */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-sea-salt-100 flex items-center justify-center relative">
                    <step.icon className="h-7 w-7 text-terra-cotta-500" />
                    <span className="absolute -top-2 -right-2 font-cinzel text-xs font-semibold text-terra-cotta-500 bg-warm-white border border-terra-cotta-200 w-6 h-6 flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3 className="font-cinzel text-xl font-medium text-brand-black mb-3">
                  {step.title}
                </h3>
                <p className="font-cormorant text-lg text-brand-black-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Vehicle Classes ──────────────────────────────────────────────────────────

const VehicleClassesSection: React.FC = () => {
  const prices: Record<string, number> = {
    standard_sedan: 65,
    business_sedan: 95,
    first_class_suv: 145,
    luxury_van: 195,
  };

  return (
    <section className="section-padding bg-sea-salt-50">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-terra-cotta-500" />
            <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-500">
              Fleet
            </span>
            <div className="w-8 h-px bg-terra-cotta-500" />
          </div>
          <h2 className="heading-section text-brand-black mb-4">Choose Your Vehicle</h2>
          <p className="body-lg text-brand-black-400 max-w-2xl mx-auto">
            Every vehicle in our fleet is immaculately maintained, late-model, and driven by a
            licensed, background-checked chauffeur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VEHICLE_CLASSES.map((vehicle) => (
            <div
              key={vehicle.id}
              className="group bg-warm-white border border-sea-salt-200 hover:border-terra-cotta-300 transition-all duration-300 hover:shadow-luxury"
            >
              {/* Vehicle image placeholder */}
              <div className="aspect-[4/3] bg-sea-salt-100 flex items-center justify-center overflow-hidden">
                <Car className="h-16 w-16 text-sea-salt-300 group-hover:text-terra-cotta-300 transition-colors duration-300" />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-cinzel text-lg font-medium text-brand-black">
                    {vehicle.name}
                  </h3>
                </div>

                <p className="font-cormorant text-base text-brand-black-400 leading-relaxed mb-4">
                  {vehicle.description}
                </p>

                {/* Capacity */}
                <div className="flex items-center gap-4 mb-4 text-brand-black-400">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-josefin text-xs">{vehicle.capacity} pax</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span className="font-josefin text-xs">{vehicle.luggage} bags</span>
                  </div>
                </div>

                {/* Amenities */}
                <ul className="flex flex-col gap-1.5 mb-6">
                  {vehicle.amenities.slice(0, 3).map((amenity) => (
                    <li key={amenity} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-terra-cotta-500 flex-shrink-0" />
                      <span className="font-josefin text-[10px] uppercase tracking-wide text-brand-black-400">
                        {amenity}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-sea-salt-200">
                  <div>
                    <span className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400">
                      From
                    </span>
                    <p className="font-cinzel text-2xl font-semibold text-brand-black">
                      ${prices[vehicle.id]}
                    </p>
                  </div>
                  <Link to="/book">
                    <Button variant="primary" size="sm" rightIcon={<ChevronRight className="h-3 w-3" />}>
                      Book
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Why Choose Us ────────────────────────────────────────────────────────────

const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      icon: Plane,
      title: 'Real-Time Flight Tracking',
      description:
        'We monitor your flight status and adjust your pickup time automatically, so you never wait and we\'re never late.',
    },
    {
      icon: Shield,
      title: 'Fixed, Transparent Pricing',
      description:
        'No surge pricing. No hidden fees. Your quoted price is exactly what you pay. Always.',
    },
    {
      icon: Star,
      title: 'Professional Chauffeurs',
      description:
        'Every driver is licensed, fully insured, background-checked, and trained to deliver exceptional hospitality.',
    },
    {
      icon: Headphones,
      title: '24/7 Live Support',
      description:
        'Our operations team is available around the clock via phone and chat for any changes, questions, or special needs.',
    },
    {
      icon: MapPin,
      title: 'Meet & Greet Service',
      description:
        'Your driver will be waiting at baggage claim with your name sign — never hunt for your ride at the airport again.',
    },
    {
      icon: Clock,
      title: 'On-Time Guarantee',
      description:
        'We dispatch early and plan for traffic. Our on-time record exceeds 98% across thousands of completed transfers.',
    },
  ];

  return (
    <section className="section-padding bg-brand-black text-warm-white">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-terra-cotta-500" />
            <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-400">
              Why BookAirportRide
            </span>
            <div className="w-8 h-px bg-terra-cotta-500" />
          </div>
          <h2 className="heading-section text-warm-white mb-4">The Standard Others Aspire To</h2>
          <p className="body-lg text-warm-white/60 max-w-2xl mx-auto">
            When you book with us, you're not just booking a car. You're booking peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex gap-5 p-6 border border-warm-white/10 hover:border-terra-cotta-500/40 transition-colors duration-300"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-terra-cotta-500/10 flex items-center justify-center group-hover:bg-terra-cotta-500/20 transition-colors duration-300">
                  <feature.icon className="h-5 w-5 text-terra-cotta-400" />
                </div>
              </div>
              <div>
                <h3 className="font-cinzel text-base font-medium text-warm-white mb-2">
                  {feature.title}
                </h3>
                <p className="font-cormorant text-base text-warm-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Service Areas ────────────────────────────────────────────────────────────

const ServiceAreasSection: React.FC = () => {
  const cities = [
    { name: 'Jacksonville, FL', status: 'live' as const },
    { name: 'Miami, FL', status: 'coming_soon' as const },
    { name: 'Orlando, FL', status: 'coming_soon' as const },
    { name: 'Atlanta, GA', status: 'coming_soon' as const },
    { name: 'Charlotte, NC', status: 'coming_soon' as const },
  ];

  return (
    <section className="section-padding bg-warm-white">
      <div className="container-luxury">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-terra-cotta-500" />
            <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-500">
              Coverage
            </span>
            <div className="w-8 h-px bg-terra-cotta-500" />
          </div>
          <h2 className="heading-section text-brand-black mb-4">Service Areas</h2>
          <p className="body-lg text-brand-black-400 mb-10">
            Currently serving Jacksonville, Florida — with rapid expansion underway across the
            Southeast.
          </p>

          {/* City Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {cities.map((city) => (
              <div
                key={city.name}
                className={[
                  'flex items-center gap-2 px-4 py-2 border font-josefin text-xs uppercase tracking-wider',
                  city.status === 'live'
                    ? 'bg-terra-cotta-500 border-terra-cotta-500 text-warm-white'
                    : 'bg-warm-white border-sea-salt-300 text-brand-black-400',
                ].join(' ')}
              >
                <MapPin className="h-3 w-3" />
                {city.name}
                {city.status === 'live' && (
                  <span className="ml-1 w-1.5 h-1.5 rounded-full bg-warm-white animate-pulse" />
                )}
              </div>
            ))}
          </div>

          <Link to="/cities">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              View All Service Areas
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'I travel for business weekly and BookAirportRide has become my non-negotiable. The driver was waiting, the car was immaculate, and the price was exactly as quoted. Nothing like the rideshare chaos I used to deal with.',
      name: 'Marcus T.',
      role: 'VP of Sales, Jacksonville',
      rating: 5,
    },
    {
      quote:
        'Flying into JAX with three kids and six bags. Our driver had a luxury van waiting, helped with everything, and even had the car seats we requested. Truly exceptional service.',
      name: 'Sarah M.',
      role: 'Frequent Traveler, Jacksonville',
      rating: 5,
    },
    {
      quote:
        "As a travel agent, I recommend BookAirportRide to all my clients. The professionalism is unmatched and I've never received a single complaint. The fixed pricing makes budgeting easy.",
      name: 'Jennifer R.',
      role: 'Travel Agent, Northeast Florida',
      rating: 5,
    },
  ];

  return (
    <section className="section-padding bg-sea-salt-50">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-terra-cotta-500" />
            <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-500">
              Testimonials
            </span>
            <div className="w-8 h-px bg-terra-cotta-500" />
          </div>
          <h2 className="heading-section text-brand-black mb-4">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-warm-white border border-sea-salt-200 p-8 shadow-card"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-terra-cotta-500 text-terra-cotta-500" />
                ))}
              </div>

              {/* Quote mark */}
              <div className="font-cinzel text-5xl text-terra-cotta-200 leading-none mb-2 select-none">
                "
              </div>

              <blockquote className="font-cormorant text-lg text-brand-black-500 leading-relaxed mb-6 italic">
                {testimonial.quote}
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-sea-salt-200">
                <div className="w-10 h-10 bg-sea-salt-100 flex items-center justify-center">
                  <span className="font-cinzel text-sm font-medium text-brand-black">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-josefin text-xs font-medium text-brand-black uppercase tracking-wider">
                    {testimonial.name}
                  </p>
                  <p className="font-josefin text-[10px] text-brand-black-400 uppercase tracking-wide">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CTA Banner ───────────────────────────────────────────────────────────────

const CTABannerSection: React.FC = () => (
  <section className="py-20 lg:py-24 bg-brand-black relative overflow-hidden">
    {/* Decorative background */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 70% 50%, rgba(196,98,58,0.4) 0%, transparent 60%)',
      }}
    />

    <div className="container-luxury relative z-10 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-8 h-px bg-terra-cotta-500" />
        <span className="font-josefin text-[10px] uppercase tracking-[0.3em] text-terra-cotta-400">
          Ready?
        </span>
        <div className="w-8 h-px bg-terra-cotta-500" />
      </div>

      <h2 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-semibold text-warm-white mb-6"
        style={{ letterSpacing: '-0.02em' }}
      >
        Ready to Ride in Style?
      </h2>

      <p className="font-cormorant text-xl md:text-2xl text-warm-white/60 mb-10 max-w-xl mx-auto">
        Book your next Jacksonville airport transfer in under 3 minutes.
        Fixed price, no surprises.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/book">
          <Button variant="primary" size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
            Book Your Transfer
          </Button>
        </Link>
        <Link to="/track">
          <Button
            variant="secondary"
            size="xl"
            className="!border-warm-white/30 !text-warm-white hover:!bg-warm-white hover:!text-brand-black"
          >
            Track a Ride
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

// ─── Home Page ────────────────────────────────────────────────────────────────

const HomePage: React.FC = () => (
  <Layout hideHeader={false}>
    <Helmet>
      <title>BookAirportRide — Luxury Airport Transfers in Jacksonville, FL</title>
      <meta
        name="description"
        content="Jacksonville's premier luxury black car airport transportation. Fixed pricing, professional drivers, flight tracking. Book your JAX airport transfer today."
      />
    </Helmet>

    {/* Remove default pt-16 for hero since it's full-viewport */}
    <div className="-mt-16 lg:-mt-20">
      <HeroSection />
    </div>

    <HowItWorksSection />
    <VehicleClassesSection />
    <WhyChooseUsSection />
    <ServiceAreasSection />
    <TestimonialsSection />
    <CTABannerSection />
  </Layout>
);

export default HomePage;
