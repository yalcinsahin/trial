import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, Calendar, CreditCard, Star, Upload, Check, X } from 'lucide-react';
import Footer from '../components/Footer';
import { US_STATES, JACKSONVILLE_AIRPORTS } from '../constants/cities';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  confirmEmail: z.string().email(),
  phone: z.string().min(10, 'Valid phone required'),
  dateOfBirth: z.string().min(1, 'Required'),
  homeAddress: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  zip: z.string().min(5, 'Required'),
  ssnLast4: z.string().length(4, 'Must be exactly 4 digits').regex(/^\d{4}$/, 'Digits only'),
  emergencyContactName: z.string().min(1, 'Required'),
  emergencyContactPhone: z.string().min(10, 'Required'),
  emergencyContactRelationship: z.string().min(1, 'Required'),
  yearsDriving: z.string().min(1, 'Required'),
  hasDUI: z.boolean(),
  atFaultAccidents: z.boolean(),
  movingViolations: z.boolean(),
  primaryCity: z.string().min(1, 'Required'),
  primaryState: z.string().min(1, 'Required'),
  airportsToServe: z.array(z.string()).min(1, 'Select at least one airport'),
  vehicleYear: z.string().min(4),
  vehicleMake: z.string().min(1, 'Required'),
  vehicleModel: z.string().min(1, 'Required'),
  vehicleColor: z.string().min(1, 'Required'),
  vehicleVin: z.string().length(17, 'VIN must be 17 characters'),
  vehiclePlate: z.string().min(1, 'Required'),
  vehiclePlateState: z.string().min(1, 'Required'),
  seatingCapacity: z.string().min(1, 'Required'),
  dlNumber: z.string().min(1, 'Required'),
  dlState: z.string().min(1, 'Required'),
  dlExpiry: z.string().min(1, 'Required'),
  insuranceProvider: z.string().min(1, 'Required'),
  insurancePolicyNumber: z.string().min(1, 'Required'),
  insuranceExpiry: z.string().min(1, 'Required'),
  coverageType: z.string().min(1, 'Required'),
  liabilityCoverage: z.string().min(1, 'Required'),
  agreeAccurate: z.boolean().refine(v => v, 'Required'),
  agreeBackgroundCheck: z.boolean().refine(v => v, 'Required'),
  agreePartnerAgreement: z.boolean().refine(v => v, 'Required'),
  agreeInsurance: z.boolean().refine(v => v, 'Required'),
  agreePlatformFee: z.boolean().refine(v => v, 'Required'),
  signature: z.string().min(2, 'Electronic signature required'),
}).refine(d => d.email === d.confirmEmail, { message: 'Emails must match', path: ['confirmEmail'] });

type FormData = z.infer<typeof schema>;

const BENEFITS = [
  { icon: DollarSign, title: 'Earn More Per Ride', desc: 'Keep 80% of every fare. Top drivers earn $60,000+ annually.' },
  { icon: Calendar, title: 'Flexible Schedule', desc: 'Work when you want. Set your own availability and never be forced to accept a ride.' },
  { icon: CreditCard, title: 'Weekly Direct Deposit', desc: 'Earnings deposited every Monday directly to your bank account via Stripe.' },
  { icon: Star, title: 'Elite Brand Association', desc: 'Represent Jacksonville\'s premium black car service and build a loyal client base.' },
];

type DropState = { file: File | null; dragging: boolean };

function DropZone({ label, required, accept, onFile }: { label: string; required: boolean; accept: string; onFile: (f: File) => void }) {
  const [state, setState] = useState<DropState>({ file: null, dragging: false });

  return (
    <div>
      <label className="form-label">{label}{required && <span className="required-star"> *</span>}</label>
      <div
        className={`drop-zone ${state.dragging ? 'drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setState(s => ({ ...s, dragging: true })); }}
        onDragLeave={() => setState(s => ({ ...s, dragging: false }))}
        onDrop={e => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) { setState({ file: f, dragging: false }); onFile(f); }
        }}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = accept;
          input.onchange = (e: any) => {
            const f = e.target.files?.[0];
            if (f) { setState(s => ({ ...s, file: f })); onFile(f); }
          };
          input.click();
        }}
      >
        {state.file ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Check size={14} color="#2a7a4a" />
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.75rem', color: '#2a7a4a' }}>{state.file.name}</span>
            <button type="button" onClick={e => { e.stopPropagation(); setState({ file: null, dragging: false }); }}><X size={12} color="#e05c5c" /></button>
          </div>
        ) : (
          <>
            <Upload size={20} color="#c2d0c2" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', color: '#a0a8a0', letterSpacing: '0.08em' }}>
              Drag & drop or click to upload
            </p>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', color: '#c2d0c2', marginTop: '0.25rem' }}>
              {accept.split(',').join(', ')} · Max 10MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const SECTION_TITLES = [
  'Personal Information',
  'Driving Experience',
  'Cities & Airports',
  'Vehicle Information',
  'Insurance & Licensing',
  'Document Uploads',
  'Agreements',
];

export default function DriveWithUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [openSection, setOpenSection] = useState(0);

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      hasDUI: false,
      atFaultAccidents: false,
      movingViolations: false,
      airportsToServe: [],
      agreeAccurate: false,
      agreeBackgroundCheck: false,
      agreePartnerAgreement: false,
      agreeInsurance: false,
      agreePlatformFee: false,
    },
  });

  const hasDUI = watch('hasDUI');

  const onSubmit = async (data: FormData) => {
    console.log('Driver application:', data);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#161210', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: 'rgba(196,98,58,0.15)', border: '1px solid #c4623a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Check size={22} color="#c4623a" />
          </div>
          <h1 className="font-cinzel" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#fdfcfa', marginBottom: '1rem' }}>
            Application Received
          </h1>
          <p className="font-cormorant" style={{ fontSize: '1.1rem', color: 'rgba(253,252,250,0.65)', lineHeight: 1.65 }}>
            Thank you for applying to drive with BookAirportRide. Our team will review your application within 3–5 business days and contact you at the email provided.
          </p>
          <div style={{ marginTop: '2rem', padding: '1.25rem', backgroundColor: 'rgba(253,252,250,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px' }}>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: 'rgba(253,252,250,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              What Happens Next
            </p>
            <p className="font-cormorant" style={{ fontSize: '1rem', color: 'rgba(253,252,250,0.6)', marginTop: '0.5rem', lineHeight: 1.6 }}>
              1. Application review (3–5 business days)<br />
              2. Background & MVR check<br />
              3. Vehicle inspection coordination<br />
              4. Account activation & onboarding
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Drive With BookAirportRide — Partner With Us</title>
        <meta name="description" content="Join our elite driver network. Earn more driving for BookAirportRide. Apply today." />
        <link rel="canonical" href="https://bookairportride.com/drive-with-us" />
      </Helmet>

      {/* Hero */}
      <section style={{ backgroundColor: '#161210', padding: '8rem 1.5rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(196,98,58,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
          <div className="max-w-3xl">
            <p className="section-label fade-up-1" style={{ color: '#c4623a', marginBottom: '1rem' }}>Join the Team</p>
            <h1 className="font-cinzel fade-up-2" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, color: '#fdfcfa', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Drive With<br /><span style={{ color: '#c4623a' }}>BookAirportRide</span>
            </h1>
            <p className="font-cormorant fade-up-3" style={{ fontSize: '1.2rem', color: 'rgba(253,252,250,0.7)', lineHeight: 1.65, maxWidth: '520px', marginBottom: '3rem' }}>
              Represent Jacksonville's most prestigious black car service. Earn premium rates, set your own schedule, and build lasting relationships with elite clientele.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                style={{ backgroundColor: 'rgba(253,252,250,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px', padding: '1.5rem' }}
              >
                <b.icon size={18} color="#c4623a" style={{ marginBottom: '0.75rem' }} />
                <h3 className="font-cinzel" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fdfcfa', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  {b.title}
                </h3>
                <p className="font-cormorant" style={{ fontSize: '0.95rem', color: 'rgba(253,252,250,0.55)', lineHeight: 1.55 }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section style={{ padding: '4rem 1.5rem 6rem', backgroundColor: '#fdfcfa' }}>
        <div className="max-w-3xl mx-auto">
          <div style={{ marginBottom: '2.5rem' }}>
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Driver Application</p>
            <h2 className="font-cinzel" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#161210', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Apply to Join Our Fleet
            </h2>
            <p className="font-cormorant" style={{ fontSize: '1.05rem', color: '#6a6460', lineHeight: 1.6 }}>
              Please complete all sections accurately. All information is encrypted and kept confidential.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Section Accordion */}
            {SECTION_TITLES.map((title, sIdx) => (
              <div key={sIdx} style={{ marginBottom: '0.75rem', border: '1px solid #e8ede8', borderRadius: '2px', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === sIdx ? -1 : sIdx)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    backgroundColor: openSection === sIdx ? '#161210' : '#f8f5f0',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', fontWeight: 600, color: openSection === sIdx ? '#c4623a' : '#8a8480' }}>
                      0{sIdx + 1}
                    </span>
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: openSection === sIdx ? '#fdfcfa' : '#161210' }}>
                      {title}
                    </span>
                  </div>
                  <span style={{ color: openSection === sIdx ? '#c4623a' : '#a0a8a0', fontSize: '1rem' }}>
                    {openSection === sIdx ? '−' : '+'}
                  </span>
                </button>

                {openSection === sIdx && (
                  <div style={{ padding: '1.75rem' }}>
                    {/* SECTION 1: PERSONAL */}
                    {sIdx === 0 && (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">First Name <span className="required-star">*</span></label>
                            <input {...register('firstName')} className={`form-input ${errors.firstName ? 'error' : ''}`} />
                            {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                          </div>
                          <div>
                            <label className="form-label">Last Name <span className="required-star">*</span></label>
                            <input {...register('lastName')} className={`form-input ${errors.lastName ? 'error' : ''}`} />
                            {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Email <span className="required-star">*</span></label>
                          <input type="email" {...register('email')} className={`form-input ${errors.email ? 'error' : ''}`} />
                          {errors.email && <span className="form-error">{errors.email.message}</span>}
                        </div>
                        <div>
                          <label className="form-label">Confirm Email <span className="required-star">*</span></label>
                          <input type="email" {...register('confirmEmail')} className={`form-input ${errors.confirmEmail ? 'error' : ''}`} />
                          {errors.confirmEmail && <span className="form-error">{errors.confirmEmail.message}</span>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Phone <span className="required-star">*</span></label>
                            <input type="tel" {...register('phone')} className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="(555) 000-0000" />
                            {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                          </div>
                          <div>
                            <label className="form-label">Date of Birth <span className="required-star">*</span></label>
                            <input type="date" {...register('dateOfBirth')} className={`form-input ${errors.dateOfBirth ? 'error' : ''}`} max={new Date(Date.now() - 21 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0]} />
                            {errors.dateOfBirth && <span className="form-error">Must be 21 or older</span>}
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Home Address <span className="required-star">*</span></label>
                          <input {...register('homeAddress')} className="form-input" placeholder="Street address" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="form-label">City <span className="required-star">*</span></label>
                            <input {...register('city')} className="form-input" />
                          </div>
                          <div>
                            <label className="form-label">State <span className="required-star">*</span></label>
                            <select {...register('state')} className="form-select">
                              <option value="">State</option>
                              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="form-label">ZIP <span className="required-star">*</span></label>
                            <input {...register('zip')} className="form-input" maxLength={10} />
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Social Security — Last 4 Digits <span className="required-star">*</span></label>
                          <input {...register('ssnLast4')} className={`form-input ${errors.ssnLast4 ? 'error' : ''}`} maxLength={4} placeholder="XXXX" style={{ maxWidth: '8rem' }} />
                          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', color: '#a0a8a0', marginTop: '0.25rem' }}>Used for background check only — encrypted and never stored in plain text.</p>
                          {errors.ssnLast4 && <span className="form-error">{errors.ssnLast4.message}</span>}
                        </div>
                        <div style={{ padding: '1.25rem', backgroundColor: '#f8f5f0', border: '1px solid #e8ede8', borderRadius: '2px' }}>
                          <p className="form-label" style={{ marginBottom: '1rem' }}>Emergency Contact</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="form-label">Name <span className="required-star">*</span></label>
                              <input {...register('emergencyContactName')} className="form-input" />
                            </div>
                            <div>
                              <label className="form-label">Phone <span className="required-star">*</span></label>
                              <input type="tel" {...register('emergencyContactPhone')} className="form-input" placeholder="(555) 000-0000" />
                            </div>
                            <div className="col-span-2">
                              <label className="form-label">Relationship <span className="required-star">*</span></label>
                              <select {...register('emergencyContactRelationship')} className="form-select">
                                <option value="">Select</option>
                                {['Spouse', 'Parent', 'Sibling', 'Friend', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 2: DRIVING EXPERIENCE */}
                    {sIdx === 1 && (
                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <label className="form-label">Years of Professional Driving <span className="required-star">*</span></label>
                          <select {...register('yearsDriving')} className={`form-select ${errors.yearsDriving ? 'error' : ''}`}>
                            <option value="">Select</option>
                            {['Under 1 year', '1–2 years', '3–5 years', '5–10 years', '10+ years'].map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                          {errors.yearsDriving && <span className="form-error">{errors.yearsDriving.message}</span>}
                        </div>

                        {/* DUI — disqualifying */}
                        <div style={{ padding: '1.25rem', backgroundColor: hasDUI ? 'rgba(224,92,92,0.05)' : '#f8f5f0', border: `1px solid ${hasDUI ? '#e05c5c' : '#e8ede8'}`, borderRadius: '2px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', color: '#161210' }}>
                                Any DUI or DWI convictions? <span className="required-star">*</span>
                              </p>
                              {hasDUI && <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#e05c5c', marginTop: '0.25rem' }}>⚠ DUI/DWI convictions are automatically disqualifying.</p>}
                            </div>
                            <Controller
                              name="hasDUI"
                              control={control}
                              render={({ field }) => (
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                  {(['Yes', 'No'] as const).map(opt => (
                                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem' }}>
                                      <input type="radio" checked={field.value === (opt === 'Yes')} onChange={() => field.onChange(opt === 'Yes')} />
                                      {opt}
                                    </label>
                                  ))}
                                </div>
                              )}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="form-label">At-fault accidents in last 3 years?</label>
                          <Controller name="atFaultAccidents" control={control} render={({ field }) => (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                              {(['Yes', 'No'] as const).map(opt => (
                                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem' }}>
                                  <input type="radio" checked={field.value === (opt === 'Yes')} onChange={() => field.onChange(opt === 'Yes')} />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          )} />
                        </div>

                        <div>
                          <label className="form-label">Moving violations in last 3 years?</label>
                          <Controller name="movingViolations" control={control} render={({ field }) => (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                              {(['Yes', 'No'] as const).map(opt => (
                                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem' }}>
                                  <input type="radio" checked={field.value === (opt === 'Yes')} onChange={() => field.onChange(opt === 'Yes')} />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          )} />
                        </div>
                      </div>
                    )}

                    {/* SECTION 3: CITIES */}
                    {sIdx === 2 && (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Primary City <span className="required-star">*</span></label>
                            <input {...register('primaryCity')} className="form-input" defaultValue="Jacksonville" />
                          </div>
                          <div>
                            <label className="form-label">State <span className="required-star">*</span></label>
                            <select {...register('primaryState')} className="form-select">
                              <option value="">State</option>
                              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Airports to Serve <span className="required-star">*</span></label>
                          <Controller
                            name="airportsToServe"
                            control={control}
                            render={({ field }) => (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {JACKSONVILLE_AIRPORTS.map(ap => (
                                  <label key={ap.iata} className="check-wrap" style={{ cursor: 'pointer' }}>
                                    <input
                                      type="checkbox"
                                      checked={field.value.includes(ap.iata)}
                                      onChange={e => {
                                        if (e.target.checked) field.onChange([...field.value, ap.iata]);
                                        else field.onChange(field.value.filter((v: string) => v !== ap.iata));
                                      }}
                                    />
                                    <span className="font-cormorant" style={{ fontSize: '1rem', color: '#161210' }}>
                                      {ap.name} ({ap.iata})
                                    </span>
                                  </label>
                                ))}
                              </div>
                            )}
                          />
                          {errors.airportsToServe && <span className="form-error">{errors.airportsToServe.message}</span>}
                        </div>
                      </div>
                    )}

                    {/* SECTION 4: VEHICLE */}
                    {sIdx === 3 && (
                      <div className="grid grid-cols-1 gap-4">
                        <div style={{ padding: '0.75rem', backgroundColor: '#fff8f0', border: '1px solid #f0d8c8', borderRadius: '2px' }}>
                          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: '#c4623a', letterSpacing: '0.08em' }}>
                            Vehicles must be 2018 or newer. Black, Midnight Blue, Dark Gray, Pearl White, Champagne, or Silver only.
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="form-label">Year <span className="required-star">*</span></label>
                            <select {...register('vehicleYear')} className="form-select">
                              <option value="">Year</option>
                              {Array.from({ length: new Date().getFullYear() - 2017 }, (_, i) => 2018 + i).reverse().map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Make <span className="required-star">*</span></label>
                            <input {...register('vehicleMake')} className="form-input" placeholder="e.g. Mercedes-Benz" />
                          </div>
                          <div>
                            <label className="form-label">Model <span className="required-star">*</span></label>
                            <input {...register('vehicleModel')} className="form-input" placeholder="e.g. GLS 580" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Color <span className="required-star">*</span></label>
                            <select {...register('vehicleColor')} className="form-select">
                              <option value="">Select color</option>
                              {['Black', 'Midnight Blue', 'Dark Gray', 'Pearl White', 'Champagne', 'Silver', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Seating Capacity <span className="required-star">*</span></label>
                            <select {...register('seatingCapacity')} className="form-select">
                              <option value="">Select</option>
                              {[4, 6, 7, 10, 12, 14].map(n => <option key={n} value={n}>{n} passengers</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="form-label">VIN Number <span className="required-star">*</span></label>
                          <input {...register('vehicleVin')} className={`form-input ${errors.vehicleVin ? 'error' : ''}`} placeholder="17-character VIN" maxLength={17} />
                          {errors.vehicleVin && <span className="form-error">{errors.vehicleVin.message}</span>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">License Plate <span className="required-star">*</span></label>
                            <input {...register('vehiclePlate')} className="form-input" />
                          </div>
                          <div>
                            <label className="form-label">Plate State <span className="required-star">*</span></label>
                            <select {...register('vehiclePlateState')} className="form-select">
                              <option value="">State</option>
                              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="form-label" style={{ marginBottom: '0.75rem' }}>Vehicle Amenities</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Leather Interior', 'Rear Climate Control', 'Tinted Windows', 'Partition', 'WiFi', 'Charging Ports'].map(a => (
                              <label key={a} className="check-wrap" style={{ cursor: 'pointer' }}>
                                <input type="checkbox" />
                                <span className="font-cormorant" style={{ fontSize: '1rem', color: '#161210' }}>{a}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 5: INSURANCE */}
                    {sIdx === 4 && (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Driver's License Number <span className="required-star">*</span></label>
                            <input {...register('dlNumber')} className="form-input" />
                          </div>
                          <div>
                            <label className="form-label">DL State <span className="required-star">*</span></label>
                            <select {...register('dlState')} className="form-select">
                              <option value="">State</option>
                              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="form-label">License Expiration <span className="required-star">*</span></label>
                          <input type="date" {...register('dlExpiry')} className="form-input" min={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Insurance Provider <span className="required-star">*</span></label>
                            <input {...register('insuranceProvider')} className="form-input" />
                          </div>
                          <div>
                            <label className="form-label">Policy Number <span className="required-star">*</span></label>
                            <input {...register('insurancePolicyNumber')} className="form-input" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Insurance Expiry <span className="required-star">*</span></label>
                            <input type="date" {...register('insuranceExpiry')} className="form-input" min={new Date().toISOString().split('T')[0]} />
                          </div>
                          <div>
                            <label className="form-label">Coverage Type <span className="required-star">*</span></label>
                            <select {...register('coverageType')} className="form-select">
                              <option value="">Select</option>
                              {['Personal', 'Commercial', 'Livery/TNC'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Liability Coverage Amount <span className="required-star">*</span></label>
                          <select {...register('liabilityCoverage')} className="form-select">
                            <option value="">Select</option>
                            {['$100,000', '$300,000', '$500,000', '$1,000,000+'].map(a => <option key={a} value={a}>{a}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* SECTION 6: DOCUMENTS */}
                    {sIdx === 5 && (
                      <div className="grid grid-cols-1 gap-4">
                        <p className="font-cormorant" style={{ fontSize: '1rem', color: '#6a6460', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                          All documents are stored securely in encrypted cloud storage. Accepted formats: JPG, PNG, PDF. Maximum 10MB each.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <DropZone label="Profile Photo (Professional Headshot)" required accept="image/jpg,image/png" onFile={f => console.log(f)} />
                          <DropZone label="Driver's License — Front" required accept="image/jpg,image/png,.pdf" onFile={f => console.log(f)} />
                          <DropZone label="Driver's License — Back" required accept="image/jpg,image/png,.pdf" onFile={f => console.log(f)} />
                          <DropZone label="Vehicle Registration" required accept="image/jpg,image/png,.pdf" onFile={f => console.log(f)} />
                          <DropZone label="Proof of Insurance" required accept="image/jpg,image/png,.pdf" onFile={f => console.log(f)} />
                          <DropZone label="Vehicle Inspection Report" required accept="image/jpg,image/png,.pdf" onFile={f => console.log(f)} />
                          <DropZone label="Vehicle Photo — Exterior Front" required accept="image/jpg,image/png" onFile={f => console.log(f)} />
                          <DropZone label="Vehicle Photo — Interior Rear Seats" required accept="image/jpg,image/png" onFile={f => console.log(f)} />
                        </div>
                      </div>
                    )}

                    {/* SECTION 7: AGREEMENTS */}
                    {sIdx === 6 && (
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { field: 'agreeAccurate' as const, label: 'All information provided in this application is accurate and truthful.' },
                          { field: 'agreeBackgroundCheck' as const, label: 'I consent to a background check and Motor Vehicle Record (MVR) check.' },
                          { field: 'agreePartnerAgreement' as const, label: 'I agree to the BookAirportRide Driver Partner Agreement.' },
                          { field: 'agreeInsurance' as const, label: 'I agree to maintain commercial insurance coverage at all times while driving on the platform.' },
                          { field: 'agreePlatformFee' as const, label: 'I understand that BookAirportRide retains a 20% platform fee on each completed ride.' },
                        ].map(({ field, label }) => (
                          <div key={field}>
                            <label className="check-wrap">
                              <input type="checkbox" {...register(field)} />
                              <span className="font-cormorant" style={{ fontSize: '1rem', color: '#2a2420', lineHeight: 1.5 }}>
                                {label} <span className="required-star">*</span>
                              </span>
                            </label>
                            {errors[field] && <span className="form-error">Required</span>}
                          </div>
                        ))}

                        <div style={{ marginTop: '0.5rem' }}>
                          <label className="form-label">Electronic Signature — Type Your Full Legal Name <span className="required-star">*</span></label>
                          <input
                            {...register('signature')}
                            className={`form-input ${errors.signature ? 'error' : ''}`}
                            placeholder="Full Legal Name"
                            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.1rem' }}
                          />
                          {errors.signature && <span className="form-error">{errors.signature.message}</span>}
                          <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', color: '#a0a8a0', marginTop: '0.35rem' }}>
                            Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>

                        <button
                          type="submit"
                          className="btn-terra"
                          style={{ marginTop: '1rem', width: '100%', padding: '0.9rem', fontSize: '0.8rem' }}
                        >
                          Submit Driver Application
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
