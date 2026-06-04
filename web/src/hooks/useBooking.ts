import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Booking, BookingFormData, VehicleClass, PriceBreakdown } from '@/types';

// ─── Booking Store ────────────────────────────────────────────────────────────

interface BookingState {
  // Multi-step form state
  currentStep: number;
  formData: Partial<BookingFormData>;
  selectedVehicleClass: VehicleClass | null;
  priceBreakdown: PriceBreakdown | null;

  // Booking result
  confirmedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<BookingFormData>) => void;
  setVehicleClass: (vehicleClass: VehicleClass) => void;
  setPriceBreakdown: (breakdown: PriceBreakdown | null) => void;
  setConfirmedBooking: (booking: Booking | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()((set, get) => ({
  currentStep: 1,
  formData: {},
  selectedVehicleClass: null,
  priceBreakdown: null,
  confirmedBooking: null,
  isLoading: false,
  error: null,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  setVehicleClass: (vehicleClass) => set({ selectedVehicleClass: vehicleClass }),
  setPriceBreakdown: (priceBreakdown) => set({ priceBreakdown }),
  setConfirmedBooking: (confirmedBooking) => set({ confirmedBooking }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  resetBooking: () =>
    set({
      currentStep: 1,
      formData: {},
      selectedVehicleClass: null,
      priceBreakdown: null,
      confirmedBooking: null,
      isLoading: false,
      error: null,
    }),

  // Derived — kept for reference access
  get currentStep() {
    return get().currentStep;
  },
}));

// ─── Booking Hook ─────────────────────────────────────────────────────────────

export const useBooking = () => {
  const store = useBookingStore();

  const createBooking = async (bookingData: Partial<BookingFormData> & { total_price: number; base_price: number; vehicle_class: VehicleClass }): Promise<{ booking: Booking | null; error: string | null }> => {
    store.setLoading(true);
    store.setError(null);

    try {
      const scheduledAt = bookingData.scheduled_date && bookingData.scheduled_time
        ? new Date(`${bookingData.scheduled_date}T${bookingData.scheduled_time}`).toISOString()
        : new Date().toISOString();

      const referenceNumber = `BAR-${Date.now().toString(36).toUpperCase()}`;

      const payload = {
        reference_number: referenceNumber,
        city_id: 'jacksonville-fl', // Default to first live city
        status: 'pending',
        payment_status: 'pending',
        vehicle_class: bookingData.vehicle_class,
        pickup_address: bookingData.pickup_address ?? '',
        dropoff_address: bookingData.dropoff_address ?? '',
        scheduled_at: scheduledAt,
        flight_number: bookingData.flight_number,
        passenger_count: bookingData.passenger_count ?? 1,
        bags_count: bookingData.bags_count ?? 0,
        passenger_name: bookingData.passenger_name ?? '',
        passenger_email: bookingData.passenger_email ?? '',
        passenger_phone: bookingData.passenger_phone ?? '',
        special_requests: bookingData.special_requests,
        base_price: bookingData.base_price,
        total_price: bookingData.total_price,
        promo_code: bookingData.promo_code,
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      const booking = data as Booking;
      store.setConfirmedBooking(booking);
      return { booking, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Booking failed';
      store.setError(message);
      return { booking: null, error: message };
    } finally {
      store.setLoading(false);
    }
  };

  const lookupBooking = async (referenceNumber: string): Promise<{ booking: Booking | null; error: string | null }> => {
    store.setLoading(true);
    store.setError(null);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('reference_number', referenceNumber.toUpperCase())
        .single();

      if (error) throw error;
      return { booking: data as Booking, error: null };
    } catch (_err) {
      const message = 'Booking not found. Please check your reference number.';
      store.setError(message);
      return { booking: null, error: message };
    } finally {
      store.setLoading(false);
    }
  };

  const fetchPassengerBookings = async (passengerId: string): Promise<{ bookings: Booking[]; error: string | null }> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('passenger_id', passengerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { bookings: data as Booking[], error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      return { bookings: [], error: message };
    }
  };

  const calculatePrice = (vehicleClass: VehicleClass, distanceMiles: number): PriceBreakdown => {
    const baseFares: Record<VehicleClass, number> = {
      standard_sedan: 65,
      business_sedan: 95,
      first_class_suv: 145,
      luxury_van: 195,
    };

    const perMileRates: Record<VehicleClass, number> = {
      standard_sedan: 2.5,
      business_sedan: 3.0,
      first_class_suv: 3.75,
      luxury_van: 4.5,
    };

    const base_fare = baseFares[vehicleClass];
    const distance_charge = distanceMiles * perMileRates[vehicleClass];
    const airport_surcharge = 15;
    const surge_multiplier = 1.0;
    const promo_discount = 0;
    const subtotal = (base_fare + distance_charge + airport_surcharge) * surge_multiplier;
    const total = Math.max(subtotal - promo_discount, base_fare);

    return {
      base_fare,
      distance_miles: distanceMiles,
      distance_charge,
      airport_surcharge,
      surge_multiplier,
      promo_discount,
      subtotal,
      total,
    };
  };

  return {
    ...store,
    createBooking,
    lookupBooking,
    fetchPassengerBookings,
    calculatePrice,
  };
};
