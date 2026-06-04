import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Driver, Booking, DriverEarnings, WeeklyPayout } from '@/types';

interface DriverState {
  driver: Driver | null;
  isLoading: boolean;
  error: string | null;
}

export const useDriver = (userId?: string) => {
  const [state, setState] = useState<DriverState>({
    driver: null,
    isLoading: false,
    error: null,
  });

  const fetchDriver = useCallback(async () => {
    if (!userId) return;
    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setState({ driver: data as Driver, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch driver profile';
      setState((s) => ({ ...s, isLoading: false, error: message }));
    }
  }, [userId]);

  const updateOnlineStatus = async (driverId: string, isOnline: boolean) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .update({ is_online: isOnline })
        .eq('id', driverId);

      if (error) throw error;

      // Update driver_locations table
      await supabase.from('driver_locations').upsert({
        driver_id: driverId,
        is_online: isOnline,
        lat: 0,
        lng: 0,
      });

      setState((s) =>
        s.driver ? { ...s, driver: { ...s.driver, is_online: isOnline } } : s
      );
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      return { error: message };
    }
  };

  const fetchAssignedBookings = async (driverId: string): Promise<{ bookings: Booking[]; error: string | null }> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('driver_id', driverId)
        .in('status', ['assigned', 'en_route', 'arrived', 'in_progress'])
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return { bookings: data as Booking[], error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      return { bookings: [], error: message };
    }
  };

  const fetchCompletedBookings = async (driverId: string): Promise<{ bookings: Booking[]; error: string | null }> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('driver_id', driverId)
        .eq('status', 'completed')
        .order('dropoff_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return { bookings: data as Booking[], error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch completed bookings';
      return { bookings: [], error: message };
    }
  };

  const fetchEarnings = async (driverId: string, weekStart?: string): Promise<{ earnings: DriverEarnings[]; error: string | null }> => {
    try {
      let query = supabase
        .from('driver_earnings')
        .select('*')
        .eq('driver_id', driverId)
        .order('earned_at', { ascending: false });

      if (weekStart) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        query = query.gte('earned_at', weekStart).lt('earned_at', weekEnd.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return { earnings: data as DriverEarnings[], error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch earnings';
      return { earnings: [], error: message };
    }
  };

  const fetchPayouts = async (driverId: string): Promise<{ payouts: WeeklyPayout[]; error: string | null }> => {
    try {
      const { data, error } = await supabase
        .from('weekly_payouts')
        .select('*')
        .eq('driver_id', driverId)
        .order('week_start', { ascending: false })
        .limit(12);

      if (error) throw error;
      return { payouts: data as WeeklyPayout[], error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch payouts';
      return { payouts: [], error: message };
    }
  };

  const updateRideStatus = async (
    bookingId: string,
    status: 'en_route' | 'arrived' | 'in_progress' | 'completed'
  ) => {
    try {
      const updates: Record<string, string> = { status };
      const now = new Date().toISOString();

      if (status === 'arrived') updates.driver_arrived_at = now;
      if (status === 'in_progress') updates.pickup_at = now;
      if (status === 'completed') updates.dropoff_at = now;

      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update ride status';
      return { error: message };
    }
  };

  return {
    driver: state.driver,
    isLoading: state.isLoading,
    error: state.error,
    fetchDriver,
    updateOnlineStatus,
    fetchAssignedBookings,
    fetchCompletedBookings,
    fetchEarnings,
    fetchPayouts,
    updateRideStatus,
  };
};
