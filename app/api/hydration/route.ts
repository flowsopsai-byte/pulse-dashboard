import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function bangkokDay(offsetDays = 0): string {
  const t = new Date(Date.now() + 7 * 3600 * 1000)
  t.setUTCDate(t.getUTCDate() + offsetDays)
  return t.toISOString().slice(0, 10)
}

export async function GET() {
  const today = bangkokDay()
  const startUtc = new Date(today + 'T00:00:00+07:00').toISOString()

  const { data: drinks, error } = await supabase
    .from('hydratation')
    .select('quantite_ml')
    .gte('created_at', startUtc)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const total = (drinks || []).reduce((t, r: any) => t + (Number(r.quantite_ml) || 0), 0)

  const { data: body } = await supabase
    .from('body_composition')
    .select('poids')
    .eq('user_id', 1)
    .not('poids', 'is', null)
    .order('date', { ascending: false })
    .limit(1)

  const poids = body && body[0] ? Number(body[0].poids) : 88

  const { data: sessions } = await supabase
    .from('seances')
    .select('id')
    .eq('user_id', 1)
    .eq('date', today)
    .limit(1)

  const trained = !!(sessions && sessions.length)

  const base = Math.round(poids * 35)
  const goal = base + (trained ? 1000 : 0)

  return NextResponse.json({ total, goal, base, trained, poids })
}

export async function POST(req: Request) {
  const body = await req.json()

  const allowed = ['cafe', 'verre', 'litre', 'bouteille']
  if (!allowed.includes(body.boisson)) {
    return NextResponse.json({ error: 'invalid boisson' }, { status: 400 })
  }

  const r = await fetch('https://n8n.flowsopsai.com/webhook/pulse-web', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'hydratation', boisson: body.boisson })
  })

  if (!r.ok) {
    return NextResponse.json({ error: 'n8n error' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}