import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

export default function BookingWidget({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    passengers: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      pickup: form.pickup,
      dropoff: form.dropoff,
      date: form.date,
      time: form.time,
      passengers: String(form.passengers),
    });
    navigate(`/reserve?${params}`);
  };

  const inputBg = dark ? '#1e1a18' : '#fdfcfa';
  const inputBorder = dark ? 'rgba(255,255,255,0.15)' : '#c2d0c2';
  const inputColor = dark ? '#fdfcfa' : '#161210';
  const labelColor = dark ? 'rgba(253,252,250,0.6)' : '#1e1a18';

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        {/* Pickup */}
        <div className="lg:col-span-1">
          <label style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: labelColor, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
            <MapPin size={10} color="#c4623a" /> Pickup
          </label>
          <input
            type="text"
            placeholder="Address or airport"
            value={form.pickup}
            onChange={e => setForm({ ...form, pickup: e.target.value })}
            style={{
              width: '100%', background: inputBg, border: `1px solid ${inputBorder}`,
              borderRadius: '2px', padding: '0.6rem 0.75rem',
              fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', color: inputColor,
            }}
          />
        </div>

        {/* Dropoff */}
        <div className="lg:col-span-1">
          <label style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: labelColor, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
            <MapPin size={10} color="#c4623a" /> Drop-off
          </label>
          <input
            type="text"
            placeholder="Address or airport"
            value={form.dropoff}
            onChange={e => setForm({ ...form, dropoff: e.target.value })}
            style={{
              width: '100%', background: inputBg, border: `1px solid ${inputBorder}`,
              borderRadius: '2px', padding: '0.6rem 0.75rem',
              fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', color: inputColor,
            }}
          />
        </div>

        {/* Date */}
        <div>
          <label style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: labelColor, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
            <Calendar size={10} color="#c4623a" /> Date
          </label>
          <input
            type="date"
            value={form.date}
            min={new Date(Date.now() + 2 * 3600 * 1000).toISOString().split('T')[0]}
            onChange={e => setForm({ ...form, date: e.target.value })}
            style={{
              width: '100%', background: inputBg, border: `1px solid ${inputBorder}`,
              borderRadius: '2px', padding: '0.6rem 0.75rem',
              fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.8rem', color: inputColor,
            }}
          />
        </div>

        {/* Time */}
        <div>
          <label style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: labelColor, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
            <Clock size={10} color="#c4623a" /> Time
          </label>
          <input
            type="time"
            value={form.time}
            onChange={e => setForm({ ...form, time: e.target.value })}
            step={900}
            style={{
              width: '100%', background: inputBg, border: `1px solid ${inputBorder}`,
              borderRadius: '2px', padding: '0.6rem 0.75rem',
              fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.8rem', color: inputColor,
            }}
          />
        </div>

        {/* Passengers */}
        <div>
          <label style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: labelColor, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
            <Users size={10} color="#c4623a" /> Passengers
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              value={form.passengers}
              onChange={e => setForm({ ...form, passengers: Number(e.target.value) })}
              style={{
                flex: 1, background: inputBg, border: `1px solid ${inputBorder}`,
                borderRadius: '2px', padding: '0.6rem 0.75rem',
                fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.8rem', color: inputColor,
                appearance: 'none',
              }}
            >
              {Array.from({ length: 14 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</option>
              ))}
            </select>
            <button type="submit" className="btn-terra" style={{ padding: '0.6rem 1.25rem', whiteSpace: 'nowrap' }}>
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
