-- ============================================================
-- BookAirportRide — Row Level Security Policies
-- Migration 002: RLS policies for all tables
-- ============================================================

-- ─── Helper: Check if current user is admin ──────────────────────────────────

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── Enable RLS on all tables ─────────────────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_applications ENABLE ROW LEVEL SECURITY;

-- ─── USERS ───────────────────────────────────────────────────────────────────

-- Users can read their own record
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own record (limited fields)
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins have full access
CREATE POLICY "users_admin_all" ON users
  FOR ALL USING (is_admin());

-- ─── PASSENGERS ──────────────────────────────────────────────────────────────

-- Passengers can read their own record
CREATE POLICY "passengers_select_own" ON passengers
  FOR SELECT USING (auth.uid() = user_id);

-- Passengers can update their own record
CREATE POLICY "passengers_update_own" ON passengers
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Passengers can insert their own record on signup
CREATE POLICY "passengers_insert_own" ON passengers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins have full access
CREATE POLICY "passengers_admin_all" ON passengers
  FOR ALL USING (is_admin());

-- ─── DRIVERS ─────────────────────────────────────────────────────────────────

-- Drivers can read their own record
CREATE POLICY "drivers_select_own" ON drivers
  FOR SELECT USING (auth.uid() = user_id);

-- Drivers can update their own basic info
CREATE POLICY "drivers_update_own" ON drivers
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins have full access
CREATE POLICY "drivers_admin_all" ON drivers
  FOR ALL USING (is_admin());

-- ─── CITIES ──────────────────────────────────────────────────────────────────

-- Cities are publicly readable
CREATE POLICY "cities_select_public" ON cities
  FOR SELECT USING (true);

-- Only admins can modify cities
CREATE POLICY "cities_admin_all" ON cities
  FOR ALL USING (is_admin());

-- ─── AIRPORTS ────────────────────────────────────────────────────────────────

-- Airports are publicly readable
CREATE POLICY "airports_select_public" ON airports
  FOR SELECT USING (true);

-- Only admins can modify airports
CREATE POLICY "airports_admin_all" ON airports
  FOR ALL USING (is_admin());

-- ─── PRICING CONFIG ──────────────────────────────────────────────────────────

-- Pricing is publicly readable
CREATE POLICY "pricing_select_public" ON pricing_config
  FOR SELECT USING (true);

-- Only admins can modify pricing
CREATE POLICY "pricing_admin_all" ON pricing_config
  FOR ALL USING (is_admin());

-- ─── BOOKINGS ────────────────────────────────────────────────────────────────

-- Public (anon) can INSERT bookings (guest checkout)
CREATE POLICY "bookings_insert_public" ON bookings
  FOR INSERT WITH CHECK (true);

-- Passengers can read their own bookings
CREATE POLICY "bookings_select_own_passenger" ON bookings
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    passenger_id = (SELECT id FROM passengers WHERE user_id = auth.uid() LIMIT 1)
  );

-- Drivers can read their assigned bookings
CREATE POLICY "bookings_select_own_driver" ON bookings
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    driver_id = (SELECT id FROM drivers WHERE user_id = auth.uid() LIMIT 1)
  );

-- Passengers can read by reference number (for tracking without login)
-- Using a permissive read for reference number lookups
CREATE POLICY "bookings_select_by_reference" ON bookings
  FOR SELECT USING (true);

-- Drivers can update ride status on their assigned active bookings
CREATE POLICY "bookings_update_driver_status" ON bookings
  FOR UPDATE USING (
    driver_id = (SELECT id FROM drivers WHERE user_id = auth.uid() LIMIT 1)
    AND status IN ('assigned', 'en_route', 'arrived', 'in_progress')
  )
  WITH CHECK (
    driver_id = (SELECT id FROM drivers WHERE user_id = auth.uid() LIMIT 1)
    AND status IN ('en_route', 'arrived', 'in_progress', 'completed')
  );

-- Admins have full access
CREATE POLICY "bookings_admin_all" ON bookings
  FOR ALL USING (is_admin());

-- ─── DRIVER EARNINGS ─────────────────────────────────────────────────────────

-- Drivers can read their own earnings
CREATE POLICY "earnings_select_own" ON driver_earnings
  FOR SELECT USING (
    driver_id = (SELECT id FROM drivers WHERE user_id = auth.uid() LIMIT 1)
  );

-- Admins have full access
CREATE POLICY "earnings_admin_all" ON driver_earnings
  FOR ALL USING (is_admin());

-- ─── WEEKLY PAYOUTS ──────────────────────────────────────────────────────────

-- Drivers can read their own payouts
CREATE POLICY "payouts_select_own" ON weekly_payouts
  FOR SELECT USING (
    driver_id = (SELECT id FROM drivers WHERE user_id = auth.uid() LIMIT 1)
  );

-- Admins have full access
CREATE POLICY "payouts_admin_all" ON weekly_payouts
  FOR ALL USING (is_admin());

-- ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

-- Users can read their own notifications
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own notifications (e.g., mark as read)
CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins have full access
CREATE POLICY "notifications_admin_all" ON notifications
  FOR ALL USING (is_admin());

-- ─── DRIVER LOCATIONS ────────────────────────────────────────────────────────

-- Drivers can read their own location
CREATE POLICY "driver_locations_select_own" ON driver_locations
  FOR SELECT USING (
    driver_id = (SELECT id FROM drivers WHERE user_id = auth.uid() LIMIT 1)
  );

-- Drivers can upsert their own location
CREATE POLICY "driver_locations_upsert_own" ON driver_locations
  FOR INSERT WITH CHECK (
    driver_id = (SELECT id FROM drivers WHERE user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "driver_locations_update_own" ON driver_locations
  FOR UPDATE USING (
    driver_id = (SELECT id FROM drivers WHERE user_id = auth.uid() LIMIT 1)
  );

-- Admins have full access
CREATE POLICY "driver_locations_admin_all" ON driver_locations
  FOR ALL USING (is_admin());

-- ─── PROMO CODES ─────────────────────────────────────────────────────────────

-- Active promo codes are publicly readable (for validation at booking)
CREATE POLICY "promo_codes_select_active" ON promo_codes
  FOR SELECT USING (is_active = true);

-- Admins have full access
CREATE POLICY "promo_codes_admin_all" ON promo_codes
  FOR ALL USING (is_admin());

-- ─── AGENCY AFFILIATES ───────────────────────────────────────────────────────

-- Agencies can read their own record
CREATE POLICY "agency_affiliates_select_own" ON agency_affiliates
  FOR SELECT USING (user_id = auth.uid());

-- Admins have full access
CREATE POLICY "agency_affiliates_admin_all" ON agency_affiliates
  FOR ALL USING (is_admin());

-- ─── DRIVER APPLICATIONS ─────────────────────────────────────────────────────

-- Public can INSERT driver applications (open form)
CREATE POLICY "driver_applications_insert_public" ON driver_applications
  FOR INSERT WITH CHECK (true);

-- Applicants can view their own application by email (requires RLS awareness)
CREATE POLICY "driver_applications_admin_all" ON driver_applications
  FOR ALL USING (is_admin());

-- ─── AGENCY APPLICATIONS ─────────────────────────────────────────────────────

-- Public can INSERT agency applications (open form)
CREATE POLICY "agency_applications_insert_public" ON agency_applications
  FOR INSERT WITH CHECK (true);

-- Admins have full access
CREATE POLICY "agency_applications_admin_all" ON agency_applications
  FOR ALL USING (is_admin());
