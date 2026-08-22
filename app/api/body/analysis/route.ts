import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('body_analysis')
    .select('date, points_forts, points_faibles, priorites, commentaire')
    .eq('user_id', 1)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data && data.length ? data[0] : null)
}

export async function POST(req: Request) {
  const body = await req.json()

  if (!body.image) {
    return NextResponse.json({ error: 'image required' }, { status: 400 })
  }

  const r = await fetch('https://n8n.flowsopsai.com/webhook/pulse-web', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'physique', image: body.image })
  })

  if (!r.ok) {
    return NextResponse.json({ error: 'n8n error' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}