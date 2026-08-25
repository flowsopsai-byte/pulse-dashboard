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
  const { data, error } = await supabase
    .from('seances')
    .select('*')
    .eq('user_id', 1)
    .gte('date', bangkokDay(-7))
    .order('date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}