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

type Answers = {
  phq1: number | null; phq2: number | null; phq3: number | null; phq4: number | null;
  gad1: number | null; gad2: number | null; gad3: number | null; gad4: number | null;
  pos1: number | null; pos2: number | null; pos3: number | null; pos4: number | null;
  plus_dur: string;
  plus_marche: string;
  note_semaine: number | null;
  cbt_utilite_semaine: number | null;
  objectif_gym: string;
  objectif_nutrition: string;
  objectif_sommeil: string;
  objectif_autre: string;
};

const EMPTY: Answers = {
  phq1: null, phq2: null, phq3: null, phq4: null,
  gad1: null, gad2: null, gad3: null, gad4: null,
  pos1: null, pos2: null, pos3: null, pos4: null,
  plus_dur: '', plus_marche: '',
  note_semaine: null, cbt_utilite_semaine: null,
  objectif_gym: '', objectif_nutrition: '', objectif_sommeil: '', objectif_autre: '',
};

const SCALE = ['Not really', 'A little', 'Quite a bit', 'A lot'];
const SCALE_POS = ['Not really', 'A little', 'Quite a bit', 'A lot'];

export default function WeeklyPage() {
  const [a, setA] = useState<Answers>(EMPTY);
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const steps: { key: keyof Answers; n: string; title: string; sub: string; type: 'scale4' | 'scale4pos' | 'text' | 'number10'; required: boolean }[] = [
    { key: 'phq1', n: '1', title: 'Interest and pleasure', sub: 'Have you lost interest or pleasure in things you usually enjoy this week?', type: 'scale4', required: true },
    { key: 'phq2', n: '2', title: 'Mood', sub: 'Have you felt down, low, or hopeless this week?', type: 'scale4', required: true },
    { key: 'phq3', n: '3', title: 'Sleep', sub: 'Has your sleep been disrupted this week — too little or too much?', type: 'scale4', required: true },
    { key: 'phq4', n: '4', title: 'Energy', sub: 'Have you felt tired or low on energy this week?', type: 'scale4', required: true },
    { key: 'gad1', n: '5', title: 'Nervousness', sub: 'Have you felt nervous, anxious, or on edge this week?', type: 'scale4', required: true },
    { key: 'gad2', n: '6', title: 'Worry control', sub: 'Has it been hard to stop worrying once you start?', type: 'scale4', required: true },
    { key: 'gad3', n: '7', title: 'Relaxing', sub: 'Has it been hard to actually relax this week?', type: 'scale4', required: true },
    { key: 'gad4', n: '8', title: 'Irritability', sub: 'Have you felt easily annoyed or irritated this week?', type: 'scale4', required: true },
    { key: 'pos1', n: '9', title: 'Engagement', sub: 'Have you felt genuinely engaged or absorbed in something this week?', type: 'scale4pos', required: true },
    { key: 'pos2', n: '10', title: 'Connection', sub: 'Have you felt connected to someone this week?', type: 'scale4pos', required: true },
    { key: 'pos3', n: '11', title: 'Pride', sub: 'Have you felt proud of something you did this week?', type: 'scale4pos', required: true },
    { key: 'pos4', n: '12', title: 'Physical wellbeing', sub: 'Have you felt physically good in your body this week?', type: 'scale4pos', required: true },
    { key: 'plus_dur', n: '13', title: 'The hardest part', sub: 'What was the hardest part of this week?', type: 'text', required: false },
    { key: 'plus_marche', n: '14', title: 'What worked', sub: 'What went well this week?', type: 'text', required: false },
    { key: 'note_semaine', n: '15', title: 'Overall rating', sub: 'How would you rate this week overall?', type: 'number10', required: true },
    { key: 'cbt_utilite_semaine', n: '16', title: 'CBT techniques', sub: 'How useful were the techniques suggested this week, overall?', type: 'number10', required: true },
    { key: 'objectif_gym', n: '17', title: 'Training goal', sub: 'What is your training goal for next week?', type: 'text', required: false },
    { key: 'objectif_nutrition', n: '18', title: 'Nutrition goal', sub: 'What is your nutrition goal for next week?', type: 'text', required: false },
    { key: 'objectif_sommeil', n: '19', title: 'Sleep goal', sub: 'What is your sleep goal for next week?', type: 'text', required: false },
    { key: 'objectif_autre', n: '20', title: 'Anything else', sub: 'Any other goal for next week?', type: 'text', required: false },
  ];

  const cur = steps[step];
  const total = steps.length;
  const val = a[cur.key];
  const filled = cur.type === 'scale4' || cur.type === 'scale4pos' || cur.type === 'number10'
    ? val !== null
    : String(val).trim() !== '';
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
      const r = await fetch('/api/weekly/submit', {
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
        <div style={{ fontSize: 19, fontWeight: 700, color: NAVY }}>Weekly review saved</div>
        <div style={{ fontSize: 14.5, color: SLATE, textAlign: 'center', maxWidth: 300, lineHeight: 1.5 }}>
          Your coach is preparing your weekly review now.
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
        .wk-ta::placeholder{ color:${MIST}; }
        .wk-ta:focus{ border-color:${TEAL}; }
      `}</style>

      <header style={{ flex: '0 0 auto', padding: '16px 18px 12px', paddingTop: 'calc(16px + env(safe-area-inset-top))', background: CARD, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 560, margin: '0 auto 12px' }}>
          <a href="/" aria-label="Back" style={{ color: SLATE, display: 'flex', textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </a>
          <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>Weekly review</div>
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

          {(cur.type === 'scale4' || cur.type === 'scale4pos') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, maxWidth: 420 }}>
              {(cur.type === 'scale4' ? SCALE : SCALE_POS).map((label, i) => {
                const on = val === i;
                return (
                  <button key={i} onClick={() => set(cur.key, i)}
                    style={{ textAlign: 'left', padding: '13px 16px', borderRadius: 14, border: on ? 'none' : `1px solid ${LINE}`, background: on ? `linear-gradient(145deg, ${TEAL}, ${NAVY})` : CARD, color: on ? '#fff' : INK, fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {cur.type === 'number10' && (
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

          {cur.type === 'text' && (
            <textarea className="wk-ta" value={String(val)} onChange={(e) => set(cur.key, e.target.value)}
              placeholder={cur.required ? 'Your answer…' : 'Your answer (optional)…'} rows={6}
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