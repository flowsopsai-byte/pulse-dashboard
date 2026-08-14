import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data: last } = await supabase
    .from('nutrition')
    .select('date')
    .order('date', { ascending: false })
    .limit(1)

  const day = last && last[0] ? last[0].date : null
  if (!day) return NextResponse.json({ calories: 0, proteines: 0, glucides: 0, lipides: 0, date: null })

  const { data, error } = await supabase
    .from('nutrition')
    .select('calories, proteines, glucides, lipides')
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