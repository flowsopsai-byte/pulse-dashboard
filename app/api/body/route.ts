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
    .from('body_composition')
    .select('date, poids, masse_grasse')
    .eq('user_id', 1)
    .order('date', { ascending: false })
    .limit(90)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: goals } = await supabase
    .from('body_goals')
    .select('poids_cible, masse_grasse_cible')
    .eq('id', 1)
    .limit(1)

  return NextResponse.json({
    entries: data,
    goals: goals && goals.length ? goals[0] : null
  })
}
export async function POST(req: Request) {
  const body = await req.json()

  const poids = typeof body.poids === 'number' ? body.poids : null
  const mg = typeof body.masse_grasse === 'number' ? body.masse_grasse : null

  if (poids === null && mg === null) {
    return NextResponse.json({ error: 'nothing to save' }, { status: 400 })
  }

  if (poids !== null && (poids < 30 || poids > 250)) {
    return NextResponse.json({ error: 'poids out of range' }, { status: 400 })
  }

  if (mg !== null && (mg < 3 || mg > 60)) {
    return NextResponse.json({ error: 'masse_grasse out of range' }, { status: 400 })
  }

  const today = todayBangkok()

  const { data: existing } = await supabase
    .from('body_composition')
    .select('id')
    .eq('user_id', 1)
    .eq('date', today)
    .limit(1)

  if (existing && existing.length > 0) {
    const patch: Record<string, number> = {}
    if (poids !== null) patch.poids = poids
    if (mg !== null) patch.masse_grasse = mg

    const { error } = await supabase
      .from('body_composition')
      .update(patch)
      .eq('id', existing[0].id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  const { data: prev } = await supabase
    .from('body_composition')
    .select('poids, masse_grasse')
    .eq('user_id', 1)
    .order('date', { ascending: false })
    .limit(1)

  const carry = prev && prev.length ? prev[0] : { poids: null, masse_grasse: null }

  const { error } = await supabase.from('body_composition').insert({
    user_id: 1,
    date: today,
    poids: poids !== null ? poids : carry.poids,
    masse_grasse: mg !== null ? mg : carry.masse_grasse
  })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}