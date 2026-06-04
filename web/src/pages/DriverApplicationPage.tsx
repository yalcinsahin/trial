import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, FileText, Upload } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { US_STATES } from '@/constants';

const applicationSchema = z.object({
  first_name: z.string().min(2, 'First name required'),
  last_name: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  vehicle_class: z.enum(['standard_sedan', 'business_sedan', 'first_class_suv', 'luxury_van']),
  vehicle_make: z.string().min(2, 'Vehicle make required'),
  vehicle_model: z.string().min(1, 'Vehicle model required'),
  vehicle_year: z.coerce.number().min(2019, 'Vehicle must be 2019 or newer').max(new Date().getFullYear() + 1),
  vehicle_color: z.string().min(2, 'Vehicle color required'),
  vehicle_plate: z.string().min(2, 'License plate required'),
  license_number: z.string().min(5, 'License number required'),
  license_expiry: z.string().min(1, 'License expiry required'),
  has_insurance: z.boolean().refine((v) => v, 'You must have auto insurance'),
  has_clean_record: z.boolean().refine((v) => v, 'Required certification'),
  agree_terms: z.boolean().refine((v) => v, 'You must agree to the terms'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const DOCUMENTS_CHECKLIST = [
  "Driver's license (front & back)",
  'Vehicle registration',
  'Auto insurance card',
  'Vehicle photos (4 exterior, 2 interior)',
  'Void cheque or direct deposit info',
];

const DriverApplicationPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      has_insurance: false,
      has_clean_record: false,
      agree_terms: false,
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from('driver_applications').insert({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        vehicle_class: data.vehicle_class,
        vehicle_make: data.vehicle_make,
        vehicle_model: data.vehicle_model,
        vehicle_year: data.vehicle_year,
        vehicle_color: data.vehicle_color,
        vehicle_plate: data.vehicle_plate,
        license_number: data.license_number,
        license_expiry: data.license_expiry,
        has_insurance: data.has_insurance,
        has_clean_record: data.has_clean_record,
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
              Application Submitted!
            </h1>
            <p className="font-cormorant text-xl text-brand-black-400 mb-8">
              Thank you for applying to drive with BookAirportRide. Our team will review your
              application and contact you within 3 business days.
            </p>
            <Card padding="md" variant="outlined" className="text-left mb-8">
              <h3 className="font-cinzel text-base font-medium text-brand-black mb-4">
                Next Steps
              </h3>
              {['Application review (1–3 business days)', 'Background check authorization', 'Vehicle inspection appointment', 'Driver orientation (2 hours)', 'Activate your account & start earning'].map(
                (step, i) => (
                  <div key={step} className="flex items-center gap-3 mb-3">
                    <span className="font-cinzel text-base font-semibold text-terra-cotta-500 w-5">
                      {i + 1}.
                    </span>
                    <span className="font-cormorant text-lg text-brand-black-500">{step}</span>
                  </div>
                )
              )}
            </Card>
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
        <title>Driver Application — BookAirportRide</title>
        <meta
          name="description"
          content="Apply to drive with BookAirportRide. Join Jacksonville's premier luxury airport transfer network."
        />
      </Helmet>

      <div className="min-h-screen bg-sea-salt-50 py-12">
        <div className="container-luxury">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="font-cinzel text-3xl md:text-4xl font-semibold text-brand-black mb-2">
                Driver Application
              </h1>
              <p className="font-cormorant text-xl text-brand-black-400">
                Join Jacksonville's premier luxury airport transfer network.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <Card padding="lg" variant="elevated">
                <h2 className="font-cinzel text-xl font-medium text-brand-black mb-6">
                  Personal Information
                </h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="First Name"
                      required
                      error={errors.first_name?.message}
                      {...register('first_name')}
                    />
                    <Input
                      label="Last Name"
                      required
                      error={errors.last_name?.message}
                      {...register('last_name')}
                    />
                  </div>
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    required
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="City"
                      required
                      error={errors.city?.message}
                      {...register('city')}
                    />
                    <Select
                      label="State"
                      required
                      placeholder="Select state"
                      options={US_STATES.map((s) => ({ value: s.code, label: s.name }))}
                      error={errors.state?.message}
                      {...register('state')}
                    />
                  </div>
                </div>
              </Card>

              {/* Vehicle Information */}
              <Card padding="lg" variant="elevated">
                <h2 className="font-cinzel text-xl font-medium text-brand-black mb-6">
                  Vehicle Information
                </h2>
                <div className="space-y-5">
                  <Select
                    label="Vehicle Class"
                    required
                    placeholder="Select vehicle class"
                    options={[
                      { value: 'standard_sedan', label: 'Standard Sedan' },
                      { value: 'business_sedan', label: 'Business Sedan' },
                      { value: 'first_class_suv', label: 'First Class SUV' },
                      { value: 'luxury_van', label: 'Luxury Van' },
                    ]}
                    error={errors.vehicle_class?.message}
                    {...register('vehicle_class')}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Vehicle Make"
                      placeholder="Mercedes-Benz"
                      required
                      error={errors.vehicle_make?.message}
                      {...register('vehicle_make')}
                    />
                    <Input
                      label="Vehicle Model"
                      placeholder="E-Class"
                      required
                      error={errors.vehicle_model?.message}
                      {...register('vehicle_model')}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Input
                      label="Year"
                      type="number"
                      placeholder="2022"
                      required
                      error={errors.vehicle_year?.message}
                      {...register('vehicle_year')}
                    />
                    <Input
                      label="Color"
                      placeholder="Black"
                      required
                      error={errors.vehicle_color?.message}
                      {...register('vehicle_color')}
                    />
                    <Input
                      label="License Plate"
                      placeholder="ABC1234"
                      required
                      error={errors.vehicle_plate?.message}
                      {...register('vehicle_plate')}
                    />
                  </div>
                </div>
              </Card>

              {/* License Information */}
              <Card padding="lg" variant="elevated">
                <h2 className="font-cinzel text-xl font-medium text-brand-black mb-6">
                  License Information
                </h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Driver's License Number"
                      required
                      error={errors.license_number?.message}
                      {...register('license_number')}
                    />
                    <Input
                      label="License Expiry Date"
                      type="date"
                      required
                      error={errors.license_expiry?.message}
                      {...register('license_expiry')}
                    />
                  </div>
                </div>
              </Card>

              {/* Documents Checklist */}
              <Card padding="lg" variant="elevated">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-5 w-5 text-terra-cotta-500" />
                  <h2 className="font-cinzel text-xl font-medium text-brand-black">
                    Documents to Prepare
                  </h2>
                </div>
                <p className="font-cormorant text-base text-brand-black-400 mb-4">
                  You'll upload these documents after your application is approved:
                </p>
                <ul className="space-y-2">
                  {DOCUMENTS_CHECKLIST.map((doc) => (
                    <li key={doc} className="flex items-center gap-3">
                      <Upload className="h-3.5 w-3.5 text-terra-cotta-500 flex-shrink-0" />
                      <span className="font-josefin text-xs uppercase tracking-wide text-brand-black-500">
                        {doc}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Certifications */}
              <Card padding="lg" variant="elevated">
                <h2 className="font-cinzel text-xl font-medium text-brand-black mb-6">
                  Certifications
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      name: 'has_insurance' as const,
                      label: 'I have valid personal auto insurance',
                      error: errors.has_insurance?.message,
                    },
                    {
                      name: 'has_clean_record' as const,
                      label: 'I have a clean driving record with no major violations in the past 3 years',
                      error: errors.has_clean_record?.message,
                    },
                    {
                      name: 'agree_terms' as const,
                      label: 'I agree to the BookAirportRide Driver Terms and Privacy Policy',
                      error: errors.agree_terms?.message,
                    },
                  ].map(({ name, label, error }) => (
                    <div key={name}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-0.5 w-4 h-4 border-sea-salt-300 text-terra-cotta-500 focus:ring-terra-cotta-500 rounded-none"
                          {...register(name)}
                        />
                        <span className="font-cormorant text-lg text-brand-black-500 leading-snug">
                          {label}
                        </span>
                      </label>
                      {error && (
                        <p className="mt-1 ml-7 font-josefin text-xs text-red-500">{error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Button
                type="submit"
                variant="primary"
                size="xl"
                fullWidth
                isLoading={submitting}
              >
                Submit Application
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DriverApplicationPage;
