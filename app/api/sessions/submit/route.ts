import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()

  const description = typeof body.description === 'string' ? body.description.trim() : ''
  const muscles = Array.isArray(body.muscles) ? body.muscles : []

  if (!body.date) {
    return NextResponse.json({ error: 'date required' }, { status: 400 })
  }

  if (description === '' && muscles.length === 0) {
    return NextResponse.json({ error: 'a session needs muscles or a description' }, { status: 400 })
  }

  const { error } = await supabase.from('seances').insert({
    user_id: 1,
    date: body.date,
    muscles,
    description,
    duree: 0
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request) {
  const body = await req.json()

  if (!body.id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const description = typeof body.description === 'string' ? body.description.trim() : ''
  const muscles = Array.isArray(body.muscles) ? body.muscles : []

  if (description === '' && muscles.length === 0) {
    return NextResponse.json({ error: 'a session needs muscles or a description' }, { status: 400 })
  }

  const { error } = await supabase
    .from('seances')
    .update({
      date: body.date,
      muscles,
      description
    })
    .eq('id', body.id)
    .eq('user_id', 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const body = await req.json()

  if (!body.id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('seances')
    .delete()
    .eq('id', body.id)
    .eq('user_id', 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}