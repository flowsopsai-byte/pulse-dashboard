import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function todayBangkok() {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)
}

export async function GET() {
  const { data, error } = await supabase
    .from('mood_log')
    .select('valeur')
    .eq('user_id', 1)
    .eq('date', todayBangkok())

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const count = data.length
  const avg = count ? data.reduce((s, r) => s + r.valeur, 0) / count : null

  return NextResponse.json({ average: avg, count })
}

export async function POST(req: Request) {
  const body = await req.json()

  if (typeof body.valeur !== 'number' || body.valeur < 1 || body.valeur > 10) {
    return NextResponse.json({ error: 'valeur must be 1-10' }, { status: 400 })
  }

  const { error } = await supabase.from('mood_log').insert({
    user_id: 1,
    date: todayBangkok(),
    valeur: body.valeur
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}