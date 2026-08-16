'use client';

import { useState } from 'react';

const NAVY = '#1B3A6B';
const TEAL = '#2E9E9E';
const TEAL_SOFT = '#e4f2f2';
const INK = '#1a2233';
const SLATE = '#5a6a82';
const MIST = '#8a97ab';
const PAPER = '#dde8f4';
const CARD = '#f3f7fc';
const LINE = '#e6ebf2';

const EMOTIONS = ['Joy', 'Calm', 'Pride', 'Frustration', 'Anxiety', 'Sadness', 'Anger', 'Fatigue'];

type Answers = {
  humeur: number | null;
  stress: number | null;
  energie: number | null;
  productivite: number | null;
  emotion_dominante: string;
  reaction_disproportionnee: string;
  raconte: string;
  declencheur: string;
  pensee_recurrente: string;
  point_positif: string;
};

const EMPTY: Answers = {
  humeur: null, stress: null, energie: null, productivite: null,
  emotion_dominante: '', reaction_disproportionnee: '',
  raconte: '', declencheur: '', pensee_recurrente: '', point_positif: '',
};

export default function CheckinPage() {
  const [a, setA] = useState<Answers>(EMPTY);
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const showReaction = a.reaction_disproportionnee === 'Yes';

  const steps: { key: keyof Answers; n: string; title: string; sub: string; type: 'scale' | 'choice' | 'text'; options?: string[]; required: boolean }[] = [
    { key: 'humeur', n: '1', title: 'Overall mood', sub: 'Looking back on your day, how do you feel?', type: 'scale', required: true },
    { key: 'stress', n: '2', title: 'Stress level', sub: 'How pressured or tense did you feel today?', type: 'scale', required: true },
    { key: 'energie', n: '3', title: 'Energy level', sub: 'How was your physical and mental vitality today?', type: 'scale', required: true },
    { key: 'productivite', n: '4', title: 'Productivity', sub: 'Were you productive today?', type: 'scale', required: true },
    { key: 'emotion_dominante', n: '5', title: 'Dominant emotion', sub: 'Which emotion shaped your day the most?', type: 'choice', options: EMOTIONS, required: true },
    { key: 'reaction_disproportionnee', n: '6', title: 'Overreaction', sub: 'Was there a moment you reacted more strongly than the situation deserved?', type: 'choice', options: ['Yes', 'No'], required: true },
    { key: 'raconte', n: '6a', title: 'What happened', sub: 'Describe that moment in a few words.', type: 'text', required: false },
    { key: 'declencheur', n: '6b', title: 'The trigger', sub: 'What set off that reaction?', type: 'text', required: false },
    { key: 'pensee_recurrente', n: '7', title: 'Recurring thought', sub: 'Any thought or worry looping in your head right now?', type: 'text', required: false },
    { key: 'point_positif', n: '8', title: 'Positive note', sub: 'What felt good today?', type: 'text', required: true },
  ];

  const visible = steps.filter((s) => (s.key === 'raconte' || s.key === 'declencheur' ? showReaction : true));
  const cur = visible[step];
  const total = visible.length;
  const val = a[cur.key];
  const filled = cur.type === 'scale' ? val !== null : String(val).trim() !== '';
  const canNext = filled || !cur.required;
  const isLast = step === total - 1;

  function set(key: keyof Answers, v: string | number) {
    setA((p) => ({ ...p, [key]: v }));
  }

  function next() {
    if (!canNext) return;
    if (isLast) return submit();
    setStep((s) => s + 1);
  }

  async function submit() {
    setSending(true);
    setErr('');
    try {
      const r = await fetch('/api/checkin/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(a),
      });
      const d = await r.json();
      if (d.ok) setDone(true);
      else setErr('Saving failed. Try again.');
    } catch {
      setErr('Connection failed. Try again.');
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div style={{ height: '100svh', background: PAPER, color: INK, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ width: 62, height: 62, borderRadius: '50%', background: `linear-gradient(145deg, ${TEAL}, ${NAVY})`, display: 'grid', placeItems: 'center' }}>
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, color: NAVY }}>Check-in saved</div>
        <div style={{ fontSize: 14.5, color: SLATE, textAlign: 'center', maxWidth: 300, lineHeight: 1.5 }}>
          Your coach will factor this into tomorrow morning&apos;s briefing.
        </div>
        <a href="/" style={{ marginTop: 6, padding: '12px 26px', borderRadius: 24, background: `linear-gradient(145deg, ${TEAL}, ${NAVY})`, color: '#fff', textDecoration: 'none', fontSize: 14.5, fontWeight: 600 }}>
          Back to dashboard
        </a>
      </div>
    );
  }

  return (
    <div style={{ height: '100svh', display: 'flex', flexDirection: 'column', background: PAPER, color: INK, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' }}>
      <style>{`
        .ck-ta::placeholder{ color:${MIST}; }
        .ck-ta:focus{ border-color:${TEAL}; }
      `}</style>

      <header style={{ flex: '0 0 auto', padding: '16px 18px 12px', paddingTop: 'calc(16px + env(safe-area-inset-top))', background: CARD, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 560, margin: '0 auto 12px' }}>
          <a href="/" aria-label="Back" style={{ color: SLATE, display: 'flex', textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </a>
          <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>Evening check-in</div>
          <div style={{ fontSize: 12.5, color: MIST, fontVariantNumeric: 'tabular-nums' }}>{step + 1}/{total}</div>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: '#cfdcec', overflow: 'hidden', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ height: '100%', width: `${((step + 1) / total) * 100}%`, background: TEAL, borderRadius: 2, transition: 'width .25s ease' }} />
        </div>
      </header>

      <div style={{ flex: '1 1 auto', overflowY: 'auto', padding: '30px 20px 20px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, letterSpacing: .8, marginBottom: 7 }}>QUESTION {cur.n}</div>
          <div style={{ fontSize: 21, fontWeight: 700, color: NAVY, lineHeight: 1.25, marginBottom: 8 }}>{cur.title}</div>
          <div style={{ fontSize: 14.5, color: SLATE, lineHeight: 1.5, marginBottom: 26 }}>{cur.sub}</div>

       {cur.type === 'scale' && (
            <div style={{ maxWidth: 420 }}>
              {[[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10]].map((row, ri) => (
                <div key={ri} style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: ri ? 10 : 0 }}>
                  {row.map((n) => {
                    const on = val === n;
                    return (
                      <button key={n} onClick={() => set(cur.key, n)}
                        style={{ flex: '0 0 auto', width: 56, height: 56, borderRadius: 14, border: on ? 'none' : `1px solid ${LINE}`, background: on ? `linear-gradient(145deg, ${TEAL}, ${NAVY})` : CARD, color: on ? '#fff' : INK, fontSize: 16.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {n}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {cur.type === 'choice' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
              {cur.options!.map((o) => {
                const on = val === o;
                return (
                  <button key={o} onClick={() => set(cur.key, o)}
                    style={{ padding: '12px 20px', borderRadius: 22, border: on ? 'none' : `1px solid ${LINE}`, background: on ? `linear-gradient(145deg, ${TEAL}, ${NAVY})` : CARD, color: on ? '#fff' : INK, fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {o}
                  </button>
                );
              })}
            </div>
          )}

          {cur.type === 'text' && (
            <textarea className="ck-ta" value={String(val)} onChange={(e) => set(cur.key, e.target.value)}
              placeholder={cur.required ? 'Your answer…' : 'Your answer (optional)…'} rows={5}
              style={{ width: '100%', resize: 'none', padding: '14px 16px', borderRadius: 15, border: `1px solid ${LINE}`, background: TEAL_SOFT, color: INK, fontSize: 15.5, lineHeight: 1.5, fontFamily: 'inherit', outline: 'none' }} />
          )}

          {err && <div style={{ marginTop: 16, fontSize: 13.5, color: '#c0392b' }}>{err}</div>}
        </div>
      </div>

      <div style={{ flex: '0 0 auto', padding: '12px 18px', paddingBottom: 'calc(14px + env(safe-area-inset-bottom))', background: CARD, borderTop: `1px solid ${LINE}` }}>
        <div style={{ display: 'flex', gap: 10, maxWidth: 560, margin: '0 auto' }}>
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)}
              style={{ padding: '14px 22px', borderRadius: 26, border: `1px solid ${LINE}`, background: 'transparent', color: SLATE, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Back
            </button>
          )}
          <button onClick={next} disabled={!canNext || sending}
            style={{ flex: 1, padding: '14px 0', borderRadius: 26, border: 'none', background: canNext && !sending ? `linear-gradient(145deg, ${TEAL}, ${NAVY})` : '#c3d1e2', color: '#fff', fontSize: 15.5, fontWeight: 600, cursor: canNext && !sending ? 'pointer' : 'default', fontFamily: 'inherit' }}>
            {sending ? 'Saving…' : isLast ? 'Finish' : filled ? 'Next' : 'Skip'}
          </button>
        </div>
      </div>
    </div>
  );
}