import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const since = new Date()
  since.setDate(since.getDate() - 7)

  const { data, error } = await supabase
    .from('seances')
    .select('*')
    .gte('date', since.toISOString().slice(0, 10))
    .order('date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}