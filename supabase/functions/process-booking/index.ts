import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const body = await req.json()
    const {
      tripType, pickupAddress, dropoffAddress, pickupDate, pickupTime,
      airline, flightNumber, passengersCount, bagsCount, meetAndGreet,
      vehicleClass, firstName, lastName, email, phone, promoCode,
      totalPrice, baseFare, distanceMiles,
    } = body

    const pickupDatetime = new Date(`${pickupDate}T${pickupTime}`)

    // Validate promo code if provided
    let promoDiscount = 0
    if (promoCode) {
      const { data: promo } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (promo) {
        promoDiscount = promo.discount_type === 'percent'
          ? Math.round((totalPrice * promo.discount_value / 100) * 100) / 100
          : promo.discount_value
        // Increment usage
        await supabase.from('promo_codes').update({ uses_count: promo.uses_count + 1 }).eq('id', promo.id)
      }
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress,
        pickup_datetime: pickupDatetime.toISOString(),
        airline,
        flight_number: flightNumber,
        passengers_count: passengersCount,
        bags_count: bagsCount,
        meet_and_greet: meetAndGreet,
        vehicle_class: vehicleClass,
        distance_miles: distanceMiles,
        base_price: baseFare,
        total_price: totalPrice - promoDiscount,
        promo_code: promoCode || null,
        promo_discount: promoDiscount,
        status: 'pending',
        payment_status: 'unpaid',
        passenger_first_name: firstName,
        passenger_last_name: lastName,
        passenger_email: email,
        passenger_phone: phone,
      })
      .select()
      .single()

    if (error) throw error

    // Send confirmation email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'BookAirportRide <reservations@bookairportride.com>',
          to: email,
          subject: `Booking Confirmed — Ref #${booking.id.split('-')[0].toUpperCase()}`,
          html: `
            <h1>Your Booking is Confirmed</h1>
            <p>Dear ${firstName},</p>
            <p>Your BookAirportRide reservation has been confirmed.</p>
            <p><strong>Reference:</strong> ${booking.id}</p>
            <p><strong>From:</strong> ${pickupAddress}</p>
            <p><strong>To:</strong> ${dropoffAddress}</p>
            <p><strong>Date/Time:</strong> ${pickupDatetime.toLocaleString()}</p>
            <p><strong>Vehicle:</strong> ${vehicleClass}</p>
            <p><strong>Total:</strong> $${(totalPrice - promoDiscount).toFixed(2)}</p>
            <p>A driver will be assigned 24 hours before your pickup. You will receive their contact information by email and SMS.</p>
            <p>Thank you for choosing BookAirportRide.</p>
          `
        })
      })

      // Notify admin
      const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'info@bookairportride.com'
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'BookAirportRide System <no-reply@bookairportride.com>',
          to: adminEmail,
          subject: `New Booking — ${firstName} ${lastName} — ${vehicleClass}`,
          html: `<p>New booking received. ID: ${booking.id}</p><p>Passenger: ${firstName} ${lastName} (${email})</p><p>From: ${pickupAddress}</p><p>To: ${dropoffAddress}</p><p>Time: ${pickupDatetime.toLocaleString()}</p><p>Total: $${(totalPrice - promoDiscount).toFixed(2)}</p>`
        })
      })
    }

    return new Response(JSON.stringify({ booking }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
