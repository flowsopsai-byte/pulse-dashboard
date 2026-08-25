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
  const day = bangkokDay(-1)

  const { data, error } = await supabase
    .from('nutrition')
    .select('calories, proteines, glucides, lipides')
    .eq('user_id', 1)
    .eq('date', day)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const sum = (k: string) => (data || []).reduce((t, r: any) => t + (Number(r[k]) || 0), 0)

  return NextResponse.json({
    date: day,
    calories: sum('calories'),
    proteines: sum('proteines'),
    glucides: sum('glucides'),
    lipides: sum('lipides')
  })
}