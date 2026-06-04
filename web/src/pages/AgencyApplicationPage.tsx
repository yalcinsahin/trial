import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';

const agencySchema = z.object({
  agency_name: z.string().min(2, 'Agency name required'),
  contact_name: z.string().min(2, 'Contact name required'),
  contact_email: z.string().email('Valid email required'),
  contact_phone: z.string().min(10, 'Valid phone required'),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  business_type: z.string().min(2, 'Business type required'),
  estimated_monthly_bookings: z.coerce.number().min(1, 'Enter estimated bookings').optional(),
  message: z.string().optional(),
});

type AgencyFormData = z.infer<typeof agencySchema>;

const BUSINESS_TYPES = [
  { value: 'travel_agency', label: 'Travel Agency' },
  { value: 'corporate_travel', label: 'Corporate Travel Management' },
  { value: 'hotel_concierge', label: 'Hotel / Concierge Service' },
  { value: 'event_planner', label: 'Event Planning Company' },
  { value: 'insurance', label: 'Insurance Adjuster / Broker' },
  { value: 'vacation_planner', label: 'Luxury Vacation Planner' },
  { value: 'other', label: 'Other' },
];

const AgencyApplicationPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgencyFormData>({
    resolver: zodResolver(agencySchema),
  });

  const onSubmit = async (data: AgencyFormData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from('agency_applications').insert({
        agency_name: data.agency_name,
        contact_name: data.contact_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        website: data.website || null,
        business_type: data.business_type,
        estimated_monthly_bookings: data.estimated_monthly_bookings,
        message: data.message,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      });
      if (error) throw error;
      setIsSubmitted(true);
    } catch (err) {
      console.error('Application error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-sea-salt-50 py-16">
          <div className="container-luxury max-w-xl mx-auto text-center">
            <div className="w-20 h-20 bg-sea-salt-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-terra-cotta-500" />
            </div>
            <h1 className="font-cinzel text-3xl font-medium text-brand-black mb-4">
              Application Received!
            </h1>
            <p className="font-cormorant text-xl text-brand-black-400 mb-8">
              Thank you for your interest in partnering with BookAirportRide. Our partnerships team
              will review your application and be in touch within 2 business days.
            </p>
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Agency Partnership Application — BookAirportRide</title>
        <meta
          name="description"
          content="Apply to become a BookAirportRide agency partner and earn commission on every luxury airport transfer you refer."
        />
      </Helmet>

      <div className="min-h-screen bg-sea-salt-50 py-12">
        <div className="container-luxury">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="font-cinzel text-3xl md:text-4xl font-semibold text-brand-black mb-2">
                Agency Partnership Application
              </h1>
              <p className="font-cormorant text-xl text-brand-black-400">
                Join our network and start earning 5% commission on every booking.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card padding="lg" variant="elevated">
                <h2 className="font-cinzel text-xl font-medium text-brand-black mb-6">
                  Business Information
                </h2>
                <div className="space-y-5">
                  <Input
                    label="Agency / Company Name"
                    required
                    error={errors.agency_name?.message}
                    {...register('agency_name')}
                  />
                  <Select
                    label="Business Type"
                    required
                    placeholder="Select business type"
                    options={BUSINESS_TYPES}
                    error={errors.business_type?.message}
                    {...register('business_type')}
                  />
                  <Input
                    label="Website"
                    type="url"
                    placeholder="https://youragency.com"
                    hint="Optional"
                    error={errors.website?.message}
                    {...register('website')}
                  />
                  <Input
                    label="Estimated Monthly Bookings"
                    type="number"
                    min="1"
                    placeholder="20"
                    hint="Your best estimate of how many bookings you'd refer per month"
                    error={errors.estimated_monthly_bookings?.message}
                    {...register('estimated_monthly_bookings')}
                  />
                </div>
              </Card>

              <Card padding="lg" variant="elevated">
                <h2 className="font-cinzel text-xl font-medium text-brand-black mb-6">
                  Contact Information
                </h2>
                <div className="space-y-5">
                  <Input
                    label="Contact Name"
                    required
                    error={errors.contact_name?.message}
                    {...register('contact_name')}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    error={errors.contact_email?.message}
                    {...register('contact_email')}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    required
                    error={errors.contact_phone?.message}
                    {...register('contact_phone')}
                  />
                </div>
              </Card>

              <Card padding="lg" variant="elevated">
                <h2 className="font-cinzel text-xl font-medium text-brand-black mb-4">
                  Additional Notes
                </h2>
                <div>
                  <label className="font-josefin text-xs uppercase tracking-wider text-brand-black block mb-1.5">
                    Tell us about your business
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-warm-white border border-sea-salt-300 text-brand-black font-josefin text-sm px-4 py-3 rounded-none placeholder:text-brand-black-300 focus:outline-none focus:border-terra-cotta-500 focus:ring-1 focus:ring-terra-cotta-500 transition-colors resize-none"
                    placeholder="Tell us about your clients, volume, and how you envision the partnership..."
                    {...register('message')}
                  />
                </div>
              </Card>

              <Button
                type="submit"
                variant="primary"
                size="xl"
                fullWidth
                isLoading={submitting}
              >
                Submit Partnership Application
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgencyApplicationPage;
