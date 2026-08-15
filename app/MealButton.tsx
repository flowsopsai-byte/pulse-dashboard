'use client';

import { useRef, useState } from 'react';

const TEAL = '#2E9E9E';
const NAVY = '#1B3A6B';
const CARD = '#f3f7fc';
const LINE = '#e6ebf2';
const MIST = '#8a97ab';
const INK = '#1a2233';

async function resize(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 900;
  const scale = Math.min(max / bitmap.width, max / bitmap.height, 1);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no ctx');
  ctx.drawImage(bitmap, 0, 0, w, h);

  return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
}

export default function MealButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setState('loading');

    try {
      const image = await resize(file);
      const res = await fetch('/api/meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });

      if (!res.ok) throw new Error('failed');

      setState('done');
      setTimeout(() => setState('idle'), 3500);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 3500);
    }

    if (inputRef.current) inputRef.current.value = '';
  }

  const label =
    state === 'loading'
      ? 'Analysing...'
      : state === 'done'
      ? 'Meal logged'
      : state === 'error'
      ? 'Failed, try again'
      : 'Log a meal';

  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${LINE}`,
        borderRadius: 18,
        padding: 22,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFile}
        style={{ display: 'none' }}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={state === 'loading'}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          border: 'none',
          background: state === 'done' ? TEAL : NAVY,
          color: '#fff',
          fontSize: 22,
          cursor: state === 'loading' ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background .3s',
        }}
      >
        {state === 'loading' ? (
          <span
            style={{
              width: 20,
              height: 20,
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              display: 'block',
              animation: 'spin .8s linear infinite',
            }}
          />
        ) : state === 'done' ? (
          '\u2713'
        ) : (
          '\u1F4F7'
        )}
      </button>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 13, color: MIST }}>
          {state === 'done' ? (
            <a href="/nutrition" style={{ color: TEAL, textDecoration: 'none', fontWeight: 600 }}>
              See details
            </a>
          ) : (
            'Take a photo, macros are logged automatically'
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}