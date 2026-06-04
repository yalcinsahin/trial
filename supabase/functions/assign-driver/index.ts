import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { bookingId, driverId } = await req.json()
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ driver_id: driverId, status: 'assigned' })
      .eq('id', bookingId)
      .select('*, drivers(*, users(full_name, email))')
      .single()

    if (error) throw error

    // Send push notification to driver
    const { data: driver } = await supabase
      .from('drivers')
      .select('*, users(expo_push_token, full_name)')
      .eq('id', driverId)
      .single()

    if (driver?.users?.expo_push_token) {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-push-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}` },
        body: JSON.stringify({
          messages: [{
            to: driver.users.expo_push_token,
            title: 'New Ride Request',
            body: `Pickup at ${booking.pickup_address}`,
            data: { screen: 'DriverIncomingRide', bookingId },
          }]
        })
      })
    }

    return new Response(JSON.stringify({ booking }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 })
  }
})
