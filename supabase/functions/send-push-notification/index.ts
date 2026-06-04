import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

interface PushMessage {
  to: string | string[]
  title: string
  body: string
  data?: Record<string, unknown>
  sound?: string
  badge?: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { messages }: { messages: PushMessage[] } = await req.json()

    const expoToken = Deno.env.get('EXPO_ACCESS_TOKEN')
    const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Accept-Encoding': 'gzip, deflate' }
    if (expoToken) headers['Authorization'] = `Bearer ${expoToken}`

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(messages),
    })

    const result = await response.json()
    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 })
  }
})
