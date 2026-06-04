// Auto-generated Supabase database types placeholder
// Run `supabase gen types typescript` to regenerate from your actual schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          full_name: string | null;
          role: 'passenger' | 'driver' | 'admin';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      passengers: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          stripe_customer_id: string | null;
          saved_addresses: Json | null;
          notification_preferences: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['passengers']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['passengers']['Insert']>;
      };
      drivers: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          status: 'pending_review' | 'approved' | 'active' | 'inactive' | 'suspended' | 'rejected';
          vehicle_class: 'standard_sedan' | 'business_sedan' | 'first_class_suv' | 'luxury_van';
          vehicle_make: string;
          vehicle_model: string;
          vehicle_year: number;
          vehicle_color: string;
          vehicle_plate: string;
          vehicle_vin: string | null;
          license_number: string;
          license_expiry: string;
          insurance_policy: string | null;
          insurance_expiry: string | null;
          background_check_status: string | null;
          city_id: string | null;
          rating: number | null;
          total_rides: number | null;
          stripe_account_id: string | null;
          is_online: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['drivers']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['drivers']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          reference_number: string;
          passenger_id: string | null;
          driver_id: string | null;
          city_id: string;
          airport_id: string | null;
          status: string;
          payment_status: string;
          vehicle_class: string;
          pickup_address: string;
          pickup_lat: number | null;
          pickup_lng: number | null;
          pickup_place_id: string | null;
          dropoff_address: string;
          dropoff_lat: number | null;
          dropoff_lng: number | null;
          dropoff_place_id: string | null;
          scheduled_at: string;
          flight_number: string | null;
          airline: string | null;
          passenger_count: number;
          bags_count: number | null;
          passenger_name: string;
          passenger_email: string;
          passenger_phone: string;
          special_requests: string | null;
          base_price: number;
          distance_miles: number | null;
          surge_multiplier: number | null;
          promo_discount: number | null;
          promo_code: string | null;
          total_price: number;
          stripe_payment_intent_id: string | null;
          stripe_charge_id: string | null;
          driver_arrived_at: string | null;
          pickup_at: string | null;
          dropoff_at: string | null;
          cancelled_at: string | null;
          cancellation_reason: string | null;
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      cities: {
        Row: {
          id: string;
          name: string;
          state: string;
          slug: string;
          status: 'live' | 'coming_soon' | 'inactive';
          timezone: string;
          lat: number | null;
          lng: number | null;
          meta_title: string | null;
          meta_description: string | null;
          hero_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cities']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['cities']['Insert']>;
      };
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      calculate_booking_price: {
        Args: {
          p_city_id: string;
          p_vehicle_class: string;
          p_distance_miles: number;
        };
        Returns: Json;
      };
      assign_driver_to_booking: {
        Args: {
          p_booking_id: string;
          p_driver_id: string;
        };
        Returns: boolean;
      };
      complete_booking: {
        Args: {
          p_booking_id: string;
        };
        Returns: boolean;
      };
      get_driver_weekly_earnings: {
        Args: {
          p_driver_id: string;
          p_week_start: string;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
  };
}
