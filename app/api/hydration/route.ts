import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const allowed = ['cafe', 'verre', 'litre']
  if (!allowed.includes(body.boisson)) {
    return NextResponse.json({ error: 'invalid boisson' }, { status: 400 })
  }

  const r = await fetch('https://n8n.flowsopsai.com/webhook/pulse-web', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'hydratation', boisson: body.boisson })
  })

  if (!r.ok) {
    return NextResponse.json({ error: 'n8n error' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}