import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('bilan_hebdo')
      .select('*')
      .eq('id', id)
      .eq('user_id', 1)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    let cbtRecap = [];
    if (data.cbt_recap) {
      try {
        cbtRecap = typeof data.cbt_recap === 'string'
          ? JSON.parse(data.cbt_recap)
          : data.cbt_recap;
      } catch {
        cbtRecap = [];
      }
    }

    return NextResponse.json({ ...data, cbt_recap: cbtRecap });
  } catch (e) {
    console.error('Weekly fetch error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}