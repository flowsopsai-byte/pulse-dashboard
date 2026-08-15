import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.image) {
      return NextResponse.json({ error: 'image required' }, { status: 400 });
    }

    const res = await fetch('https://n8n.flowsopsai.com/webhook/pulse-web', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'photo', image: body.image }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'n8n error' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}