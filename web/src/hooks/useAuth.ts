import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { User, UserRole } from '@/types';

// ─── Auth Store State ─────────────────────────────────────────────────────────

interface AuthState {
  user: SupabaseUser | null;
  profile: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  setUser: (user: SupabaseUser | null) => void;
  setProfile: (profile: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          user: null,
          profile: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'bookairportride-auth',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);

// ─── Auth Hook ────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const { user, profile, isLoading, isInitialized, error, setUser, setProfile, setLoading, setInitialized, setError, reset } =
    useAuthStore();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        reset();
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data as User);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  // ─── Auth Actions ───────────────────────────────────────────────────────────

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: { full_name?: string; role?: UserRole }) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithMagicLink = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Magic link failed';
      setError(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      reset();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: 'Not authenticated' };
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      setProfile(data as User);
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed';
      return { data: null, error: message };
    }
  };

  return {
    user,
    profile,
    isLoading,
    isInitialized,
    error,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isDriver: profile?.role === 'driver',
    isPassenger: profile?.role === 'passenger',
    signIn,
    signUp,
    signInWithMagicLink,
    signOut,
    updateProfile,
  };
};
