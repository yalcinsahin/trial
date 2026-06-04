import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ReservePage from './pages/ReservePage'
import ServicesPage from './pages/ServicesPage'
import CitiesPage from './pages/CitiesPage'
import DriveWithUsPage from './pages/DriveWithUsPage'
import TravelPartnersPage from './pages/TravelPartnersPage'
import AboutPage from './pages/AboutPage'
import BookingConfirmationPage from './pages/BookingConfirmationPage'
import { TermsPage, PrivacyPage, CancellationPage } from './pages/LegalPages'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fdfcfa' }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reserve" element={<ReservePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/cities" element={<CitiesPage />} />
          <Route path="/drive-with-us" element={<DriveWithUsPage />} />
          <Route path="/travel-partners" element={<TravelPartnersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/booking-confirmation/:id" element={<BookingConfirmationPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cancellation" element={<CancellationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

function NotFound() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#161210', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: '5rem', fontWeight: 700, color: '#c4623a', lineHeight: 1 }}>404</p>
      <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 600, color: '#fdfcfa', marginTop: '1rem', marginBottom: '0.75rem' }}>Page Not Found</h1>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'rgba(253,252,250,0.6)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-terra">Return Home</a>
    </div>
  )
}
