import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, ChevronRight, ChevronLeft, Car, Users, Briefcase } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { useBooking } from '@/hooks/useBooking';
import { VEHICLE_CLASSES } from '@/constants';
import type { VehicleClass } from '@/types';
import { format } from 'date-fns';

// ─── Validation Schemas ───────────────────────────────────────────────────────

const tripDetailsSchema = z.object({
  pickup_address: z.string().min(5, 'Pickup address is required'),
  dropoff_address: z.string().min(5, 'Dropoff address is required'),
  scheduled_date: z.string().min(1, 'Date is required'),
  scheduled_time: z.string().min(1, 'Time is required'),
  flight_number: z.string().optional(),
  airline: z.string().optional(),
  passenger_count: z.coerce.number().min(1).max(14),
  bags_count: z.coerce.number().min(0).max(10),
});

const passengerSchema = z.object({
  passenger_name: z.string().min(2, 'Full name is required'),
  passenger_email: z.string().email('Valid email required'),
  passenger_phone: z.string().min(10, 'Valid phone number required'),
  special_requests: z.string().optional(),
});

type TripDetailsData = z.infer<typeof tripDetailsSchema>;
type PassengerData = z.infer<typeof passengerSchema>;

// ─── Step Indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: 'Trip Details' },
  { number: 2, label: 'Vehicle' },
  { number: 3, label: 'Passenger' },
  { number: 4, label: 'Payment' },
  { number: 5, label: 'Confirm' },
];

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-0 mb-12 overflow-x-auto pb-2">
    {STEPS.map((step, index) => (
      <React.Fragment key={step.number}>
        <div className="flex flex-col items-center min-w-0">
          <div
            className={[
              'w-9 h-9 flex items-center justify-center font-josefin text-xs font-medium border-2 transition-all duration-300 flex-shrink-0',
              currentStep === step.number
                ? 'bg-terra-cotta-500 border-terra-cotta-500 text-warm-white'
                : currentStep > step.number
                ? 'bg-brand-black border-brand-black text-warm-white'
                : 'bg-warm-white border-sea-salt-300 text-brand-black-400',
            ].join(' ')}
          >
            {currentStep > step.number ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              step.number
            )}
          </div>
          <span
            className={[
              'mt-2 font-josefin text-[10px] uppercase tracking-wider whitespace-nowrap',
              currentStep === step.number
                ? 'text-terra-cotta-500'
                : currentStep > step.number
                ? 'text-brand-black'
                : 'text-brand-black-300',
            ].join(' ')}
          >
            {step.label}
          </span>
        </div>
        {index < STEPS.length - 1 && (
          <div
            className={[
              'h-px w-8 lg:w-16 mx-1 mt-[-18px] flex-shrink-0 transition-colors duration-300',
              currentStep > step.number ? 'bg-brand-black' : 'bg-sea-salt-200',
            ].join(' ')}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── Step 1: Trip Details ─────────────────────────────────────────────────────

const TripDetailsStep: React.FC<{
  onNext: (data: TripDetailsData) => void;
  defaultValues?: Partial<TripDetailsData>;
}> = ({ onNext, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripDetailsData>({
    resolver: zodResolver(tripDetailsSchema),
    defaultValues: {
      passenger_count: 1,
      bags_count: 1,
      ...defaultValues,
    },
  });

  const tomorrow = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="font-cinzel text-2xl font-medium text-brand-black mb-2">Trip Details</h2>
        <p className="font-cormorant text-lg text-brand-black-400">
          Where are you going, and when?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Input
          label="Pickup Address"
          placeholder="123 Main St, Jacksonville, FL — or airport terminal"
          required
          error={errors.pickup_address?.message}
          {...register('pickup_address')}
        />
        <Input
          label="Dropoff Address"
          placeholder="Jacksonville International Airport (JAX)"
          required
          error={errors.dropoff_address?.message}
          {...register('dropoff_address')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Date"
            type="date"
            min={tomorrow}
            required
            error={errors.scheduled_date?.message}
            {...register('scheduled_date')}
          />
          <Input
            label="Pickup Time"
            type="time"
            required
            error={errors.scheduled_time?.message}
            {...register('scheduled_time')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Flight Number"
            placeholder="AA 1234"
            hint="We'll track your flight for delays"
            error={errors.flight_number?.message}
            {...register('flight_number')}
          />
          <Input
            label="Airline"
            placeholder="American Airlines"
            error={errors.airline?.message}
            {...register('airline')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Passengers"
            type="number"
            min="1"
            max="14"
            required
            error={errors.passenger_count?.message}
            {...register('passenger_count')}
          />
          <Input
            label="Bags"
            type="number"
            min="0"
            max="10"
            error={errors.bags_count?.message}
            {...register('bags_count')}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" variant="primary" size="lg" fullWidth rightIcon={<ChevronRight className="h-4 w-4" />}>
          Continue to Vehicle Selection
        </Button>
      </div>
    </form>
  );
};

// ─── Step 2: Vehicle Selection ────────────────────────────────────────────────

const VehicleSelectionStep: React.FC<{
  onNext: (vehicleClass: VehicleClass) => void;
  onBack: () => void;
  passengerCount: number;
}> = ({ onNext, onBack, passengerCount }) => {
  const [selected, setSelected] = useState<VehicleClass | null>(null);

  const prices: Record<VehicleClass, number> = {
    standard_sedan: 65,
    business_sedan: 95,
    first_class_suv: 145,
    luxury_van: 195,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-cinzel text-2xl font-medium text-brand-black mb-2">Select Vehicle</h2>
        <p className="font-cormorant text-lg text-brand-black-400">
          Choose the vehicle class that fits your travel style and group size.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VEHICLE_CLASSES.map((vehicle) => {
          const isAvailable = vehicle.capacity >= passengerCount;
          const isSelected = selected === vehicle.id;

          return (
            <button
              key={vehicle.id}
              onClick={() => isAvailable && setSelected(vehicle.id as VehicleClass)}
              disabled={!isAvailable}
              className={[
                'text-left border-2 p-5 transition-all duration-200',
                isSelected
                  ? 'border-terra-cotta-500 bg-terra-cotta-50'
                  : isAvailable
                  ? 'border-sea-salt-200 bg-warm-white hover:border-terra-cotta-300'
                  : 'border-sea-salt-100 bg-sea-salt-50 opacity-50 cursor-not-allowed',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-cinzel text-base font-medium text-brand-black">
                    {vehicle.name}
                  </h3>
                  {!isAvailable && (
                    <span className="font-josefin text-[10px] uppercase tracking-wider text-red-400">
                      Insufficient capacity
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-josefin text-[10px] uppercase text-brand-black-400">From</span>
                  <p className="font-cinzel text-xl font-semibold text-brand-black">
                    ${prices[vehicle.id as VehicleClass]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3 text-brand-black-400">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span className="font-josefin text-xs">{vehicle.capacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  <span className="font-josefin text-xs">{vehicle.luggage}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Car className="h-3 w-3" />
                  <span className="font-josefin text-xs capitalize">{vehicle.id.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {isSelected && (
                <div className="flex items-center gap-2 text-terra-cotta-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-josefin text-xs uppercase tracking-wider">Selected</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="secondary" size="lg" onClick={onBack} leftIcon={<ChevronLeft className="h-4 w-4" />}>
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
          rightIcon={<ChevronRight className="h-4 w-4" />}
        >
          Continue to Passenger Info
        </Button>
      </div>
    </div>
  );
};

// ─── Step 3: Passenger Info ───────────────────────────────────────────────────

const PassengerInfoStep: React.FC<{
  onNext: (data: PassengerData) => void;
  onBack: () => void;
  defaultValues?: Partial<PassengerData>;
}> = ({ onNext, onBack, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PassengerData>({
    resolver: zodResolver(passengerSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="font-cinzel text-2xl font-medium text-brand-black mb-2">Passenger Info</h2>
        <p className="font-cormorant text-lg text-brand-black-400">
          Who should we look for at arrivals?
        </p>
      </div>

      <div className="space-y-5">
        <Input
          label="Full Name"
          placeholder="As it appears on your ID"
          required
          error={errors.passenger_name?.message}
          {...register('passenger_name')}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          required
          hint="Booking confirmation will be sent here"
          error={errors.passenger_email?.message}
          {...register('passenger_email')}
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="(904) 555-0100"
          required
          hint="For driver communication on the day of travel"
          error={errors.passenger_phone?.message}
          {...register('passenger_phone')}
        />
        <div>
          <label className="font-josefin text-xs uppercase tracking-wider text-brand-black block mb-1.5">
            Special Requests
          </label>
          <textarea
            className="w-full bg-warm-white border border-sea-salt-300 text-brand-black font-josefin text-sm px-4 py-3 rounded-none placeholder:text-brand-black-300 focus:outline-none focus:border-terra-cotta-500 focus:ring-1 focus:ring-terra-cotta-500 transition-colors duration-150 resize-none"
            rows={3}
            placeholder="Child seat, extra stops, accessibility needs..."
            {...register('special_requests')}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="secondary" size="lg" onClick={onBack} leftIcon={<ChevronLeft className="h-4 w-4" />}>
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg" fullWidth rightIcon={<ChevronRight className="h-4 w-4" />}>
          Continue to Payment
        </Button>
      </div>
    </form>
  );
};

// ─── Step 4: Payment ──────────────────────────────────────────────────────────

const PaymentStep: React.FC<{
  onNext: (promoCode?: string) => void;
  onBack: () => void;
  totalPrice: number;
  vehicleClass: VehicleClass;
  formData: {
    pickup_address?: string;
    dropoff_address?: string;
    scheduled_date?: string;
    scheduled_time?: string;
    passenger_name?: string;
  };
}> = ({ onNext, onBack, totalPrice, vehicleClass, formData }) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const vehicleLabels: Record<VehicleClass, string> = {
    standard_sedan: 'Standard Sedan',
    business_sedan: 'Business Sedan',
    first_class_suv: 'First Class SUV',
    luxury_van: 'Luxury Van',
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    onNext(promoApplied ? promoCode : undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-cinzel text-2xl font-medium text-brand-black mb-2">Payment</h2>
        <p className="font-cormorant text-lg text-brand-black-400">
          Review your booking summary and complete payment.
        </p>
      </div>

      {/* Order Summary */}
      <Card padding="md" variant="outlined">
        <h3 className="font-cinzel text-base font-medium text-brand-black mb-4">Order Summary</h3>
        <div className="space-y-3">
          {[
            { label: 'Vehicle', value: vehicleLabels[vehicleClass] },
            { label: 'Pickup', value: formData.pickup_address ?? '—' },
            { label: 'Dropoff', value: formData.dropoff_address ?? '—' },
            {
              label: 'Date & Time',
              value: formData.scheduled_date && formData.scheduled_time
                ? `${formData.scheduled_date} at ${formData.scheduled_time}`
                : '—',
            },
            { label: 'Passenger', value: formData.passenger_name ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="font-josefin text-[10px] uppercase tracking-wider text-brand-black-400 flex-shrink-0">
                {label}
              </span>
              <span className="font-cormorant text-base text-brand-black text-right">{value}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-sea-salt-200 flex items-center justify-between">
            <span className="font-josefin text-sm uppercase tracking-wider text-brand-black font-medium">
              Total
            </span>
            <span className="font-cinzel text-2xl font-semibold text-brand-black">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      {/* Promo Code */}
      <div>
        <label className="font-josefin text-xs uppercase tracking-wider text-brand-black block mb-1.5">
          Promo Code
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            disabled={promoApplied}
            className="flex-1 bg-warm-white border border-sea-salt-300 text-brand-black font-josefin text-sm px-4 py-3 rounded-none placeholder:text-brand-black-300 focus:outline-none focus:border-terra-cotta-500 focus:ring-1 focus:ring-terra-cotta-500 transition-colors duration-150 disabled:bg-sea-salt-50 disabled:text-brand-black-300"
          />
          <Button
            variant={promoApplied ? 'ghost' : 'secondary'}
            size="md"
            onClick={handleApplyPromo}
            disabled={promoApplied || !promoCode.trim()}
          >
            {promoApplied ? 'Applied' : 'Apply'}
          </Button>
        </div>
        {promoApplied && (
          <p className="mt-2 font-josefin text-xs text-terra-cotta-600 uppercase tracking-wider">
            Promo code applied!
          </p>
        )}
      </div>

      {/* Card Element Placeholder */}
      <div>
        <label className="font-josefin text-xs uppercase tracking-wider text-brand-black block mb-1.5">
          Card Details
        </label>
        <div className="border border-sea-salt-300 p-4 bg-warm-white">
          <div className="h-10 flex items-center justify-center border border-dashed border-sea-salt-300">
            <span className="font-josefin text-xs text-brand-black-400 uppercase tracking-wider">
              Stripe Card Element (integrate with @stripe/react-stripe-js)
            </span>
          </div>
        </div>
        <p className="mt-2 font-josefin text-[10px] text-brand-black-400 uppercase tracking-wider">
          Your payment is secured with 256-bit SSL encryption
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="secondary" size="lg" onClick={onBack} leftIcon={<ChevronLeft className="h-4 w-4" />}>
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isProcessing}
          onClick={handleSubmit}
        >
          {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
};

// ─── Step 5: Confirmation ─────────────────────────────────────────────────────

const ConfirmationStep: React.FC<{
  referenceNumber: string;
  formData: Record<string, unknown>;
}> = ({ referenceNumber, formData }) => (
  <div className="text-center space-y-6">
    <div className="flex items-center justify-center">
      <div className="w-20 h-20 bg-sea-salt-100 flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-terra-cotta-500" />
      </div>
    </div>

    <div>
      <h2 className="font-cinzel text-3xl font-medium text-brand-black mb-2">Booking Confirmed!</h2>
      <p className="font-cormorant text-xl text-brand-black-400">
        Your luxury transfer has been reserved.
      </p>
    </div>

    <Card padding="md" variant="outlined" className="text-left">
      <div className="text-center mb-4">
        <span className="font-josefin text-[10px] uppercase tracking-widest text-brand-black-400">
          Booking Reference
        </span>
        <p className="font-cinzel text-3xl font-semibold text-terra-cotta-500 mt-1">
          {referenceNumber}
        </p>
      </div>
      <p className="font-cormorant text-base text-brand-black-400 text-center">
        A confirmation has been sent to{' '}
        <strong>{(formData.passenger_email as string) ?? 'your email'}</strong>.
        Keep your reference number for tracking and support.
      </p>
    </Card>

    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
      <Button variant="secondary" size="lg" onClick={() => window.location.href = '/track'}>
        Track This Ride
      </Button>
      <Button variant="primary" size="lg" onClick={() => window.location.href = '/'}>
        Return Home
      </Button>
    </div>
  </div>
);

// ─── Booking Page ─────────────────────────────────────────────────────────────

const BookingPage: React.FC = () => {
  const { currentStep, formData, selectedVehicleClass, updateFormData, setStep, setVehicleClass, createBooking, isLoading, confirmedBooking } =
    useBooking();

  const handleTripDetails = (data: TripDetailsData) => {
    updateFormData(data);
    setStep(2);
  };

  const handleVehicleSelect = (vehicleClass: VehicleClass) => {
    setVehicleClass(vehicleClass);
    updateFormData({ vehicle_class: vehicleClass });
    setStep(3);
  };

  const handlePassengerInfo = (data: PassengerData) => {
    updateFormData(data);
    setStep(4);
  };

  const handlePayment = async (promoCode?: string) => {
    if (!selectedVehicleClass) return;

    const prices: Record<VehicleClass, number> = {
      standard_sedan: 65,
      business_sedan: 95,
      first_class_suv: 145,
      luxury_van: 195,
    };

    const totalPrice = prices[selectedVehicleClass];
    await createBooking({
      ...formData,
      vehicle_class: selectedVehicleClass,
      base_price: totalPrice,
      total_price: totalPrice,
      promo_code: promoCode,
    });
    setStep(5);
  };

  const prices: Record<VehicleClass, number> = {
    standard_sedan: 65,
    business_sedan: 95,
    first_class_suv: 145,
    luxury_van: 195,
  };

  return (
    <Layout>
      <Helmet>
        <title>Book Your Airport Transfer — BookAirportRide</title>
        <meta
          name="description"
          content="Book your luxury Jacksonville airport transfer. Fixed pricing, instant confirmation."
        />
      </Helmet>

      <div className="min-h-screen bg-sea-salt-50 py-12">
        <div className="container-luxury">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-cinzel text-3xl md:text-4xl font-semibold text-brand-black mb-2">
                Book Your Transfer
              </h1>
              <p className="font-cormorant text-xl text-brand-black-400">
                Jacksonville airport transportation — fixed price, no surprises.
              </p>
            </div>

            <StepIndicator currentStep={currentStep} />

            {/* Form Card */}
            <Card padding="lg" variant="elevated">
              {currentStep === 1 && (
                <TripDetailsStep
                  onNext={handleTripDetails}
                  defaultValues={formData as Partial<TripDetailsData>}
                />
              )}
              {currentStep === 2 && (
                <VehicleSelectionStep
                  onNext={handleVehicleSelect}
                  onBack={() => setStep(1)}
                  passengerCount={(formData.passenger_count as number) ?? 1}
                />
              )}
              {currentStep === 3 && (
                <PassengerInfoStep
                  onNext={handlePassengerInfo}
                  onBack={() => setStep(2)}
                  defaultValues={formData as Partial<PassengerData>}
                />
              )}
              {currentStep === 4 && selectedVehicleClass && (
                <PaymentStep
                  onNext={handlePayment}
                  onBack={() => setStep(3)}
                  totalPrice={prices[selectedVehicleClass]}
                  vehicleClass={selectedVehicleClass}
                  formData={formData as Record<string, string>}
                />
              )}
              {currentStep === 5 && (
                <ConfirmationStep
                  referenceNumber={confirmedBooking?.reference_number ?? 'BAR-XXXXXX'}
                  formData={formData as Record<string, unknown>}
                />
              )}

              {isLoading && currentStep === 5 && (
                <div className="text-center py-8">
                  <p className="font-josefin text-sm uppercase tracking-wider text-brand-black-400">
                    Confirming your booking...
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
