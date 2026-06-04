-- BookAirportRide — Initial Schema Migration
-- Run this in your Supabase SQL editor or via supabase db push

-- ────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- ENUMS
-- ────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('passenger', 'driver', 'admin');
CREATE TYPE driver_status AS ENUM ('pending', 'approved', 'suspended');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'authorized', 'paid', 'refunded');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'paid', 'failed');
CREATE TYPE city_status AS ENUM ('live', 'coming_soon');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected', 'more_info');

-- ────────────────────────────────────────────────────────────
-- USERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'passenger',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ────────────────────────────────────────────────────────────
-- CITIES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'United States',
  slug TEXT UNIQUE NOT NULL,
  status city_status NOT NULL DEFAULT 'coming_soon',
  launch_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- AIRPORTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS airports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  iata_code TEXT UNIQUE NOT NULL,
  terminal_notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- PRICING CONFIG
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  vehicle_class TEXT NOT NULL,
  base_fare DECIMAL(10,2) NOT NULL,
  per_mile_rate DECIMAL(10,2) NOT NULL,
  minimum_fare DECIMAL(10,2) NOT NULL,
  airport_surcharge DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- DRIVERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  vehicle_color TEXT,
  vehicle_plate TEXT,
  license_number TEXT,
  insurance_number TEXT,
  city TEXT,
  airports_served TEXT[],
  status driver_status NOT NULL DEFAULT 'pending',
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_rides INTEGER DEFAULT 0,
  stripe_connect_account_id TEXT,
  bank_payout_day TEXT DEFAULT 'Monday',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- BOOKINGS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passenger_id UUID REFERENCES users(id),
  driver_id UUID REFERENCES drivers(id),
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  pickup_lat DECIMAL(10,7),
  pickup_lng DECIMAL(10,7),
  dropoff_lat DECIMAL(10,7),
  dropoff_lng DECIMAL(10,7),
  pickup_datetime TIMESTAMPTZ NOT NULL,
  flight_number TEXT,
  airline TEXT,
  passengers_count INTEGER NOT NULL DEFAULT 1,
  bags_count INTEGER NOT NULL DEFAULT 0,
  child_seats_count INTEGER DEFAULT 0,
  meet_and_greet BOOLEAN NOT NULL DEFAULT FALSE,
  vehicle_class TEXT NOT NULL,
  special_requests TEXT,
  distance_miles DECIMAL(8,2),
  base_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  promo_code TEXT,
  promo_discount DECIMAL(10,2) DEFAULT 0,
  status booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  stripe_payment_intent_id TEXT,
  passenger_first_name TEXT,
  passenger_last_name TEXT,
  passenger_email TEXT,
  passenger_phone TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ────────────────────────────────────────────────────────────
-- DRIVER EARNINGS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS driver_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  gross_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL,
  payout_status payout_status NOT NULL DEFAULT 'pending',
  stripe_transfer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- WEEKLY PAYOUTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weekly_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  total_rides INTEGER NOT NULL DEFAULT 0,
  total_gross DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_net_earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
  payout_status payout_status NOT NULL DEFAULT 'pending',
  stripe_transfer_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL,
  reference_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- DRIVER LOCATIONS (realtime)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS driver_locations (
  driver_id UUID PRIMARY KEY REFERENCES drivers(id) ON DELETE CASCADE,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  heading DECIMAL(5,2),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- PROMO CODES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  expiry_date DATE,
  max_uses INTEGER,
  uses_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- DRIVER APPLICATIONS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS driver_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  home_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  ssn_last4 TEXT NOT NULL,
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  emergency_contact_relationship TEXT NOT NULL,
  years_driving TEXT NOT NULL,
  has_dui BOOLEAN NOT NULL DEFAULT FALSE,
  at_fault_accidents BOOLEAN NOT NULL DEFAULT FALSE,
  moving_violations BOOLEAN NOT NULL DEFAULT FALSE,
  violations_explanation TEXT,
  primary_city TEXT NOT NULL,
  primary_state TEXT NOT NULL,
  airports_to_serve TEXT[],
  vehicle_year INTEGER NOT NULL,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_color TEXT NOT NULL,
  vehicle_vin TEXT NOT NULL,
  vehicle_plate TEXT NOT NULL,
  vehicle_plate_state TEXT NOT NULL,
  seating_capacity INTEGER NOT NULL,
  dl_number TEXT NOT NULL,
  dl_state TEXT NOT NULL,
  dl_expiry DATE NOT NULL,
  insurance_provider TEXT NOT NULL,
  insurance_policy_number TEXT NOT NULL,
  insurance_expiry DATE NOT NULL,
  coverage_type TEXT NOT NULL,
  liability_coverage TEXT NOT NULL,
  signature TEXT NOT NULL,
  status application_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- AGENCY APPLICATIONS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agency_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_name TEXT NOT NULL,
  agency_website TEXT,
  year_established INTEGER,
  number_of_agents TEXT,
  business_address TEXT NOT NULL,
  business_city TEXT NOT NULL,
  business_state TEXT,
  business_zip TEXT,
  business_country TEXT NOT NULL DEFAULT 'United States',
  contact_first_name TEXT NOT NULL,
  contact_last_name TEXT NOT NULL,
  contact_title TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  preferred_contact TEXT,
  monthly_bookings TEXT,
  average_booking_value TEXT,
  how_heard TEXT,
  signature TEXT NOT NULL,
  status application_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- INDEXES
-- ────────────────────────────────────────────────────────────
CREATE INDEX idx_bookings_passenger ON bookings(passenger_id);
CREATE INDEX idx_bookings_driver ON bookings(driver_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_pickup_datetime ON bookings(pickup_datetime);
CREATE INDEX idx_driver_earnings_driver ON driver_earnings(driver_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_driver_applications_status ON driver_applications(status);
CREATE INDEX idx_agency_applications_status ON agency_applications(status);
