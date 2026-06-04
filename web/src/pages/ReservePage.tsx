import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';
import { VEHICLE_CLASSES, calculatePrice } from '../constants/pricing';
import { validatePromoCode } from '../lib/supabase';
import type { BookingFormData } from '../types/booking';

const schema = z.object({
  tripType: z.enum(['pickup', 'dropoff']),
  pickupAddress: z.string().min(3, 'Pickup address is required'),
  dropoffAddress: z.string().min(3, 'Drop-off address is required'),
  pickupDate: z.string().min(1, 'Date is required'),
  pickupTime: z.string().min(1, 'Time is required'),
  returnTrip: z.boolean(),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  airline: z.string().optional(),
  flightNumber: z.string().optional(),
  passengersCount: z.number().min(1).max(14),
  bagsCount: z.number().min(0).max(10),
  childSeats: z.boolean(),
  childSeatsCount: z.number().min(0).max(3).optional(),
  meetAndGreet: z.boolean(),
  specialRequests: z.string().max(300).optional(),
  vehicleClass: z.enum(['executive-suv', 'first-class-suv', 'executive-van', 'vip-sprinter']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email required'),
  confirmEmail: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  countryCode: z.string(),
  howHeard: z.string().optional(),
  promoCode: z.string().optional(),
  agreeTerms: z.boolean().refine(v => v, 'You must agree to the terms'),
  agreeSms: z.boolean(),
}).refine(d => d.email === d.confirmEmail, {
  message: 'Emails must match',
  path: ['confirmEmail'],
});

function Stepper({ value, onChange, min = 0, max = 10 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="stepper">
      <button type="button" className="stepper-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
      <span className="stepper-val">{value}</span>
      <button type="button" className="stepper-btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
    </div>
  );
}

function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <label className="toggle-wrap" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );
}

const STEPS = ['Trip Details', 'Flight & Passengers', 'Choose Vehicle', 'Your Info'];

const TODAY = new Date();
const MIN_DATE = new Date(TODAY.getTime() + 2 * 3600 * 1000).toISOString().split('T')[0];

const ESTIMATED_MILES = 18; // Default estimate for JAX market

export default function ReservePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [promoStatus, setPromoStatus] = useState<{ valid: boolean; discount?: number; type?: 'percent' | 'fixed'; checked?: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
    trigger,
  } = useForm<BookingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tripType: 'pickup',
      pickupAddress: searchParams.get('pickup') || '',
      dropoffAddress: searchParams.get('dropoff') || '',
      pickupDate: searchParams.get('date') || '',
      pickupTime: searchParams.get('time') || '',
      returnTrip: false,
      passengersCount: Number(searchParams.get('passengers')) || 1,
      bagsCount: 0,
      childSeats: false,
      meetAndGreet: false,
      vehicleClass: 'executive-suv',
      countryCode: '+1',
      agreeTerms: false,
      agreeSms: false,
    },
  });

  const watchedValues = watch();
  const passengers = watchedValues.passengersCount;
  const bags = watchedValues.bagsCount;
  const vehicleClass = watchedValues.vehicleClass;
  const meetAndGreet = watchedValues.meetAndGreet;
  const returnTrip = watchedValues.returnTrip;
  const childSeats = watchedValues.childSeats;
  const specialRequests = watchedValues.specialRequests || '';

  const priceBreakdown = (() => {
    try {
      const { baseFare, distanceFee, meetGreetFee, total } = calculatePrice(vehicleClass, ESTIMATED_MILES, meetAndGreet);
      const promoDiscount = promoStatus?.valid
        ? promoStatus.type === 'percent'
          ? Math.round((total * (promoStatus.discount! / 100)) * 100) / 100
          : promoStatus.discount!
        : 0;
      return { baseFare, distanceFee, meetGreetFee, promoDiscount, total: Math.max(0, total - promoDiscount) };
    } catch {
      return { baseFare: 65, distanceFee: 58.5, meetGreetFee: 0, promoDiscount: 0, total: 123.5 };
    }
  })();

  const handlePromoApply = async () => {
    const code = watchedValues.promoCode || '';
    if (!code) return;
    const result = await validatePromoCode(code);
    setPromoStatus({ ...result, checked: true });
  };

  const STEP_FIELDS: (keyof BookingFormData)[][] = [
    ['tripType', 'pickupAddress', 'dropoffAddress', 'pickupDate', 'pickupTime'],
    ['passengersCount', 'bagsCount'],
    ['vehicleClass'],
    ['firstName', 'lastName', 'email', 'confirmEmail', 'phone', 'agreeTerms'],
  ];

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step] as any);
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = async (data: BookingFormData) => {
    setSubmitting(true);
    try {
      const bookingId = `BAR-${Date.now()}`;
      await new Promise(r => setTimeout(r, 1200));
      navigate(`/booking-confirmation/${bookingId}`, { state: { booking: data, price: priceBreakdown } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reserve Your Ride — BookAirportRide</title>
        <meta name="description" content="Book a premium black car airport transfer in minutes. Transparent pricing, professional drivers, 24/7 service." />
        <link rel="canonical" href="https://bookairportride.com/reserve" />
      </Helmet>

      {/* Page Header */}
      <div className="page-header">
        <p className="section-label" style={{ color: '#c4623a', marginBottom: '0.75rem' }}>Secure Booking</p>
        <h1 className="font-cinzel" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 600, color: '#fdfcfa', letterSpacing: '0.02em' }}>
          Reserve Your Ride
        </h1>
      </div>

      {/* Step Indicator */}
      <div style={{ backgroundColor: '#f8f5f0', borderBottom: '1px solid #e8ede8', padding: '1.25rem 1.5rem' }}>
        <div className="max-w-5xl mx-auto">
          <div className="step-indicator">
            {STEPS.map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                  <div
                    className="step-dot"
                    style={{
                      backgroundColor: i < step ? '#c4623a' : i === step ? '#161210' : '#e8ede8',
                      color: i <= step ? '#fdfcfa' : '#8a8480',
                    }}
                  >
                    {i < step ? <Check size={12} /> : i + 1}
                  </div>
                  <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.08em', color: i === step ? '#161210' : '#a0a8a0', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="step-line" style={{ background: i < step ? '#c4623a' : '#e8ede8', margin: '0 0.5rem', marginBottom: '1rem' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ backgroundColor: '#fdfcfa', padding: '3rem 1.5rem 5rem' }}>
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Column */}
              <div className="lg:col-span-2">

                {/* STEP 1 — TRIP INFO */}
                {step === 0 && (
                  <div>
                    <h2 className="font-cinzel" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#161210', letterSpacing: '0.05em', marginBottom: '2rem' }}>
                      Trip Information
                    </h2>

                    {/* Trip Type Toggle */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <label className="form-label">Trip Type <span className="required-star">*</span></label>
                      <Controller
                        name="tripType"
                        control={control}
                        render={({ field }) => (
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {(['pickup', 'dropoff'] as const).map(t => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => field.onChange(t)}
                                style={{
                                  padding: '0.6rem 1.5rem',
                                  border: `1.5px solid ${field.value === t ? '#c4623a' : '#c2d0c2'}`,
                                  borderRadius: '2px',
                                  backgroundColor: field.value === t ? '#c4623a' : '#fdfcfa',
                                  color: field.value === t ? '#fdfcfa' : '#161210',
                                  fontFamily: "'Josefin Sans', sans-serif",
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  letterSpacing: '0.1em',
                                  textTransform: 'uppercase',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                {t === 'pickup' ? 'Airport Pickup' : 'Airport Drop-off'}
                              </button>
                            ))}
                          </div>
                        )}
                      />
                    </div>

                    {/* Pickup */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">
                        Pickup Location <span className="required-star">*</span>
                      </label>
                      <input
                        {...register('pickupAddress')}
                        className={`form-input ${errors.pickupAddress ? 'error' : ''}`}
                        placeholder="Enter address, hotel, or airport terminal"
                      />
                      {errors.pickupAddress && <span className="form-error">{errors.pickupAddress.message}</span>}
                    </div>

                    {/* Dropoff */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">
                        Drop-off Location <span className="required-star">*</span>
                      </label>
                      <input
                        {...register('dropoffAddress')}
                        className={`form-input ${errors.dropoffAddress ? 'error' : ''}`}
                        placeholder="Enter address, hotel, or airport terminal"
                      />
                      {errors.dropoffAddress && <span className="form-error">{errors.dropoffAddress.message}</span>}
                    </div>

                    {/* Date + Time */}
                    <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1.25rem' }}>
                      <div>
                        <label className="form-label">Pickup Date <span className="required-star">*</span></label>
                        <input
                          type="date"
                          {...register('pickupDate')}
                          min={MIN_DATE}
                          className={`form-input ${errors.pickupDate ? 'error' : ''}`}
                          style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.85rem' }}
                        />
                        {errors.pickupDate && <span className="form-error">{errors.pickupDate.message}</span>}
                      </div>
                      <div>
                        <label className="form-label">Pickup Time <span className="required-star">*</span></label>
                        <input
                          type="time"
                          {...register('pickupTime')}
                          step={900}
                          className={`form-input ${errors.pickupTime ? 'error' : ''}`}
                          style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.85rem' }}
                        />
                        {errors.pickupTime && <span className="form-error">{errors.pickupTime.message}</span>}
                      </div>
                    </div>

                    {/* Return Trip Toggle */}
                    <div style={{ marginBottom: returnTrip ? '0' : '1.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e8ede8', borderRadius: '2px', backgroundColor: '#f8f5f0' }}>
                        <div>
                          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', color: '#161210' }}>
                            Return Trip
                          </p>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', color: '#8a8480', marginTop: '0.1rem' }}>
                            Book your return transfer at the same time
                          </p>
                        </div>
                        <Controller
                          name="returnTrip"
                          control={control}
                          render={({ field }) => (
                            <Toggle checked={field.value} onChange={field.onChange} id="returnTrip" />
                          )}
                        />
                      </div>
                    </div>

                    {returnTrip && (
                      <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1.75rem', padding: '1.25rem', backgroundColor: '#f8f5f0', border: '1px solid #e8ede8', borderTop: 'none', borderRadius: '0 0 2px 2px' }}>
                        <div>
                          <label className="form-label">Return Date <span className="required-star">*</span></label>
                          <input type="date" {...register('returnDate')} min={MIN_DATE} className="form-input" style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.85rem' }} />
                        </div>
                        <div>
                          <label className="form-label">Return Time <span className="required-star">*</span></label>
                          <input type="time" {...register('returnTime')} step={900} className="form-input" style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.85rem' }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2 — FLIGHT & PASSENGERS */}
                {step === 1 && (
                  <div>
                    <h2 className="font-cinzel" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#161210', letterSpacing: '0.05em', marginBottom: '2rem' }}>
                      Flight & Passenger Details
                    </h2>

                    <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1.25rem' }}>
                      <div>
                        <label className="form-label">Airline Name</label>
                        <input {...register('airline')} className="form-input" placeholder="e.g. Delta, American" />
                      </div>
                      <div>
                        <label className="form-label">Flight Number</label>
                        <input {...register('flightNumber')} className="form-input" placeholder="e.g. DL 1234" />
                      </div>
                    </div>

                    {/* Passengers + Bags */}
                    <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '1.75rem' }}>
                      <div>
                        <label className="form-label">Passengers <span className="required-star">*</span></label>
                        <Controller
                          name="passengersCount"
                          control={control}
                          render={({ field }) => <Stepper value={field.value} onChange={field.onChange} min={1} max={14} />}
                        />
                      </div>
                      <div>
                        <label className="form-label">Bags</label>
                        <Controller
                          name="bagsCount"
                          control={control}
                          render={({ field }) => <Stepper value={field.value} onChange={field.onChange} min={0} max={10} />}
                        />
                      </div>
                    </div>

                    {/* Child Seats Toggle */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e8ede8', borderRadius: '2px', backgroundColor: '#f8f5f0' }}>
                        <div>
                          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', color: '#161210' }}>Child Seats</p>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', color: '#8a8480', marginTop: '0.1rem' }}>Subject to availability</p>
                        </div>
                        <Controller name="childSeats" control={control} render={({ field }) => <Toggle checked={field.value} onChange={field.onChange} id="childSeats" />} />
                      </div>
                    </div>
                    {childSeats && (
                      <div style={{ padding: '1rem', backgroundColor: '#f8f5f0', border: '1px solid #e8ede8', borderTop: 'none', marginBottom: '1.25rem', borderRadius: '0 0 2px 2px' }}>
                        <label className="form-label">Number of Child Seats</label>
                        <Controller name="childSeatsCount" control={control} render={({ field }) => <Stepper value={field.value ?? 1} onChange={field.onChange} min={1} max={3} />} />
                      </div>
                    )}

                    {/* Meet & Greet */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e8ede8', borderRadius: '2px', backgroundColor: '#f8f5f0' }}>
                        <div>
                          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', color: '#161210' }}>Meet & Greet Service</p>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', color: '#8a8480', marginTop: '0.1rem' }}>Driver meets you at arrivals with name sign · <span style={{ color: '#c4623a' }}>+$25.00</span></p>
                        </div>
                        <Controller name="meetAndGreet" control={control} render={({ field }) => <Toggle checked={field.value} onChange={field.onChange} id="meetAndGreet" />} />
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="form-label">Special Requests</label>
                      <textarea
                        {...register('specialRequests')}
                        className="form-input"
                        rows={3}
                        placeholder="Any special requirements, preferences, or notes for your driver..."
                        maxLength={300}
                        style={{ resize: 'vertical' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#a0a8a0', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
                          {specialRequests.length}/300
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 — VEHICLE */}
                {step === 2 && (
                  <div>
                    <h2 className="font-cinzel" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#161210', letterSpacing: '0.05em', marginBottom: '2rem' }}>
                      Select Your Vehicle
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {VEHICLE_CLASSES.map((v) => {
                        const insufficient = passengers > v.passengers || bags > v.bags;
                        const selected = vehicleClass === v.id;
                        return (
                          <div
                            key={v.id}
                            className={`vehicle-card ${selected ? 'selected' : ''} ${insufficient ? 'disabled' : ''}`}
                            onClick={() => !insufficient && setValue('vehicleClass', v.id as any)}
                          >
                            {insufficient && (
                              <div style={{ marginBottom: '0.75rem' }}>
                                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.1em', color: '#a0a8a0', backgroundColor: '#f0f0f0', padding: '0.2rem 0.6rem', borderRadius: '1px' }}>
                                  INSUFFICIENT CAPACITY
                                </span>
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                              <h3 className="font-cinzel" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#161210', letterSpacing: '0.04em' }}>
                                {v.name}
                              </h3>
                              {selected && <Check size={16} color="#c4623a" />}
                            </div>
                            <p className="font-cormorant" style={{ fontSize: '0.95rem', color: '#6a6460', lineHeight: 1.5, marginBottom: '1rem' }}>
                              {v.description}
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#8a8480', letterSpacing: '0.06em' }}>
                                {v.passengers} passengers
                              </span>
                              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#8a8480', letterSpacing: '0.06em' }}>
                                {v.bags} bags
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                              {v.amenities.slice(0, 3).map(a => (
                                <span key={a} style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.06em', color: '#6a6460', backgroundColor: '#f0ede8', padding: '0.2rem 0.5rem', borderRadius: '1px' }}>
                                  {a}
                                </span>
                              ))}
                            </div>
                            <div style={{ borderTop: '1px solid #e8ede8', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', color: '#a0a8a0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Base fare</span>
                                <p className="font-cinzel" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#c4623a' }}>
                                  ${v.baseFare.toFixed(0)} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#a0a8a0' }}>+ ${v.perMileRate}/mi</span>
                                </p>
                              </div>
                              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#a0a8a0', letterSpacing: '0.06em' }}>
                                Min ${v.minimumFare}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 4 — YOUR INFO */}
                {step === 3 && (
                  <div>
                    <h2 className="font-cinzel" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#161210', letterSpacing: '0.05em', marginBottom: '2rem' }}>
                      Your Information
                    </h2>

                    <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1.25rem' }}>
                      <div>
                        <label className="form-label">First Name <span className="required-star">*</span></label>
                        <input {...register('firstName')} className={`form-input ${errors.firstName ? 'error' : ''}`} placeholder="First name" />
                        {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                      </div>
                      <div>
                        <label className="form-label">Last Name <span className="required-star">*</span></label>
                        <input {...register('lastName')} className={`form-input ${errors.lastName ? 'error' : ''}`} placeholder="Last name" />
                        {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">Email Address <span className="required-star">*</span></label>
                      <input type="email" {...register('email')} className={`form-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com" />
                      {errors.email && <span className="form-error">{errors.email.message}</span>}
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">Confirm Email <span className="required-star">*</span></label>
                      <input type="email" {...register('confirmEmail')} className={`form-input ${errors.confirmEmail ? 'error' : ''}`} placeholder="Confirm your email" />
                      {errors.confirmEmail && <span className="form-error">{errors.confirmEmail.message}</span>}
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">Phone Number <span className="required-star">*</span></label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select {...register('countryCode')} className="form-select" style={{ width: '5.5rem', flexShrink: 0 }}>
                          <option value="+1">+1 US</option>
                          <option value="+44">+44 UK</option>
                          <option value="+33">+33 FR</option>
                          <option value="+49">+49 DE</option>
                          <option value="+971">+971 UAE</option>
                        </select>
                        <input type="tel" {...register('phone')} className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="(555) 000-0000" />
                      </div>
                      {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">How Did You Hear About Us?</label>
                      <select {...register('howHeard')} className="form-select">
                        <option value="">Select an option</option>
                        <option value="google">Google Search</option>
                        <option value="referral">Referral from Friend/Colleague</option>
                        <option value="travel-agent">Travel Agent</option>
                        <option value="instagram">Instagram</option>
                        <option value="hotel">Hotel Recommendation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Promo Code */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <label className="form-label">Promo Code</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input {...register('promoCode')} className="form-input" placeholder="Enter promo code" style={{ flex: 1 }} />
                        <button
                          type="button"
                          onClick={handlePromoApply}
                          className="btn-outline-dark"
                          style={{ padding: '0.6rem 1.25rem', whiteSpace: 'nowrap' }}
                        >
                          Apply
                        </button>
                      </div>
                      {promoStatus?.checked && (
                        <span className="form-error" style={{ color: promoStatus.valid ? '#2a7a4a' : '#e05c5c' }}>
                          {promoStatus.valid ? `✓ Code applied — ${ promoStatus.type === 'percent' ? promoStatus.discount + '% off' : '$' + promoStatus.discount + ' off'}` : 'Invalid or expired promo code'}
                        </span>
                      )}
                    </div>

                    {/* Agreements */}
                    <div style={{ marginBottom: '1.25rem', padding: '1.25rem', backgroundColor: '#f8f5f0', border: '1px solid #e8ede8', borderRadius: '2px' }}>
                      <label className="check-wrap" style={{ marginBottom: '1rem' }}>
                        <input type="checkbox" {...register('agreeTerms')} />
                        <span className="font-cormorant" style={{ fontSize: '0.95rem', color: '#2a2420', lineHeight: 1.5 }}>
                          I agree to the{' '}
                          <a href="/terms" target="_blank" style={{ color: '#c4623a', textDecoration: 'none' }}>Terms of Service</a>
                          {' '}and the{' '}
                          <a href="/cancellation" target="_blank" style={{ color: '#c4623a', textDecoration: 'none' }}>Cancellation Policy</a>
                          <span className="required-star"> *</span>
                        </span>
                      </label>
                      {errors.agreeTerms && <span className="form-error">{errors.agreeTerms.message}</span>}

                      <label className="check-wrap">
                        <input type="checkbox" {...register('agreeSms')} />
                        <span className="font-cormorant" style={{ fontSize: '0.95rem', color: '#6a6460', lineHeight: 1.5 }}>
                          I'd like to receive SMS updates about my booking (optional)
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => setStep(s => s - 1)}
                      className="btn-outline-dark"
                      style={{ padding: '0.7rem 1.75rem' }}
                    >
                      ← Back
                    </button>
                  ) : <div />}

                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-terra"
                      style={{ padding: '0.7rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      Continue <ChevronRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn-terra"
                      disabled={submitting}
                      style={{ padding: '0.7rem 2rem', opacity: submitting ? 0.7 : 1 }}
                    >
                      {submitting ? 'Processing...' : 'Confirm & Pay →'}
                    </button>
                  )}
                </div>
              </div>

              {/* Price Summary Panel */}
              <div className="price-panel">
                <div style={{ backgroundColor: '#161210', borderRadius: '2px', padding: '1.75rem', color: '#fdfcfa' }}>
                  <p className="section-label" style={{ color: '#c4623a', marginBottom: '1rem' }}>Price Summary</p>

                  {/* Route */}
                  <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {watchedValues.pickupAddress && (
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', color: 'rgba(253,252,250,0.7)', marginBottom: '0.35rem' }}>
                        From: {watchedValues.pickupAddress}
                      </p>
                    )}
                    {watchedValues.dropoffAddress && (
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', color: 'rgba(253,252,250,0.7)' }}>
                        To: {watchedValues.dropoffAddress}
                      </p>
                    )}
                    {watchedValues.pickupDate && (
                      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: 'rgba(253,252,250,0.5)', letterSpacing: '0.08em', marginTop: '0.5rem' }}>
                        {watchedValues.pickupDate} · {watchedValues.pickupTime}
                      </p>
                    )}
                  </div>

                  {/* Vehicle Class */}
                  <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(253,252,250,0.5)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      Vehicle
                    </p>
                    <p className="font-cinzel" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fdfcfa' }}>
                      {VEHICLE_CLASSES.find(v => v.id === vehicleClass)?.name || 'Executive SUV'}
                    </p>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: 'rgba(253,252,250,0.5)', marginTop: '0.2rem' }}>
                      ~{ESTIMATED_MILES} miles estimated
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    {[
                      { label: 'Base Fare', amount: priceBreakdown.baseFare },
                      { label: `Distance (~${ESTIMATED_MILES} mi)`, amount: priceBreakdown.distanceFee },
                      ...(meetAndGreet ? [{ label: 'Meet & Greet', amount: priceBreakdown.meetGreetFee }] : []),
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', letterSpacing: '0.06em', color: 'rgba(253,252,250,0.6)' }}>
                          {item.label}
                        </span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', color: '#fdfcfa' }}>
                          ${item.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {promoStatus?.valid && priceBreakdown.promoDiscount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', color: '#7ecfa0' }}>Promo Discount</span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', color: '#7ecfa0' }}>−${priceBreakdown.promoDiscount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(253,252,250,0.7)' }}>
                        Estimated Total
                      </span>
                      <span className="price-total">${priceBreakdown.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', color: 'rgba(253,252,250,0.35)', letterSpacing: '0.06em', lineHeight: 1.5 }}>
                    Final price confirmed at booking. No surge pricing. Ever.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
