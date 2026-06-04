-- BookAirportRide — Seed Data

-- ────────────────────────────────────────────────────────────
-- CITIES
-- ────────────────────────────────────────────────────────────
INSERT INTO cities (name, state, country, slug, status, launch_date) VALUES
  ('Jacksonville', 'FL', 'United States', 'jacksonville-fl', 'live', '2024-01-01'),
  ('Miami', 'FL', 'United States', 'miami-fl', 'coming_soon', NULL),
  ('Orlando', 'FL', 'United States', 'orlando-fl', 'coming_soon', NULL),
  ('Atlanta', 'GA', 'United States', 'atlanta-ga', 'coming_soon', NULL),
  ('New York', 'NY', 'United States', 'new-york-ny', 'coming_soon', NULL),
  ('Los Angeles', 'CA', 'United States', 'los-angeles-ca', 'coming_soon', NULL),
  ('Chicago', 'IL', 'United States', 'chicago-il', 'coming_soon', NULL),
  ('Dallas', 'TX', 'United States', 'dallas-tx', 'coming_soon', NULL),
  ('Houston', 'TX', 'United States', 'houston-tx', 'coming_soon', NULL),
  ('Las Vegas', 'NV', 'United States', 'las-vegas-nv', 'coming_soon', NULL),
  ('Nashville', 'TN', 'United States', 'nashville-tn', 'coming_soon', NULL),
  ('Charlotte', 'NC', 'United States', 'charlotte-nc', 'coming_soon', NULL),
  ('Washington', 'DC', 'United States', 'washington-dc', 'coming_soon', NULL),
  ('Boston', 'MA', 'United States', 'boston-ma', 'coming_soon', NULL),
  ('San Francisco', 'CA', 'United States', 'san-francisco-ca', 'coming_soon', NULL),
  ('London', NULL, 'United Kingdom', 'london-uk', 'coming_soon', NULL),
  ('Paris', NULL, 'France', 'paris-france', 'coming_soon', NULL),
  ('Dubai', NULL, 'UAE', 'dubai-uae', 'coming_soon', NULL),
  ('Frankfurt', NULL, 'Germany', 'frankfurt-germany', 'coming_soon', NULL),
  ('Istanbul', NULL, 'Turkey', 'istanbul-turkey', 'coming_soon', NULL),
  ('Barcelona', NULL, 'Spain', 'barcelona-spain', 'coming_soon', NULL),
  ('Madrid', NULL, 'Spain', 'madrid-spain', 'coming_soon', NULL),
  ('Cairo', NULL, 'Egypt', 'cairo-egypt', 'coming_soon', NULL),
  ('Sydney', NULL, 'Australia', 'sydney-australia', 'coming_soon', NULL);

-- ────────────────────────────────────────────────────────────
-- JACKSONVILLE AIRPORTS
-- ────────────────────────────────────────────────────────────
INSERT INTO airports (city_id, name, iata_code, terminal_notes, is_active)
SELECT c.id, 'Jacksonville International Airport', 'JAX', 'Main terminal — pickup at Ground Transportation level', TRUE
FROM cities c WHERE c.slug = 'jacksonville-fl';

INSERT INTO airports (city_id, name, iata_code, terminal_notes, is_active)
SELECT c.id, 'Craig Municipal Airport', 'CRG', 'FBO terminal — call ahead for gate access', TRUE
FROM cities c WHERE c.slug = 'jacksonville-fl';

-- ────────────────────────────────────────────────────────────
-- PRICING CONFIG — JACKSONVILLE
-- ────────────────────────────────────────────────────────────
INSERT INTO pricing_config (city_id, vehicle_class, base_fare, per_mile_rate, minimum_fare, airport_surcharge)
SELECT c.id, 'executive-suv', 65.00, 3.25, 85.00, 0.00 FROM cities c WHERE c.slug = 'jacksonville-fl';

INSERT INTO pricing_config (city_id, vehicle_class, base_fare, per_mile_rate, minimum_fare, airport_surcharge)
SELECT c.id, 'first-class-suv', 85.00, 4.00, 110.00, 0.00 FROM cities c WHERE c.slug = 'jacksonville-fl';

INSERT INTO pricing_config (city_id, vehicle_class, base_fare, per_mile_rate, minimum_fare, airport_surcharge)
SELECT c.id, 'executive-van', 95.00, 4.50, 125.00, 0.00 FROM cities c WHERE c.slug = 'jacksonville-fl';

INSERT INTO pricing_config (city_id, vehicle_class, base_fare, per_mile_rate, minimum_fare, airport_surcharge)
SELECT c.id, 'vip-sprinter', 125.00, 5.50, 165.00, 0.00 FROM cities c WHERE c.slug = 'jacksonville-fl';

-- ────────────────────────────────────────────────────────────
-- PROMO CODES
-- ────────────────────────────────────────────────────────────
INSERT INTO promo_codes (code, discount_type, discount_value, expiry_date, max_uses, is_active) VALUES
  ('WELCOME10', 'percent', 10.00, '2025-12-31', 1000, TRUE),
  ('FIRST25', 'fixed', 25.00, '2025-12-31', 500, TRUE),
  ('JAX20', 'fixed', 20.00, '2025-06-30', 200, TRUE);
