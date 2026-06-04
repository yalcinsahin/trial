-- ============================================================
-- BookAirportRide — Seed Data
-- ============================================================

-- ─── Cities ──────────────────────────────────────────────────────────────────

INSERT INTO cities (id, name, state, slug, status, timezone, lat, lng, meta_title, meta_description)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Jacksonville',
    'FL',
    'jacksonville-fl',
    'live',
    'America/New_York',
    30.3322,
    -81.6557,
    'Luxury Airport Transfer Jacksonville FL | BookAirportRide',
    'Jacksonville''s premier luxury black car airport transportation. Fixed pricing, professional drivers, 24/7 availability. Book your JAX airport transfer today.'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Miami',
    'FL',
    'miami-fl',
    'coming_soon',
    'America/New_York',
    25.7617,
    -80.1918,
    'Luxury Airport Transfer Miami FL | BookAirportRide (Coming Soon)',
    'Premium black car airport transportation in Miami, FL — coming soon. Serving MIA and FLL airports.'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Orlando',
    'FL',
    'orlando-fl',
    'coming_soon',
    'America/New_York',
    28.5383,
    -81.3792,
    'Luxury Airport Transfer Orlando FL | BookAirportRide (Coming Soon)',
    'Premium black car airport transportation in Orlando, FL — coming soon. Serving MCO and SFB airports.'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Atlanta',
    'GA',
    'atlanta-ga',
    'coming_soon',
    'America/New_York',
    33.7490,
    -84.3880,
    'Luxury Airport Transfer Atlanta GA | BookAirportRide (Coming Soon)',
    'Premium black car airport transportation in Atlanta, GA — coming soon. Serving ATL airport.'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Charlotte',
    'NC',
    'charlotte-nc',
    'coming_soon',
    'America/New_York',
    35.2271,
    -80.8431,
    'Luxury Airport Transfer Charlotte NC | BookAirportRide (Coming Soon)',
    'Premium black car airport transportation in Charlotte, NC — coming soon. Serving CLT airport.'
  )
ON CONFLICT (slug) DO NOTHING;

-- ─── Airports ────────────────────────────────────────────────────────────────

INSERT INTO airports (id, city_id, name, iata_code, address, lat, lng, terminals)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Jacksonville International Airport',
    'JAX',
    '2400 Yankee Clipper Drive, Jacksonville, FL 32218',
    30.4941,
    -81.6879,
    ARRAY['Terminal A', 'Terminal B']
  )
ON CONFLICT (iata_code) DO NOTHING;

-- ─── Pricing Config — Jacksonville ───────────────────────────────────────────

INSERT INTO pricing_config (city_id, vehicle_class, base_fare, per_mile_rate, minimum_fare, airport_surcharge, late_night_surcharge, effective_from)
VALUES
  -- Standard Sedan
  (
    '11111111-1111-1111-1111-111111111111',
    'standard_sedan',
    65.00,
    2.50,
    65.00,
    15.00,
    10.00,
    '2024-01-01'
  ),
  -- Business Sedan
  (
    '11111111-1111-1111-1111-111111111111',
    'business_sedan',
    95.00,
    3.00,
    95.00,
    15.00,
    12.00,
    '2024-01-01'
  ),
  -- First Class SUV
  (
    '11111111-1111-1111-1111-111111111111',
    'first_class_suv',
    145.00,
    3.75,
    145.00,
    20.00,
    15.00,
    '2024-01-01'
  ),
  -- Luxury Van
  (
    '11111111-1111-1111-1111-111111111111',
    'luxury_van',
    195.00,
    4.50,
    195.00,
    25.00,
    20.00,
    '2024-01-01'
  )
ON CONFLICT (city_id, vehicle_class, effective_from) DO NOTHING;

-- ─── Promo Codes ─────────────────────────────────────────────────────────────

INSERT INTO promo_codes (
  code,
  description,
  discount_type,
  discount_value,
  minimum_booking_amount,
  usage_limit,
  valid_from,
  valid_to,
  is_active
)
VALUES
  (
    'WELCOME20',
    '20% off your first booking',
    'percentage',
    20.00,
    65.00,
    NULL,
    NOW(),
    NOW() + INTERVAL '365 days',
    true
  ),
  (
    'JAX15',
    '$15 off any Jacksonville transfer',
    'fixed',
    15.00,
    80.00,
    500,
    NOW(),
    NOW() + INTERVAL '180 days',
    true
  ),
  (
    'FIRSTCLASS',
    '10% off First Class SUV or Luxury Van',
    'percentage',
    10.00,
    145.00,
    200,
    NOW(),
    NOW() + INTERVAL '90 days',
    true
  )
ON CONFLICT (code) DO NOTHING;
