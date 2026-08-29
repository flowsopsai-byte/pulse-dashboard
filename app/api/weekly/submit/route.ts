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
    const periodeFin = today()

    const { data: last } = await supabase
      .from('bilan_hebdo')
      .select('periode_fin')
      .eq('user_id', 1)
      .order('created_at', { ascending: false })
      .limit(1)

    const periodeDebut = last && last[0]
      ? last[0].periode_fin
      : (() => {
          const d = new Date(periodeFin + 'T00:00:00')
          d.setDate(d.getDate() - 7)
          return d.toISOString().slice(0, 10)
        })()

    const phqScore = ['phq1', 'phq2', 'phq3', 'phq4']
      .reduce((t, k) => t + (Number(b[k]) || 0), 0)

    const gadScore = ['gad1', 'gad2', 'gad3', 'gad4']
      .reduce((t, k) => t + (Number(b[k]) || 0), 0)

    const positifScore = ['pos1', 'pos2', 'pos3', 'pos4']
      .reduce((t, k) => t + (Number(b[k]) || 0), 0)

    const row = {
      user_id: 1,
      periode_debut: periodeDebut,
      periode_fin: periodeFin,
      phq_score: phqScore,
      gad_score: gadScore,
      positif_score: positifScore,
      plus_dur: b.plus_dur || null,
      plus_marche: b.plus_marche || null,
      note_semaine: b.note_semaine ?? null,
      cbt_utilite_semaine: b.cbt_utilite_semaine ?? null,
      objectif_gym: b.objectif_gym || null,
      objectif_nutrition: b.objectif_nutrition || null,
      objectif_sommeil: b.objectif_sommeil || null,
      objectif_autre: b.objectif_autre || null,
    }

    const { data: inserted, error } = await supabase
      .from('bilan_hebdo')
      .insert(row)
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const webhookUrl = process.env.N8N_WEEKLY_WEBHOOK_URL
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bilan_id: inserted.id }),
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true, id: inserted.id })
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}