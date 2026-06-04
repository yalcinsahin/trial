-- ============================================================
-- BookAirportRide — Database Functions
-- Migration 003: Business logic functions
-- ============================================================

-- ─── calculate_booking_price ──────────────────────────────────────────────────
-- Returns a price breakdown JSON for a given city, vehicle class, and distance

CREATE OR REPLACE FUNCTION calculate_booking_price(
  p_city_id       UUID,
  p_vehicle_class vehicle_class,
  p_distance_miles NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pricing      pricing_config;
  v_base_fare    NUMERIC;
  v_dist_charge  NUMERIC;
  v_airport_surch NUMERIC;
  v_subtotal     NUMERIC;
  v_total        NUMERIC;
  v_result       JSONB;
BEGIN
  -- Fetch the active pricing config
  SELECT *
  INTO v_pricing
  FROM pricing_config
  WHERE city_id = p_city_id
    AND vehicle_class = p_vehicle_class
    AND effective_from <= CURRENT_DATE
    AND (effective_to IS NULL OR effective_to >= CURRENT_DATE)
  ORDER BY effective_from DESC
  LIMIT 1;

  IF NOT FOUND THEN
    -- Return default pricing if no config found
    RETURN jsonb_build_object(
      'error', 'No pricing configuration found for this city and vehicle class',
      'city_id', p_city_id,
      'vehicle_class', p_vehicle_class
    );
  END IF;

  -- Calculate price components
  v_base_fare    := v_pricing.base_fare;
  v_dist_charge  := p_distance_miles * v_pricing.per_mile_rate;
  v_airport_surch := v_pricing.airport_surcharge;
  v_subtotal     := v_base_fare + v_dist_charge + v_airport_surch;
  v_total        := GREATEST(v_subtotal, v_pricing.minimum_fare);

  v_result := jsonb_build_object(
    'base_fare',          v_base_fare,
    'distance_miles',     p_distance_miles,
    'distance_charge',    v_dist_charge,
    'airport_surcharge',  v_airport_surch,
    'minimum_fare',       v_pricing.minimum_fare,
    'surge_multiplier',   1.0,
    'promo_discount',     0,
    'subtotal',           v_subtotal,
    'total',              v_total
  );

  RETURN v_result;
END;
$$;

-- ─── assign_driver_to_booking ─────────────────────────────────────────────────
-- Assigns a driver to a booking and sends a notification

CREATE OR REPLACE FUNCTION assign_driver_to_booking(
  p_booking_id UUID,
  p_driver_id  UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking   bookings;
  v_driver    drivers;
  v_passenger passengers;
BEGIN
  -- Fetch booking
  SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found: %', p_booking_id;
  END IF;

  IF v_booking.status NOT IN ('pending', 'confirmed') THEN
    RAISE EXCEPTION 'Booking % is not in an assignable state (status: %)', p_booking_id, v_booking.status;
  END IF;

  -- Fetch driver
  SELECT * INTO v_driver FROM drivers WHERE id = p_driver_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Driver not found: %', p_driver_id;
  END IF;

  IF v_driver.status != 'active' THEN
    RAISE EXCEPTION 'Driver % is not active (status: %)', p_driver_id, v_driver.status;
  END IF;

  -- Update booking
  UPDATE bookings
  SET
    driver_id  = p_driver_id,
    status     = 'assigned',
    updated_at = NOW()
  WHERE id = p_booking_id;

  -- Create notification for passenger if they have an account
  IF v_booking.passenger_id IS NOT NULL THEN
    SELECT * INTO v_passenger FROM passengers WHERE id = v_booking.passenger_id;

    IF FOUND THEN
      INSERT INTO notifications (user_id, type, title, body, data)
      VALUES (
        v_passenger.user_id,
        'driver_assigned',
        'Driver Assigned',
        format(
          'Your driver %s %s has been assigned to your booking %s.',
          v_driver.first_name,
          v_driver.last_name,
          v_booking.reference_number
        ),
        jsonb_build_object(
          'booking_id',        p_booking_id,
          'reference_number',  v_booking.reference_number,
          'driver_name',       v_driver.first_name || ' ' || v_driver.last_name,
          'driver_phone',      v_driver.phone,
          'vehicle_make',      v_driver.vehicle_make,
          'vehicle_model',     v_driver.vehicle_model,
          'vehicle_color',     v_driver.vehicle_color,
          'vehicle_plate',     v_driver.vehicle_plate
        )
      );
    END IF;
  END IF;

  RETURN TRUE;

EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- ─── complete_booking ─────────────────────────────────────────────────────────
-- Marks a booking as completed and creates a driver earnings record

CREATE OR REPLACE FUNCTION complete_booking(
  p_booking_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking       bookings;
  v_driver        drivers;
  v_platform_fee  NUMERIC;
  v_net_amount    NUMERIC;
BEGIN
  -- Fetch booking
  SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found: %', p_booking_id;
  END IF;

  IF v_booking.status != 'in_progress' THEN
    RAISE EXCEPTION 'Booking % is not in_progress (status: %)', p_booking_id, v_booking.status;
  END IF;

  IF v_booking.driver_id IS NULL THEN
    RAISE EXCEPTION 'Booking % has no driver assigned', p_booking_id;
  END IF;

  -- Calculate earnings (80% driver, 20% platform)
  v_platform_fee := ROUND(v_booking.total_price * 0.20, 2);
  v_net_amount   := v_booking.total_price - v_platform_fee;

  -- Update booking status
  UPDATE bookings
  SET
    status     = 'completed',
    dropoff_at = NOW(),
    updated_at = NOW()
  WHERE id = p_booking_id;

  -- Update driver total rides
  UPDATE drivers
  SET
    total_rides = total_rides + 1,
    updated_at  = NOW()
  WHERE id = v_booking.driver_id;

  -- Create earnings record
  INSERT INTO driver_earnings (
    driver_id,
    booking_id,
    gross_amount,
    platform_fee,
    net_amount,
    earned_at
  ) VALUES (
    v_booking.driver_id,
    p_booking_id,
    v_booking.total_price,
    v_platform_fee,
    v_net_amount,
    NOW()
  )
  ON CONFLICT (booking_id) DO NOTHING;

  -- Notify passenger
  IF v_booking.passenger_id IS NOT NULL THEN
    DECLARE
      v_passenger passengers;
    BEGIN
      SELECT * INTO v_passenger FROM passengers WHERE id = v_booking.passenger_id;
      IF FOUND THEN
        INSERT INTO notifications (user_id, type, title, body, data)
        VALUES (
          v_passenger.user_id,
          'ride_completed',
          'Ride Completed',
          format('Your trip %s has been completed. Thank you for riding with BookAirportRide!', v_booking.reference_number),
          jsonb_build_object(
            'booking_id',       p_booking_id,
            'reference_number', v_booking.reference_number,
            'total_price',      v_booking.total_price
          )
        );
      END IF;
    END;
  END IF;

  RETURN TRUE;

EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- ─── get_driver_weekly_earnings ───────────────────────────────────────────────
-- Returns weekly earnings summary for a driver

CREATE OR REPLACE FUNCTION get_driver_weekly_earnings(
  p_driver_id  UUID,
  p_week_start DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_week_end    DATE;
  v_total_rides INTEGER;
  v_gross       NUMERIC;
  v_fees        NUMERIC;
  v_net         NUMERIC;
  v_result      JSONB;
BEGIN
  v_week_end := p_week_start + INTERVAL '6 days';

  SELECT
    COUNT(*)::INTEGER,
    COALESCE(SUM(gross_amount), 0),
    COALESCE(SUM(platform_fee), 0),
    COALESCE(SUM(net_amount), 0)
  INTO v_total_rides, v_gross, v_fees, v_net
  FROM driver_earnings
  WHERE driver_id = p_driver_id
    AND earned_at >= p_week_start::TIMESTAMPTZ
    AND earned_at < (v_week_end + INTERVAL '1 day')::TIMESTAMPTZ;

  -- Get payout status if exists
  v_result := jsonb_build_object(
    'driver_id',    p_driver_id,
    'week_start',   p_week_start,
    'week_end',     v_week_end,
    'total_rides',  v_total_rides,
    'gross_earnings', v_gross,
    'platform_fees',  v_fees,
    'net_payout',     v_net
  );

  -- Enrich with payout info if available
  DECLARE
    v_payout weekly_payouts;
  BEGIN
    SELECT * INTO v_payout
    FROM weekly_payouts
    WHERE driver_id = p_driver_id AND week_start = p_week_start;

    IF FOUND THEN
      v_result := v_result || jsonb_build_object(
        'payout_id',     v_payout.id,
        'payout_status', v_payout.status,
        'processed_at',  v_payout.processed_at
      );
    ELSE
      v_result := v_result || jsonb_build_object(
        'payout_id',     NULL,
        'payout_status', 'not_generated'
      );
    END IF;
  END;

  RETURN v_result;
END;
$$;

-- ─── Grant execute permissions ────────────────────────────────────────────────

GRANT EXECUTE ON FUNCTION calculate_booking_price(UUID, vehicle_class, NUMERIC)
  TO authenticated, anon;

GRANT EXECUTE ON FUNCTION assign_driver_to_booking(UUID, UUID)
  TO authenticated;

GRANT EXECUTE ON FUNCTION complete_booking(UUID)
  TO authenticated;

GRANT EXECUTE ON FUNCTION get_driver_weekly_earnings(UUID, DATE)
  TO authenticated;
