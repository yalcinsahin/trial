import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Percent, Globe, User, Gift, Check } from 'lucide-react';
import Footer from '../components/Footer';

const schema = z.object({
  agencyName: z.string().min(1, 'Required'),
  agencyWebsite: z.string().url('Valid URL required'),
  yearEstablished: z.string().min(1, 'Required'),
  numberOfAgents: z.string().min(1, 'Required'),
  businessAddress: z.string().min(1, 'Required'),
  businessCity: z.string().min(1, 'Required'),
  businessState: z.string().min(1, 'Required'),
  businessZip: z.string().min(1, 'Required'),
  businessCountry: z.string().min(1, 'Required'),
  contactFirstName: z.string().min(1, 'Required'),
  contactLastName: z.string().min(1, 'Required'),
  contactTitle: z.string().min(1, 'Required'),
  contactEmail: z.string().email('Valid email required'),
  confirmEmail: z.string().email(),
  contactPhone: z.string().min(10, 'Required'),
  preferredContact: z.string().min(1, 'Required'),
  monthlyBookings: z.string().min(1, 'Required'),
  averageBookingValue: z.string().min(1, 'Required'),
  howHeard: z.string().min(1, 'Required'),
  agreeAuthorized: z.boolean().refine(v => v, 'Required'),
  agreeTerms: z.boolean().refine(v => v, 'Required'),
  agreeContact: z.boolean().refine(v => v, 'Required'),
  signature: z.string().min(2, 'Required'),
}).refine(d => d.contactEmail === d.confirmEmail, { message: 'Emails must match', path: ['confirmEmail'] });

type FormData = z.infer<typeof schema>;

const BENEFITS = [
  { icon: Percent, title: 'Earn Commission', desc: 'Competitive per-booking commission on every ground transport reservation your clients make.' },
  { icon: Globe, title: 'White-Label Option', desc: 'Offer premium transportation under your own brand. We handle operations, you get the credit.' },
  { icon: User, title: 'Dedicated Account Manager', desc: 'Your personal point of contact for bookings, questions, and client escalations — always available.' },
  { icon: Gift, title: 'Real-Time Booking Portal', desc: 'Manage all client bookings, check status, and access reporting through your agency dashboard.' },
];

export default function TravelPartnersPage() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { businessCountry: 'United States', agreeAuthorized: false, agreeTerms: false, agreeContact: false },
  });

  const onSubmit = async (data: FormData) => {
    console.log('Agency application:', data);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#e8ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', backgroundColor: '#c4623a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Check size={20} color="white" />
          </div>
          <h1 className="font-cinzel" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#161210', marginBottom: '1rem' }}>
            Application Received
          </h1>
          <p className="font-cormorant" style={{ fontSize: '1.1rem', color: '#6a6460', lineHeight: 1.65 }}>
            Thank you for your interest in partnering with BookAirportRide. Your dedicated account manager will contact you within 2 business days to discuss next steps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Travel Agency Partners — BookAirportRide</title>
        <meta name="description" content="Partner with BookAirportRide. Earn commission on every ground transport booking for your clients." />
        <link rel="canonical" href="https://bookairportride.com/travel-partners" />
      </Helmet>

      {/* Benefits Section */}
      <section style={{ backgroundColor: '#e8ede8', padding: '8rem 1.5rem 5rem' }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10">
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Partnership Program</p>
            <h1 className="font-cinzel" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 700, color: '#161210', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Travel Agency<br />Partner Program
            </h1>
            <p className="font-cormorant" style={{ fontSize: '1.2rem', color: '#4a4540', lineHeight: 1.7 }}>
              Join our affiliate network and offer your clients premium black car airport service. Earn commission, access exclusive rates, and deliver a seamless ground transportation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ backgroundColor: '#fdfcfa', border: '1px solid #d4dfd4', borderRadius: '2px', padding: '1.75rem' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', backgroundColor: '#f0ede8', border: '1px solid #e8e0d8', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <b.icon size={14} color="#c4623a" />
                </div>
                <h3 className="font-cinzel" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#161210', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  {b.title}
                </h3>
                <p className="font-cormorant" style={{ fontSize: '1rem', color: '#6a6460', lineHeight: 1.6 }}>
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
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Agency Application</p>
            <h2 className="font-cinzel" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#161210', letterSpacing: '0.05em' }}>
              Apply to Become a Partner
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
            {/* Section 1: Agency Info */}
            <div style={{ padding: '1.75rem', border: '1px solid #e8ede8', borderRadius: '2px' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: '#161210', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                01 — Agency Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Agency Legal Name <span className="required-star">*</span></label>
                    <input {...register('agencyName')} className="form-input" />
                    {errors.agencyName && <span className="form-error">{errors.agencyName.message}</span>}
                  </div>
                  <div>
                    <label className="form-label">Agency Website <span className="required-star">*</span></label>
                    <input type="url" {...register('agencyWebsite')} className="form-input" placeholder="https://..." />
                    {errors.agencyWebsite && <span className="form-error">{errors.agencyWebsite.message}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Year Established <span className="required-star">*</span></label>
                    <select {...register('yearEstablished')} className="form-select">
                      <option value="">Select</option>
                      {Array.from({ length: new Date().getFullYear() - 1950 + 1 }, (_, i) => new Date().getFullYear() - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    {errors.yearEstablished && <span className="form-error">{errors.yearEstablished.message}</span>}
                  </div>
                  <div>
                    <label className="form-label">Number of Agents <span className="required-star">*</span></label>
                    <select {...register('numberOfAgents')} className="form-select">
                      <option value="">Select</option>
                      {['1', '2–5', '6–15', '16–50', '50+'].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    {errors.numberOfAgents && <span className="form-error">{errors.numberOfAgents.message}</span>}
                  </div>
                </div>
                <div>
                  <label className="form-label">Business Address <span className="required-star">*</span></label>
                  <input {...register('businessAddress')} className="form-input" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label className="form-label">City <span className="required-star">*</span></label>
                    <input {...register('businessCity')} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">State <span className="required-star">*</span></label>
                    <input {...register('businessState')} className="form-input" placeholder="State" />
                  </div>
                  <div>
                    <label className="form-label">ZIP <span className="required-star">*</span></label>
                    <input {...register('businessZip')} className="form-input" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Primary Contact */}
            <div style={{ padding: '1.75rem', border: '1px solid #e8ede8', borderRadius: '2px' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: '#161210', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                02 — Primary Contact
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">First Name <span className="required-star">*</span></label>
                    <input {...register('contactFirstName')} className="form-input" />
                    {errors.contactFirstName && <span className="form-error">{errors.contactFirstName.message}</span>}
                  </div>
                  <div>
                    <label className="form-label">Last Name <span className="required-star">*</span></label>
                    <input {...register('contactLastName')} className="form-input" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Title / Role <span className="required-star">*</span></label>
                  <input {...register('contactTitle')} className="form-input" placeholder="e.g. Owner, Booking Manager" />
                </div>
                <div>
                  <label className="form-label">Direct Email <span className="required-star">*</span></label>
                  <input type="email" {...register('contactEmail')} className="form-input" />
                  {errors.contactEmail && <span className="form-error">{errors.contactEmail.message}</span>}
                </div>
                <div>
                  <label className="form-label">Confirm Email <span className="required-star">*</span></label>
                  <input type="email" {...register('confirmEmail')} className="form-input" />
                  {errors.confirmEmail && <span className="form-error">{errors.confirmEmail.message}</span>}
                </div>
                <div>
                  <label className="form-label">Direct Phone <span className="required-star">*</span></label>
                  <input type="tel" {...register('contactPhone')} className="form-input" placeholder="(555) 000-0000" />
                  {errors.contactPhone && <span className="form-error">{errors.contactPhone.message}</span>}
                </div>
                <div>
                  <label className="form-label">Preferred Contact Method <span className="required-star">*</span></label>
                  <select {...register('preferredContact')} className="form-select">
                    <option value="">Select</option>
                    {['Email', 'Phone', 'Either'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Business Details */}
            <div style={{ padding: '1.75rem', border: '1px solid #e8ede8', borderRadius: '2px' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: '#161210', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                03 — Business Details
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="form-label">Monthly Ground Transport Bookings <span className="required-star">*</span></label>
                  <select {...register('monthlyBookings')} className="form-select">
                    <option value="">Select</option>
                    {['Under 10', '10–25', '26–50', '51–100', '100+'].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  {errors.monthlyBookings && <span className="form-error">{errors.monthlyBookings.message}</span>}
                </div>
                <div>
                  <label className="form-label">Average Booking Value <span className="required-star">*</span></label>
                  <select {...register('averageBookingValue')} className="form-select">
                    <option value="">Select</option>
                    {['Under $100', '$100–$250', '$250–$500', '$500–$1,000', 'Over $1,000'].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  {errors.averageBookingValue && <span className="form-error">{errors.averageBookingValue.message}</span>}
                </div>
                <div>
                  <label className="form-label">How Did You Hear About Us? <span className="required-star">*</span></label>
                  <select {...register('howHeard')} className="form-select">
                    <option value="">Select</option>
                    {['Google', 'Industry Event', 'Referral', 'Social Media', 'Trade Association', 'Other'].map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  {errors.howHeard && <span className="form-error">{errors.howHeard.message}</span>}
                </div>
              </div>
            </div>

            {/* Section 4: Preferences */}
            <div style={{ padding: '1.75rem', border: '1px solid #e8ede8', borderRadius: '2px' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: '#161210', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                04 — Partnership Preferences
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="form-label">Commission Structure Preference</label>
                  <select className="form-select">
                    <option value="">Select</option>
                    {['Per-booking commission', 'Monthly retainer + commission', 'Flat markup', "I'm not sure yet"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Interested in White-Label?</label>
                    <select className="form-select">
                      <option value="">Select</option>
                      {['Yes', 'No', 'Tell me more'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Interested in API Integration?</label>
                    <select className="form-select">
                      <option value="">Select</option>
                      {['Yes', 'No', 'What is this?'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Agreements */}
            <div style={{ padding: '1.75rem', border: '1px solid #e8ede8', borderRadius: '2px' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: '#161210', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                05 — Agreements
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { field: 'agreeAuthorized' as const, label: 'I am authorized to enter into partnership agreements on behalf of my agency.' },
                  { field: 'agreeTerms' as const, label: 'I agree to the BookAirportRide Affiliate Partner Terms and Conditions.' },
                  { field: 'agreeContact' as const, label: 'I consent to be contacted by the BookAirportRide partnership team.' },
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
                  <label className="form-label">Electronic Signature <span className="required-star">*</span></label>
                  <input
                    {...register('signature')}
                    className={`form-input ${errors.signature ? 'error' : ''}`}
                    placeholder="Type your full legal name"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.1rem' }}
                  />
                  {errors.signature && <span className="form-error">{errors.signature.message}</span>}
                  <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.6rem', color: '#a0a8a0', marginTop: '0.25rem' }}>
                    Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <button
                  type="submit"
                  className="btn-terra"
                  style={{ marginTop: '0.5rem', padding: '0.9rem', fontSize: '0.8rem', width: '100%' }}
                >
                  Submit Partnership Application
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
