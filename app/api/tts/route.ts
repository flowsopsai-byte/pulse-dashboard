import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'onyx',
        input: text.slice(0, 4000),
        speed: 1.0,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('TTS error:', errText);
      return NextResponse.json({ error: 'TTS failed' }, { status: 502 });
    }


    return new NextResponse(res.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    console.error('TTS route error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}