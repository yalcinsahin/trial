-- ============================================================
-- BookAirportRide — Initial Schema
-- Migration 001: Core tables
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('passenger', 'driver', 'admin');

CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'assigned',
  'en_route',
  'arrived',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'authorized',
  'captured',
  'failed',
  'refunded',
  'partial_refund'
);

CREATE TYPE driver_status AS ENUM (
  'pending_review',
  'approved',
  'active',
  'inactive',
  'suspended',
  'rejected'
);

CREATE TYPE vehicle_class AS ENUM (
  'standard_sedan',
  'business_sedan',
  'first_class_suv',
  'luxury_van'
);

CREATE TYPE payout_status AS ENUM (
  'pending',
  'processing',
  'paid',
  'failed'
);

CREATE TYPE city_status AS ENUM (
  'live',
  'coming_soon',
  'inactive'
);

CREATE TYPE application_status AS ENUM (
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'pending_documents'
);

CREATE TYPE notification_type AS ENUM (
  'booking_confirmed',
  'driver_assigned',
  'driver_arriving',
  'ride_started',
  'ride_completed',
  'booking_cancelled',
  'payment_received',
  'payout_processed',
  'application_update',
  'system'
);

CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');

-- ─── Users ────────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  phone       TEXT,
  full_name   TEXT,
  role        user_role NOT NULL DEFAULT 'passenger',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ─── Passengers ──────────────────────────────────────────────────────────────

CREATE TABLE passengers (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name                 TEXT NOT NULL,
  last_name                  TEXT NOT NULL,
  email                      TEXT NOT NULL,
  phone                      TEXT NOT NULL,
  stripe_customer_id         TEXT UNIQUE,
  saved_addresses            JSONB DEFAULT '[]',
  notification_preferences   JSONB DEFAULT '{"email": true, "sms": true, "push": true}',
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_passengers_user_id ON passengers(user_id);
CREATE INDEX idx_passengers_email ON passengers(email);

-- ─── Drivers ─────────────────────────────────────────────────────────────────

CREATE TABLE drivers (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name               TEXT NOT NULL,
  last_name                TEXT NOT NULL,
  email                    TEXT NOT NULL,
  phone                    TEXT NOT NULL,
  status                   driver_status NOT NULL DEFAULT 'pending_review',
  vehicle_class            vehicle_class NOT NULL,
  vehicle_make             TEXT NOT NULL,
  vehicle_model            TEXT NOT NULL,
  vehicle_year             INTEGER NOT NULL CHECK (vehicle_year >= 2019),
  vehicle_color            TEXT NOT NULL,
  vehicle_plate            TEXT NOT NULL,
  vehicle_vin              TEXT,
  license_number           TEXT NOT NULL,
  license_expiry           DATE NOT NULL,
  insurance_policy         TEXT,
  insurance_expiry         DATE,
  background_check_status  TEXT,
  city_id                  UUID,
  rating                   NUMERIC(3, 2) CHECK (rating >= 0 AND rating <= 5),
  total_rides              INTEGER NOT NULL DEFAULT 0,
  stripe_account_id        TEXT UNIQUE,
  is_online                BOOLEAN NOT NULL DEFAULT false,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_city_id ON drivers(city_id);
CREATE INDEX idx_drivers_vehicle_class ON drivers(vehicle_class);
CREATE INDEX idx_drivers_is_online ON drivers(is_online);

-- ─── Cities ──────────────────────────────────────────────────────────────────

CREATE TABLE cities (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  state            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  status           city_status NOT NULL DEFAULT 'coming_soon',
  timezone         TEXT NOT NULL DEFAULT 'America/New_York',
  lat              NUMERIC(10, 7),
  lng              NUMERIC(10, 7),
  meta_title       TEXT,
  meta_description TEXT,
  hero_image_url   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cities_slug ON cities(slug);
CREATE INDEX idx_cities_status ON cities(status);

-- Update drivers FK now that cities table exists
ALTER TABLE drivers
  ADD CONSTRAINT fk_drivers_city
  FOREIGN KEY (city_id) REFERENCES cities(id);

-- ─── Airports ────────────────────────────────────────────────────────────────

CREATE TABLE airports (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id    UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  iata_code  TEXT NOT NULL UNIQUE,
  address    TEXT NOT NULL,
  lat        NUMERIC(10, 7),
  lng        NUMERIC(10, 7),
  terminals  TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_airports_city_id ON airports(city_id);
CREATE INDEX idx_airports_iata ON airports(iata_code);

-- ─── Pricing Config ───────────────────────────────────────────────────────────

CREATE TABLE pricing_config (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id              UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  vehicle_class        vehicle_class NOT NULL,
  base_fare            NUMERIC(10, 2) NOT NULL CHECK (base_fare >= 0),
  per_mile_rate        NUMERIC(6, 4) NOT NULL CHECK (per_mile_rate >= 0),
  minimum_fare         NUMERIC(10, 2) NOT NULL CHECK (minimum_fare >= 0),
  airport_surcharge    NUMERIC(10, 2) NOT NULL DEFAULT 15.00,
  late_night_surcharge NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
  effective_from       DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to         DATE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(city_id, vehicle_class, effective_from)
);

CREATE INDEX idx_pricing_city_id ON pricing_config(city_id);
CREATE INDEX idx_pricing_vehicle_class ON pricing_config(vehicle_class);

-- ─── Bookings ────────────────────────────────────────────────────────────────

CREATE TABLE bookings (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number           TEXT NOT NULL UNIQUE,
  passenger_id               UUID REFERENCES passengers(id),
  driver_id                  UUID REFERENCES drivers(id),
  city_id                    UUID NOT NULL REFERENCES cities(id),
  airport_id                 UUID REFERENCES airports(id),
  status                     booking_status NOT NULL DEFAULT 'pending',
  payment_status             payment_status NOT NULL DEFAULT 'pending',
  vehicle_class              vehicle_class NOT NULL,
  pickup_address             TEXT NOT NULL,
  pickup_lat                 NUMERIC(10, 7),
  pickup_lng                 NUMERIC(10, 7),
  pickup_place_id            TEXT,
  dropoff_address            TEXT NOT NULL,
  dropoff_lat                NUMERIC(10, 7),
  dropoff_lng                NUMERIC(10, 7),
  dropoff_place_id           TEXT,
  scheduled_at               TIMESTAMPTZ NOT NULL,
  flight_number              TEXT,
  airline                    TEXT,
  passenger_count            INTEGER NOT NULL DEFAULT 1 CHECK (passenger_count >= 1 AND passenger_count <= 14),
  bags_count                 INTEGER NOT NULL DEFAULT 0 CHECK (bags_count >= 0 AND bags_count <= 10),
  passenger_name             TEXT NOT NULL,
  passenger_email            TEXT NOT NULL,
  passenger_phone            TEXT NOT NULL,
  special_requests           TEXT,
  base_price                 NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  distance_miles             NUMERIC(8, 2),
  surge_multiplier           NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
  promo_discount             NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  promo_code                 TEXT,
  total_price                NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
  stripe_payment_intent_id   TEXT UNIQUE,
  stripe_charge_id           TEXT UNIQUE,
  driver_arrived_at          TIMESTAMPTZ,
  pickup_at                  TIMESTAMPTZ,
  dropoff_at                 TIMESTAMPTZ,
  cancelled_at               TIMESTAMPTZ,
  cancellation_reason        TEXT,
  internal_notes             TEXT,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_passenger_id ON bookings(passenger_id);
CREATE INDEX idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX idx_bookings_city_id ON bookings(city_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX idx_bookings_reference_number ON bookings(reference_number);
CREATE INDEX idx_bookings_passenger_email ON bookings(passenger_email);

-- ─── Driver Earnings ──────────────────────────────────────────────────────────

CREATE TABLE driver_earnings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id         UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  booking_id        UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  gross_amount      NUMERIC(10, 2) NOT NULL CHECK (gross_amount >= 0),
  platform_fee      NUMERIC(10, 2) NOT NULL CHECK (platform_fee >= 0),
  net_amount        NUMERIC(10, 2) NOT NULL CHECK (net_amount >= 0),
  weekly_payout_id  UUID,
  earned_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(booking_id)
);

CREATE INDEX idx_earnings_driver_id ON driver_earnings(driver_id);
CREATE INDEX idx_earnings_booking_id ON driver_earnings(booking_id);
CREATE INDEX idx_earnings_earned_at ON driver_earnings(earned_at);
CREATE INDEX idx_earnings_weekly_payout_id ON driver_earnings(weekly_payout_id);

-- ─── Weekly Payouts ───────────────────────────────────────────────────────────

CREATE TABLE weekly_payouts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id            UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  week_start           DATE NOT NULL,
  week_end             DATE NOT NULL,
  total_rides          INTEGER NOT NULL DEFAULT 0,
  gross_earnings       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  platform_fees        NUMERIC(10, 2) NOT NULL DEFAULT 0,
  net_payout           NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status               payout_status NOT NULL DEFAULT 'pending',
  stripe_transfer_id   TEXT UNIQUE,
  processed_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(driver_id, week_start)
);

CREATE INDEX idx_payouts_driver_id ON weekly_payouts(driver_id);
CREATE INDEX idx_payouts_status ON weekly_payouts(status);
CREATE INDEX idx_payouts_week_start ON weekly_payouts(week_start);

-- Add FK from earnings to payouts now that payouts table exists
ALTER TABLE driver_earnings
  ADD CONSTRAINT fk_earnings_weekly_payout
  FOREIGN KEY (weekly_payout_id) REFERENCES weekly_payouts(id);

-- ─── Notifications ────────────────────────────────────────────────────────────

CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       notification_type NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  data       JSONB DEFAULT '{}',
  read_at    TIMESTAMPTZ,
  sent_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ─── Driver Locations ─────────────────────────────────────────────────────────

CREATE TABLE driver_locations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id  UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  lat        NUMERIC(10, 7) NOT NULL,
  lng        NUMERIC(10, 7) NOT NULL,
  heading    NUMERIC(5, 2),
  speed      NUMERIC(6, 2),
  is_online  BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(driver_id)
);

CREATE INDEX idx_driver_locations_driver_id ON driver_locations(driver_id);
CREATE INDEX idx_driver_locations_is_online ON driver_locations(is_online);

-- ─── Promo Codes ─────────────────────────────────────────────────────────────

CREATE TABLE promo_codes (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                   TEXT NOT NULL UNIQUE,
  description            TEXT,
  discount_type          discount_type NOT NULL,
  discount_value         NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  minimum_booking_amount NUMERIC(10, 2),
  usage_limit            INTEGER,
  usage_count            INTEGER NOT NULL DEFAULT 0,
  valid_from             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_to               TIMESTAMPTZ,
  city_ids               UUID[],
  is_active              BOOLEAN NOT NULL DEFAULT true,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_is_active ON promo_codes(is_active);

-- ─── Agency Affiliates ────────────────────────────────────────────────────────

CREATE TABLE agency_affiliates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id),
  agency_name       TEXT NOT NULL,
  contact_name      TEXT NOT NULL,
  contact_email     TEXT NOT NULL,
  contact_phone     TEXT NOT NULL,
  website           TEXT,
  commission_rate   NUMERIC(5, 4) NOT NULL DEFAULT 0.05 CHECK (commission_rate >= 0 AND commission_rate <= 1),
  referral_code     TEXT NOT NULL UNIQUE,
  total_bookings    INTEGER NOT NULL DEFAULT 0,
  total_earnings    NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status            application_status NOT NULL DEFAULT 'submitted',
  stripe_account_id TEXT UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agency_affiliates_referral_code ON agency_affiliates(referral_code);
CREATE INDEX idx_agency_affiliates_status ON agency_affiliates(status);
CREATE INDEX idx_agency_affiliates_user_id ON agency_affiliates(user_id);

-- ─── Driver Applications ──────────────────────────────────────────────────────

CREATE TABLE driver_applications (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name            TEXT NOT NULL,
  last_name             TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT NOT NULL,
  city_id               UUID REFERENCES cities(id),
  vehicle_class         vehicle_class NOT NULL,
  vehicle_make          TEXT NOT NULL,
  vehicle_model         TEXT NOT NULL,
  vehicle_year          INTEGER NOT NULL CHECK (vehicle_year >= 2019),
  vehicle_color         TEXT NOT NULL,
  vehicle_plate         TEXT NOT NULL,
  license_number        TEXT NOT NULL,
  license_expiry        DATE NOT NULL,
  has_insurance         BOOLEAN NOT NULL DEFAULT false,
  has_clean_record      BOOLEAN NOT NULL DEFAULT false,
  documents_submitted   TEXT[],
  status                application_status NOT NULL DEFAULT 'submitted',
  reviewer_notes        TEXT,
  submitted_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_driver_applications_email ON driver_applications(email);
CREATE INDEX idx_driver_applications_status ON driver_applications(status);
CREATE INDEX idx_driver_applications_submitted_at ON driver_applications(submitted_at DESC);

-- ─── Agency Applications ──────────────────────────────────────────────────────

CREATE TABLE agency_applications (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name                 TEXT NOT NULL,
  contact_name                TEXT NOT NULL,
  contact_email               TEXT NOT NULL,
  contact_phone               TEXT NOT NULL,
  website                     TEXT,
  business_type               TEXT NOT NULL,
  estimated_monthly_bookings  INTEGER,
  message                     TEXT,
  status                      application_status NOT NULL DEFAULT 'submitted',
  reviewer_notes              TEXT,
  submitted_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at                 TIMESTAMPTZ,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agency_applications_email ON agency_applications(contact_email);
CREATE INDEX idx_agency_applications_status ON agency_applications(status);
CREATE INDEX idx_agency_applications_submitted_at ON agency_applications(submitted_at DESC);

-- ─── Updated At Trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'users', 'passengers', 'drivers', 'cities', 'airports',
      'pricing_config', 'bookings', 'weekly_payouts', 'promo_codes',
      'agency_affiliates', 'driver_applications', 'agency_applications'
    ])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      t, t
    );
  END LOOP;
END;
$$;
