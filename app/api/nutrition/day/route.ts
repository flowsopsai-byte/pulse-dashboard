import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'date required' }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: 'missing env' }, { status: 500 });
  }

  const res = await fetch(
    `${url}/rest/v1/nutrition?date=eq.${date}&order=created_at.asc`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'supabase error' }, { status: 500 });
  }

  const meals = await res.json();

  const totals = meals.reduce(
    (acc: any, m: any) => ({
      calories: acc.calories + (m.calories || 0),
      proteines: acc.proteines + (m.proteines || 0),
      glucides: acc.glucides + (m.glucides || 0),
      lipides: acc.lipides + (m.lipides || 0),
      fibres: acc.fibres + (m.fibres || 0),
      vitamine_c: acc.vitamine_c + (m.vitamine_c || 0),
      vitamine_d: acc.vitamine_d + (m.vitamine_d || 0),
      fer: acc.fer + (m.fer || 0),
      magnesium: acc.magnesium + (m.magnesium || 0),
    }),
    {
      calories: 0,
      proteines: 0,
      glucides: 0,
      lipides: 0,
      fibres: 0,
      vitamine_c: 0,
      vitamine_d: 0,
      fer: 0,
      magnesium: 0,
    }
  );

  const notes = meals.filter((m: any) => m.note).map((m: any) => m.note);
  const note_moyenne = notes.length
    ? Math.round((notes.reduce((a: number, b: number) => a + b, 0) / notes.length) * 10) / 10
    : null;

  return NextResponse.json({ date, meals, totals, note_moyenne });
}