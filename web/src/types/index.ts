// ============================================================
// BookAirportRide — TypeScript Type Definitions
// ============================================================

// ─── Enums ───────────────────────────────────────────────────────────────────

export type UserRole = 'passenger' | 'driver' | 'admin';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'partial_refund';

export type DriverStatus =
  | 'pending_review'
  | 'approved'
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'rejected';

export type VehicleClass =
  | 'standard_sedan'
  | 'business_sedan'
  | 'first_class_suv'
  | 'luxury_van';

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

export type CityStatus = 'live' | 'coming_soon' | 'inactive';

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'pending_documents';

// ─── Core Models ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Passenger {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  stripe_customer_id?: string;
  saved_addresses?: SavedAddress[];
  notification_preferences?: NotificationPreferences;
  created_at: string;
  updated_at: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  place_id?: string;
  lat?: number;
  lng?: number;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface Driver {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: DriverStatus;
  vehicle_class: VehicleClass;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_color: string;
  vehicle_plate: string;
  vehicle_vin?: string;
  license_number: string;
  license_expiry: string;
  insurance_policy?: string;
  insurance_expiry?: string;
  background_check_status?: string;
  city_id?: string;
  rating?: number;
  total_rides?: number;
  stripe_account_id?: string;
  is_online?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  reference_number: string;
  passenger_id?: string;
  driver_id?: string;
  city_id: string;
  airport_id?: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  vehicle_class: VehicleClass;
  pickup_address: string;
  pickup_lat?: number;
  pickup_lng?: number;
  pickup_place_id?: string;
  dropoff_address: string;
  dropoff_lat?: number;
  dropoff_lng?: number;
  dropoff_place_id?: string;
  scheduled_at: string;
  flight_number?: string;
  airline?: string;
  passenger_count: number;
  bags_count?: number;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  special_requests?: string;
  base_price: number;
  distance_miles?: number;
  surge_multiplier?: number;
  promo_discount?: number;
  promo_code?: string;
  total_price: number;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  driver_arrived_at?: string;
  pickup_at?: string;
  dropoff_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DriverEarnings {
  id: string;
  driver_id: string;
  booking_id: string;
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  weekly_payout_id?: string;
  earned_at: string;
  created_at: string;
}

export interface WeeklyPayout {
  id: string;
  driver_id: string;
  week_start: string;
  week_end: string;
  total_rides: number;
  gross_earnings: number;
  platform_fees: number;
  net_payout: number;
  status: PayoutStatus;
  stripe_transfer_id?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  slug: string;
  status: CityStatus;
  timezone: string;
  lat?: number;
  lng?: number;
  meta_title?: string;
  meta_description?: string;
  hero_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Airport {
  id: string;
  city_id: string;
  name: string;
  iata_code: string;
  address: string;
  lat?: number;
  lng?: number;
  terminals?: string[];
  created_at: string;
}

export interface PricingConfig {
  id: string;
  city_id: string;
  vehicle_class: VehicleClass;
  base_fare: number;
  per_mile_rate: number;
  minimum_fare: number;
  airport_surcharge?: number;
  late_night_surcharge?: number;
  effective_from: string;
  effective_to?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  read_at?: string;
  sent_at?: string;
  created_at: string;
}

export type NotificationType =
  | 'booking_confirmed'
  | 'driver_assigned'
  | 'driver_arriving'
  | 'ride_started'
  | 'ride_completed'
  | 'booking_cancelled'
  | 'payment_received'
  | 'payout_processed'
  | 'application_update'
  | 'system';

export interface DriverLocation {
  id: string;
  driver_id: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  is_online: boolean;
  updated_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_booking_amount?: number;
  usage_limit?: number;
  usage_count: number;
  valid_from: string;
  valid_to?: string;
  city_ids?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgencyAffiliate {
  id: string;
  user_id?: string;
  agency_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
  commission_rate: number;
  referral_code: string;
  total_bookings: number;
  total_earnings: number;
  status: ApplicationStatus;
  stripe_account_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DriverApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city_id?: string;
  vehicle_class: VehicleClass;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_color: string;
  vehicle_plate: string;
  license_number: string;
  license_expiry: string;
  has_insurance: boolean;
  has_clean_record: boolean;
  documents_submitted?: string[];
  status: ApplicationStatus;
  reviewer_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AgencyApplication {
  id: string;
  agency_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
  business_type: string;
  estimated_monthly_bookings?: number;
  message?: string;
  status: ApplicationStatus;
  reviewer_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

// ─── UI / Form Types ──────────────────────────────────────────────────────────

export interface BookingFormData {
  pickup_address: string;
  pickup_place_id?: string;
  dropoff_address: string;
  dropoff_place_id?: string;
  scheduled_date: string;
  scheduled_time: string;
  flight_number?: string;
  airline?: string;
  passenger_count: number;
  bags_count: number;
  vehicle_class?: VehicleClass;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  special_requests?: string;
  promo_code?: string;
}

export interface PriceBreakdown {
  base_fare: number;
  distance_miles: number;
  distance_charge: number;
  airport_surcharge: number;
  surge_multiplier: number;
  promo_discount: number;
  subtotal: number;
  total: number;
}

export interface VehicleClassInfo {
  id: VehicleClass;
  name: string;
  description: string;
  capacity: number;
  luggage: number;
  amenities: string[];
  image_url?: string;
}
