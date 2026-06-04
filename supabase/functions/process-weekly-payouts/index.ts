import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // Get all pending earnings
    const { data: pendingEarnings } = await supabase
      .from('driver_earnings')
      .select('*, drivers(*, users(email, full_name))')
      .eq('payout_status', 'pending')

    if (!pendingEarnings || pendingEarnings.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending payouts' }), { headers: corsHeaders })
    }

    // Group by driver
    const byDriver = pendingEarnings.reduce((acc: Record<string, typeof pendingEarnings>, earning) => {
      const driverId = earning.driver_id
      if (!acc[driverId]) acc[driverId] = []
      acc[driverId].push(earning)
      return acc
    }, {})

    const results = []
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)
    const weekEnd = new Date()

    for (const [driverId, earnings] of Object.entries(byDriver)) {
      const totalGross = earnings.reduce((s, e) => s + e.gross_amount, 0)
      const totalFees = earnings.reduce((s, e) => s + e.platform_fee, 0)
      const totalNet = earnings.reduce((s, e) => s + e.net_amount, 0)
      const driver = earnings[0].drivers

      // Create Stripe transfer (placeholder — integrate with Stripe Connect)
      // const transfer = await stripe.transfers.create({ amount: Math.round(totalNet * 100), currency: 'usd', destination: driver.stripe_connect_account_id })

      const { data: payout } = await supabase.from('weekly_payouts').insert({
        driver_id: driverId,
        week_start: weekStart.toISOString().split('T')[0],
        week_end: weekEnd.toISOString().split('T')[0],
        total_rides: earnings.length,
        total_gross: totalGross,
        total_platform_fee: totalFees,
        total_net_earnings: totalNet,
        payout_status: 'paid',
        paid_at: new Date().toISOString(),
      }).select().single()

      // Mark earnings as paid
      await supabase.from('driver_earnings').update({ payout_status: 'paid' }).in('id', earnings.map((e) => e.id))

      results.push({ driverId, totalNet, payoutId: payout?.id })
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 })
  }
})
