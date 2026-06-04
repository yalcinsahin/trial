import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

  // Verify signature (simplified — use stripe.webhooks.constructEvent in production)
  if (!signature) return new Response('Unauthorized', { status: 401 })

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  let event
  try {
    event = JSON.parse(body)
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const paymentIntent = event.data?.object

  switch (event.type) {
    case 'payment_intent.succeeded':
      await supabase
        .from('bookings')
        .update({ payment_status: 'paid', status: 'confirmed' })
        .eq('stripe_payment_intent_id', paymentIntent.id)
      break

    case 'payment_intent.payment_failed':
      await supabase
        .from('bookings')
        .update({ payment_status: 'unpaid' })
        .eq('stripe_payment_intent_id', paymentIntent.id)
      break

    case 'charge.refunded':
      await supabase
        .from('bookings')
        .update({ payment_status: 'refunded', status: 'cancelled' })
        .eq('stripe_payment_intent_id', paymentIntent.payment_intent)
      break
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
