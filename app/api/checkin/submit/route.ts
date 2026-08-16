import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

function today() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export async function POST(req: Request) {
  try {
    const b = await req.json()

    const row = {
      user_id: 1,
      date: today(),
      humeur: b.humeur ?? null,
      stress: b.stress ?? null,
      energie: b.energie ?? null,
      productivite: b.productivite ?? null,
      emotion_dominante: b.emotion_dominante || null,
      reaction_disproportionnee: b.reaction_disproportionnee || null,
      raconte: b.raconte || null,
      declencheur: b.declencheur || null,
      pensee_recurrente: b.pensee_recurrente || null,
      point_positif: b.point_positif || null,
    }

    const { error } = await supabase.from('checkin_soir').insert(row)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}