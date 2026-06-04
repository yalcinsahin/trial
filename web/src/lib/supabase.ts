// Supabase client placeholder — configure with env vars when deploying
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export { supabaseUrl, supabaseAnonKey };

// Mock function stubs until Supabase is connected
export async function submitBooking(data: Record<string, unknown>) {
  console.log('Booking submitted:', data);
  return { id: `BAR-${Date.now()}`, status: 'pending' };
}

export async function submitDriverApplication(data: Record<string, unknown>) {
  console.log('Driver application submitted:', data);
  return { id: `DA-${Date.now()}`, status: 'pending' };
}

export async function submitAgencyApplication(data: Record<string, unknown>) {
  console.log('Agency application submitted:', data);
  return { id: `AA-${Date.now()}`, status: 'pending' };
}

export async function validatePromoCode(code: string): Promise<{ valid: boolean; discount?: number; type?: 'percent' | 'fixed' }> {
  // Placeholder — connect to Supabase promo_codes table
  const mockCodes: Record<string, { discount: number; type: 'percent' | 'fixed' }> = {
    'WELCOME10': { discount: 10, type: 'percent' },
    'FIRST25': { discount: 25, type: 'fixed' },
    'JAX20': { discount: 20, type: 'fixed' },
  };
  const entry = mockCodes[code.toUpperCase()];
  if (entry) return { valid: true, ...entry };
  return { valid: false };
}
