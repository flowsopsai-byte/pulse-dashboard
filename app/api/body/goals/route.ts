import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()

  const poids = typeof body.poids_cible === 'number' ? body.poids_cible : null
  const mg = typeof body.masse_grasse_cible === 'number' ? body.masse_grasse_cible : null

  if (poids === null && mg === null) {
    return NextResponse.json({ error: 'nothing to save' }, { status: 400 })
  }

  if (poids !== null && (poids < 30 || poids > 250)) {
    return NextResponse.json({ error: 'poids out of range' }, { status: 400 })
  }

  if (mg !== null && (mg < 3 || mg > 60)) {
    return NextResponse.json({ error: 'masse_grasse out of range' }, { status: 400 })
  }

  const patch: Record<string, number> = {}
  if (poids !== null) patch.poids_cible = poids
  if (mg !== null) patch.masse_grasse_cible = mg

  const { error } = await supabase
    .from('body_goals')
    .update(patch)
    .eq('id', 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}