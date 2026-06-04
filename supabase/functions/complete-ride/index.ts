import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
const PLATFORM_FEE = 0.20

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { bookingId } = await req.json()
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { data: booking } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (!booking) throw new Error('Booking not found')
    if (!booking.driver_id) throw new Error('No driver assigned')

    // Mark booking complete
    await supabase.from('bookings').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', bookingId)

    // Calculate earnings
    const grossAmount = booking.total_price
    const platformFee = Math.round(grossAmount * PLATFORM_FEE * 100) / 100
    const netAmount = Math.round((grossAmount - platformFee) * 100) / 100

    // Record driver earnings
    await supabase.from('driver_earnings').insert({
      driver_id: booking.driver_id,
      booking_id: bookingId,
      gross_amount: grossAmount,
      platform_fee: platformFee,
      net_amount: netAmount,
      payout_status: 'pending',
    })

    // Update driver total rides
    await supabase.rpc('increment_driver_rides', { driver_id: booking.driver_id })

    return new Response(JSON.stringify({ success: true, netAmount }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 })
  }
})
