'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

const NAVY = '#1B3A6B';
const TEAL = '#2E9E9E';
const GOLD = '#D4A843';
const INK = '#1a2233';
const SLATE = '#5a6a82';
const MIST = '#8a97ab';
const PAPER = '#dde8f4';
const CARD = '#f3f7fc';
const LINE = '#e6ebf2';

type Bilan = {
  id: string;
  periode_debut: string;
  periode_fin: string;
  phq_score: number | null;
  gad_score: number | null;
  positif_score: number | null;
  note_semaine: number | null;
  plus_dur: string | null;
  plus_marche: string | null;
  objectif_gym: string | null;
  objectif_nutrition: string | null;
  objectif_sommeil: string | null;
  objectif_autre: string | null;
  bilan_texte: string | null;
  cbt_recap: { date: string; lever: string }[];
  audio_url: string | null;
};

const SECTIONS = [
  'Pulse Score',
  'Sleep and recovery',
  'Training',
  'Nutrition and hydration',
  'Emotional trajectory',
  'Psychological state',
  'CBT techniques this week',
  "Last week's goals",
  'Goals for the coming week',
  'Stoic reflection',
];

function parseSections(text: string) {
  const out: { title: string | null; body: string }[] = [];
  const lines = text.split('\n');
  let current: { title: string | null; body: string } = { title: null, body: '' };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (SECTIONS.includes(line)) {
      if (current.body.trim()) out.push(current);
      current = { title: line, body: '' };
    } else {
      current.body += (current.body ? ' ' : '') + line;
    }
  }
  if (current.body.trim()) out.push(current);
  return out;
}

export default function WeeklyReviewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [bilan, setBilan] = useState<Bilan | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [level, setLevel] = useState<number[]>(new Array(32).fill(0));
  const [shared, setShared] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/weekly/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setBilan)
      .catch(() => setErr('Review not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
      ctxRef.current?.close();
    };
  }, []);

  function fmt(s: number) {
    if (!isFinite(s) || s < 0) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + String(sec).padStart(2, '0');
  }

  function initGraph(audio: HTMLAudioElement) {
    if (ctxRef.current) return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const src = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      src.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
    } catch {
      ctxRef.current = null;
    }
  }

  function tick() {
    const analyser = analyserRef.current;
    const audio = audioRef.current;
    if (audio) setCurrent(audio.currentTime);
    if (analyser) {
      const buf = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(buf);
      const bars: number[] = [];
      const step = Math.floor(buf.length / 32) || 1;
      for (let i = 0; i < 32; i++) bars.push(buf[i * step] / 255);
      setLevel(bars);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function toggleAudio() {
    if (!bilan?.audio_url) return;

    if (playing) {
      audioRef.current?.pause();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setPlaying(false);
      return;
    }

    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(bilan.audio_url);
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;
      audio.onloadedmetadata = () => setDuration(audio!.duration);
      audio.onended = () => {
        setPlaying(false);
        setCurrent(0);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        setLevel(new Array(32).fill(0));
      };
      audio.onerror = () => setPlaying(false);
    }

    initGraph(audio);
    ctxRef.current?.resume();

    audio.play()
      .then(() => {
        setPlaying(true);
        tick();
      })
      .catch(() => setPlaying(false));
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = Math.max(0, Math.min(duration, pct * duration));
    setCurrent(audio.currentTime);
  }

  async function share() {
    const url = window.location.href;
    const title = `My weekly review — ${bilan?.periode_debut} to ${bilan?.periode_fin}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // nothing
    }
  }

  const wrap = {
    minHeight: '100svh',
    background: PAPER,
    color: INK,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as const;

  if (loading) {
    return (
      <div style={{ ...wrap, display: 'grid', placeItems: 'center' }}>
        <div style={{ fontSize: 14, color: MIST }}>Loading…</div>
      </div>
    );
  }

  if (err || !bilan) {
    return (
      <div style={{ ...wrap, display: 'grid', placeItems: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, color: NAVY, fontWeight: 600, marginBottom: 10 }}>
            {err || 'Something went wrong'}
          </div>
          <a href="/" style={{ fontSize: 14, color: TEAL, textDecoration: 'none' }}>Back to dashboard</a>
        </div>
      </div>
    );
  }

  const sections = bilan.bilan_texte ? parseSections(bilan.bilan_texte) : [];
  const goals = [
    { label: 'Gym', value: bilan.objectif_gym },
    { label: 'Nutrition', value: bilan.objectif_nutrition },
    { label: 'Sleep', value: bilan.objectif_sommeil },
    { label: 'Other', value: bilan.objectif_autre },
  ].filter((g) => g.value && g.value.trim());

  return (
    <div style={wrap}>
      <header style={{ background: NAVY, padding: '20px 20px 26px', paddingTop: 'calc(20px + env(safe-area-inset-top))', borderBottom: `2px solid ${GOLD}` }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <a href="/" aria-label="Back" style={{ display: 'inline-flex', color: 'rgba(255,255,255,.6)', textDecoration: 'none', marginBottom: 18 }}>
            <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </a>
          <div style={{ fontSize: 10, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>
            Weekly review · {bilan.periode_debut} – {bilan.periode_fin}
          </div>
          <div style={{ fontSize: 27, color: '#fff', fontWeight: 300, lineHeight: 1.2 }}>
            Your week, <span style={{ color: TEAL, fontStyle: 'italic' }}>Thomas.</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 18px 40px' }}>
        {bilan.audio_url && (
          <div style={{ border: `1px solid ${LINE}`, background: CARD, borderRadius: 16, padding: '16px 18px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <button onClick={toggleAudio} aria-label={playing ? 'Pause' : 'Play'} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', background: `linear-gradient(145deg, ${TEAL}, ${NAVY})`, cursor: 'pointer', display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="#fff">
                  {playing ? (
                    <>
                      <rect x="7" y="6" width="3.5" height="12" rx="1" />
                      <rect x="13.5" y="6" width="3.5" height="12" rx="1" />
                    </>
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
              </button>

              <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 26, marginBottom: 7 }}>
                  {level.map((v, i) => (
                    <div key={i} style={{ flex: 1, height: `${Math.max(2, v * 26)}px`, background: playing ? TEAL : '#c3d1e2', borderRadius: 1, transition: 'height .08s linear' }} />
                  ))}
                </div>

                <div onClick={seek} style={{ height: 4, borderRadius: 2, background: '#cfdcec', cursor: 'pointer', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: duration ? `${(current / duration) * 100}%` : '0%', background: TEAL, borderRadius: 2 }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: MIST, fontVariantNumeric: 'tabular-nums' }}>{fmt(current)}</span>
                  <span style={{ fontSize: 11, color: MIST, fontVariantNumeric: 'tabular-nums' }}>{fmt(duration)}</span>
                </div>
              </div>

              <button onClick={share} aria-label="Share" style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${LINE}`, background: 'transparent', color: shared ? TEAL : SLATE, cursor: 'pointer', display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>
                {shared ? (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
                    <path d="M16 6l-4-4-4 4" />
                    <path d="M12 2v13" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
          {[
            { label: 'Week', value: bilan.note_semaine != null ? `${bilan.note_semaine}/10` : '—' },
            { label: 'Positive', value: bilan.positif_score ?? '—' },
            { label: 'PHQ', value: bilan.phq_score ?? '—' },
            { label: 'GAD', value: bilan.gad_score ?? '—' },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: CARD, border: `1px solid ${LINE}`, borderRadius: 14, padding: '14px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, color: NAVY, fontWeight: 600, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 9.5, color: MIST, textTransform: 'uppercase', letterSpacing: 1.4, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            {s.title && (
              <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 9 }}>
                {s.title}
              </div>
            )}
            <div style={{ fontSize: 15, lineHeight: 1.65, color: s.title ? INK : SLATE }}>{s.body}</div>
          </div>
        ))}

        {goals.length > 0 && (
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 16, padding: '18px 20px', marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 14 }}>
              Your goals this week
            </div>
            {goals.map((g) => (
              <div key={g.label} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11.5, color: MIST, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{g.label}</div>
                <div style={{ fontSize: 14.5, color: INK, lineHeight: 1.5 }}>{g.value}</div>
              </div>
            ))}
          </div>
        )}

        {bilan.cbt_recap?.length > 0 && (
          <details style={{ marginTop: 20 }}>
            <summary style={{ fontSize: 13, color: TEAL, fontWeight: 600, cursor: 'pointer', padding: '10px 0' }}>
              CBT techniques proposed this week ({bilan.cbt_recap.length})
            </summary>
            <div style={{ paddingTop: 8 }}>
              {bilan.cbt_recap.map((c, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: MIST, marginBottom: 3 }}>{c.date}</div>
                  <div style={{ fontSize: 14, color: SLATE, lineHeight: 1.5 }}>{c.lever}</div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}