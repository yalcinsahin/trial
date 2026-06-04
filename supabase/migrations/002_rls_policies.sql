-- BookAirportRide — Row Level Security Policies

-- ────────────────────────────────────────────────────────────
-- ENABLE RLS ON ALL TABLES
-- ────────────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ────────────────────────────────────────────────────────────
-- USERS
-- ────────────────────────────────────────────────────────────
-- Passengers can read/update their own record
CREATE POLICY "users_select_own" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (id = auth.uid());
-- Admins full access
CREATE POLICY "users_admin_all" ON users FOR ALL USING (get_user_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- DRIVERS
-- ────────────────────────────────────────────────────────────
-- Drivers read their own record
CREATE POLICY "drivers_select_own" ON drivers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "drivers_update_own" ON drivers FOR UPDATE USING (user_id = auth.uid());
-- Admins full access
CREATE POLICY "drivers_admin_all" ON drivers FOR ALL USING (get_user_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- BOOKINGS
-- ────────────────────────────────────────────────────────────
-- Public (unauthenticated) can INSERT (guest checkout)
CREATE POLICY "bookings_public_insert" ON bookings FOR INSERT WITH CHECK (TRUE);
-- Passengers read their own bookings
CREATE POLICY "bookings_passenger_select" ON bookings FOR SELECT USING (passenger_id = auth.uid());
-- Drivers read bookings assigned to them
CREATE POLICY "bookings_driver_select" ON bookings FOR SELECT
  USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));
-- Drivers can update status on their own active bookings
CREATE POLICY "bookings_driver_update_status" ON bookings FOR UPDATE
  USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()))
  WITH CHECK (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));
-- Admins full access
CREATE POLICY "bookings_admin_all" ON bookings FOR ALL USING (get_user_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- DRIVER EARNINGS
-- ────────────────────────────────────────────────────────────
CREATE POLICY "earnings_driver_select" ON driver_earnings FOR SELECT
  USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));
CREATE POLICY "earnings_admin_all" ON driver_earnings FOR ALL USING (get_user_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- WEEKLY PAYOUTS
-- ────────────────────────────────────────────────────────────
CREATE POLICY "payouts_driver_select" ON weekly_payouts FOR SELECT
  USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));
CREATE POLICY "payouts_admin_all" ON weekly_payouts FOR ALL USING (get_user_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ────────────────────────────────────────────────────────────
CREATE POLICY "notif_own" ON notifications FOR ALL USING (user_id = auth.uid());
CREATE POLICY "notif_admin" ON notifications FOR ALL USING (get_user_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- DRIVER LOCATIONS
-- ────────────────────────────────────────────────────────────
CREATE POLICY "locations_driver_own" ON driver_locations FOR ALL
  USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));
CREATE POLICY "locations_admin" ON driver_locations FOR ALL USING (get_user_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- PROMO CODES (public read for validation)
-- ────────────────────────────────────────────────────────────
CREATE POLICY "promo_public_select" ON promo_codes FOR SELECT USING (is_active = TRUE);
CREATE POLICY "promo_admin_all" ON promo_codes FOR ALL USING (get_user_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- DRIVER APPLICATIONS (public can insert)
-- ────────────────────────────────────────────────────────────
CREATE POLICY "driver_app_public_insert" ON driver_applications FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "driver_app_admin_all" ON driver_applications FOR ALL USING (get_user_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- AGENCY APPLICATIONS (public can insert)
-- ────────────────────────────────────────────────────────────
CREATE POLICY "agency_app_public_insert" ON agency_applications FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "agency_app_admin_all" ON agency_applications FOR ALL USING (get_user_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- CITIES, AIRPORTS, PRICING (public read)
-- ────────────────────────────────────────────────────────────
CREATE POLICY "cities_public_read" ON cities FOR SELECT USING (TRUE);
CREATE POLICY "cities_admin_all" ON cities FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "airports_public_read" ON airports FOR SELECT USING (is_active = TRUE);
CREATE POLICY "airports_admin_all" ON airports FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "pricing_public_read" ON pricing_config FOR SELECT USING (TRUE);
CREATE POLICY "pricing_admin_all" ON pricing_config FOR ALL USING (get_user_role() = 'admin');
