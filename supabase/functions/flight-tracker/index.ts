import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  // Get upcoming bookings with flight numbers (next 6 hours)
  const now = new Date()
  const sixHoursLater = new Date(now.getTime() + 6 * 3600 * 1000)

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .not('flight_number', 'is', null)
    .in('status', ['confirmed', 'assigned'])
    .gte('pickup_datetime', now.toISOString())
    .lte('pickup_datetime', sixHoursLater.toISOString())

  if (!bookings || bookings.length === 0) {
    return new Response(JSON.stringify({ checked: 0 }), { headers: { 'Content-Type': 'application/json' } })
  }

  // For each booking, check flight status via AviationStack or similar API
  // This is a placeholder — integrate with your preferred flight tracking API
  const results = []

  for (const booking of bookings) {
    try {
      // Example: AviationStack API
      // const flightApiKey = Deno.env.get('AVIATION_STACK_KEY')
      // const resp = await fetch(`https://api.aviationstack.com/v1/flights?access_key=${flightApiKey}&flight_iata=${booking.flight_number}`)
      // const flightData = await resp.json()
      // const flight = flightData.data?.[0]
      // if (flight?.arrival?.estimated) {
      //   const newPickupTime = new Date(flight.arrival.estimated)
      //   await supabase.from('bookings').update({ pickup_datetime: newPickupTime.toISOString() }).eq('id', booking.id)
      // }

      results.push({ bookingId: booking.id, flightNumber: booking.flight_number, checked: true })
    } catch (err) {
      results.push({ bookingId: booking.id, error: err.message })
    }
  }

  return new Response(JSON.stringify({ checked: results.length, results }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
