import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio') as File | null;

    if (!audio) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    if (audio.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'Audio file too large' }, { status: 400 });
    }

    const openaiForm = new FormData();
    openaiForm.append('file', audio, 'recording.webm');
    openaiForm.append('model', 'whisper-1');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openaiForm,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Whisper error:', errText);
      return NextResponse.json({ error: 'Transcription failed' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ text: data.text ?? '' });
  } catch (e) {
    console.error('Transcribe route error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}