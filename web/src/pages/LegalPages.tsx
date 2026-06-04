import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';

function LegalPage({ title, canonical, children }: { title: string; canonical: string; children: React.ReactNode }) {
  return (
    <>
      <Helmet>
        <title>{title} — BookAirportRide</title>
        <link rel="canonical" href={`https://bookairportride.com${canonical}`} />
      </Helmet>
      <div className="page-header">
        <h1 className="font-cinzel" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 600, color: '#fdfcfa', letterSpacing: '0.04em' }}>
          {title}
        </h1>
        <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', color: 'rgba(253,252,250,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.75rem' }}>
          Last Updated: January 2025
        </p>
      </div>
      <div style={{ padding: '4rem 1.5rem 6rem', backgroundColor: '#fdfcfa' }}>
        <div className="max-w-3xl mx-auto" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#161210', marginBottom: '0.75rem', borderBottom: '1px solid #e8ede8', paddingBottom: '0.5rem' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '1.05rem', color: '#4a4540', lineHeight: 1.75, marginBottom: '1rem' }}>{children}</p>;
}

export function TermsPage() {
  return (
    <LegalPage title="Terms of Service" canonical="/terms">
      <Section title="1. Acceptance of Terms">
        <P>By using BookAirportRide services, booking a ride, or accessing our website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</P>
      </Section>
      <Section title="2. Service Description">
        <P>BookAirportRide provides premium black car airport transportation services connecting passengers with professional, licensed chauffeurs. We offer Executive SUV, First Class SUV, Executive Van, and VIP Sprinter service classes.</P>
        <P>All rides are pre-booked and confirmed in advance. We do not operate as an on-demand rideshare service.</P>
      </Section>
      <Section title="3. Booking and Payment">
        <P>All bookings must be made at least 2 hours in advance. Payment is collected at the time of booking via Stripe. We accept all major credit cards, Apple Pay, and Google Pay.</P>
        <P>Prices are fixed and displayed at the time of booking. There are no surge charges, hidden fees, or dynamic pricing. The price you confirm is the price you pay.</P>
      </Section>
      <Section title="4. Cancellation Policy">
        <P>Cancellations made more than 24 hours before the scheduled pickup receive a full refund. Cancellations made 12–24 hours before pickup receive a 50% refund. Cancellations within 12 hours of pickup are non-refundable.</P>
        <P>We reserve the right to cancel bookings due to vehicle unavailability, extreme weather, or other extraordinary circumstances. In such cases, a full refund will be issued.</P>
      </Section>
      <Section title="5. Driver Standards">
        <P>All BookAirportRide drivers are independently verified, background-checked, and hold valid commercial driver's licenses and appropriate insurance coverage. Drivers are not employees of BookAirportRide but independent contractors operating on our platform.</P>
      </Section>
      <Section title="6. Passenger Conduct">
        <P>Passengers are expected to treat drivers and vehicles with respect. Damage to vehicles caused by passengers will result in a cleaning or repair fee charged to the booking payment method. Intoxicated or abusive passengers may be refused service.</P>
      </Section>
      <Section title="7. Limitation of Liability">
        <P>BookAirportRide is not liable for delays caused by traffic, weather, flight delays, or other circumstances beyond our control. We are not responsible for lost or damaged luggage. Our liability is limited to the amount paid for the booking.</P>
      </Section>
      <Section title="8. Contact">
        <P>For questions about these terms, contact us at info@bookairportride.com.</P>
      </Section>
    </LegalPage>
  );
}

export function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" canonical="/privacy">
      <Section title="1. Information We Collect">
        <P>We collect information you provide directly: name, email address, phone number, payment information, and booking details. We also collect information automatically including IP address, browser type, and usage data through cookies and analytics tools.</P>
      </Section>
      <Section title="2. How We Use Your Information">
        <P>We use your information to process and fulfill bookings, communicate about your rides, send booking confirmations and receipts, improve our services, and comply with legal obligations. With your consent, we may also send promotional communications.</P>
      </Section>
      <Section title="3. Information Sharing">
        <P>We share your name and phone number with your assigned driver to facilitate the ride. We share payment information with Stripe for payment processing. We do not sell, rent, or share your personal information with third parties for marketing purposes.</P>
      </Section>
      <Section title="4. Data Security">
        <P>We use industry-standard encryption (TLS/SSL) to protect data in transit. Payment information is handled exclusively by Stripe and is never stored on our servers. We implement appropriate technical and organizational measures to protect your data.</P>
      </Section>
      <Section title="5. Your Rights (GDPR / CCPA)">
        <P>You have the right to access, correct, or delete your personal data. EU residents have additional rights under GDPR including data portability and the right to object to processing. California residents have rights under CCPA. To exercise these rights, contact privacy@bookairportride.com.</P>
      </Section>
      <Section title="6. Cookies">
        <P>We use essential cookies for site functionality and analytics cookies to understand how our site is used. You may disable non-essential cookies through your browser settings. We do not use advertising tracking cookies.</P>
      </Section>
      <Section title="7. Retention">
        <P>We retain your data for as long as necessary to provide services and comply with legal obligations. Booking records are retained for 7 years for accounting and compliance purposes.</P>
      </Section>
      <Section title="8. Contact">
        <P>For privacy inquiries, contact privacy@bookairportride.com.</P>
      </Section>
    </LegalPage>
  );
}

export function CancellationPage() {
  return (
    <LegalPage title="Cancellation Policy" canonical="/cancellation">
      <Section title="Our Cancellation Policy">
        <P>We understand that travel plans change. Our cancellation policy is designed to be fair while respecting the time our professional drivers commit to each booking.</P>
      </Section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { timing: 'More than 24 hours', refund: '100% Refund', color: '#2a7a4a', bg: '#f0faf5' },
          { timing: '12 to 24 hours', refund: '50% Refund', color: '#c4623a', bg: '#fff8f0' },
          { timing: 'Under 12 hours', refund: 'No Refund', color: '#e05c5c', bg: '#fff0f0' },
        ].map(tier => (
          <div key={tier.timing} style={{ backgroundColor: tier.bg, border: `1px solid ${tier.color}20`, borderRadius: '2px', padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a8480', marginBottom: '0.5rem' }}>
              {tier.timing}
            </p>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', fontWeight: 700, color: tier.color }}>
              {tier.refund}
            </p>
          </div>
        ))}
      </div>

      <Section title="How to Cancel">
        <P>To cancel a booking, log into your account at bookairportride.com and navigate to My Trips, or contact us at reservations@bookairportride.com with your booking reference number. Cancellations are processed immediately and refunds are returned to the original payment method within 5–10 business days.</P>
      </Section>
      <Section title="Modifications">
        <P>Booking modifications (changes to date, time, pickup/dropoff) are subject to availability and must be made at least 4 hours before the scheduled pickup. Modifications that result in a lower fare are refunded at the applicable rate. Additional charges for upgrades are billed to the original payment method.</P>
      </Section>
      <Section title="No-Show Policy">
        <P>If a passenger does not appear within 30 minutes of the scheduled pickup time and has not contacted the driver or BookAirportRide, the booking will be marked as a no-show. No-shows are treated as cancellations under 12 hours and are non-refundable.</P>
      </Section>
      <Section title="Driver Cancellations">
        <P>In the rare event that BookAirportRide must cancel your booking due to driver unavailability or operational issues, you will receive a full refund and a $25 credit toward your next booking. We will make every effort to find an alternative driver or notify you as early as possible.</P>
      </Section>
      <Section title="Contact">
        <P>Cancellation and modification requests: reservations@bookairportride.com or (904) 000-0000.</P>
      </Section>
    </LegalPage>
  );
}
