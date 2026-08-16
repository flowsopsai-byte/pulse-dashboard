'use client';

import { useEffect, useRef, useState } from 'react';

const NAVY = '#1B3A6B';
const TEAL = '#2E9E9E';
const TEAL_SOFT = '#e4f2f2';
const INK = '#1a2233';
const SLATE = '#5a6a82';
const MIST = '#8a97ab';
const PAPER = '#dde8f4';
const CARD = '#f3f7fc';
const LINE = '#e6ebf2';

type Msg = { role: 'user' | 'assistant'; text: string };

function getSessionId() {
  if (typeof window === 'undefined') return 'thomas';
  let id = localStorage.getItem('pulse_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('pulse_session_id', id);
  }
  return id;
}

export default function CoachPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', text: "Hey Thomas. Ask me anything about your sleep, training, nutrition or how you're feeling." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, loading]);

  function autoGrow() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    if (taRef.current) taRef.current.style.height = 'auto';
    setMsgs((m) => [...m, { role: 'user', text }]);
    setLoading(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: getSessionId() }),
      });
      const data = await r.json();
      setMsgs((m) => [
        ...m,
        { role: 'assistant', text: data.reply || "Something went wrong. Try again." },
      ]);
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', text: 'Connection failed. Try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div
      style={{
        height: '100svh',
        display: 'flex',
        flexDirection: 'column',
        background: PAPER,
        color: INK,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .coach-scroll::-webkit-scrollbar{ width:0; }
        .coach-ta{ field-sizing:content; }
        .coach-ta::placeholder{ color:${MIST}; }
        @keyframes dotPulse{ 0%,60%,100%{opacity:.25; transform:translateY(0);} 30%{opacity:1; transform:translateY(-3px);} }
        .dot{ width:6px; height:6px; border-radius:50%; background:${SLATE}; display:inline-block; animation:dotPulse 1.2s infinite; }
        .dot:nth-child(2){ animation-delay:.15s; }
        .dot:nth-child(3){ animation-delay:.3s; }
      `}</style>

      <header
        style={{
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          paddingTop: 'calc(14px + env(safe-area-inset-top))',
          background: CARD,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
<a          href="/"
          aria-label="Back to dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: 10,
            color: SLATE,
            textDecoration: 'none',
            flex: '0 0 auto',
          }}
        >
          <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </a>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `linear-gradient(145deg, ${TEAL}, ${NAVY})`,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 15,
            flex: '0 0 auto',
          }}
        >
          P
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15.5, color: NAVY, lineHeight: 1.2 }}>Pulse Coach</div>
          <div style={{ fontSize: 12, color: MIST, lineHeight: 1.3 }}>
            {loading ? 'typing…' : 'online'}
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="coach-scroll"
        style={{
          flex: '1 1 auto',
          overflowY: 'auto',
          padding: '18px 14px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
        }}
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '82%',
              padding: '10px 13px',
              borderRadius: 16,
              borderBottomRightRadius: m.role === 'user' ? 5 : 16,
              borderBottomLeftRadius: m.role === 'user' ? 16 : 5,
              background: m.role === 'user' ? TEAL : CARD,
              color: m.role === 'user' ? '#fff' : INK,
              fontSize: 14.5,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              boxShadow: m.role === 'user'
                ? '0 1px 2px rgba(27,58,107,.18)'
                : '0 1px 2px rgba(27,58,107,.07)',
              border: m.role === 'user' ? 'none' : `1px solid ${LINE}`,
            }}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '12px 15px',
              borderRadius: 16,
              borderBottomLeftRadius: 5,
              background: CARD,
              border: `1px solid ${LINE}`,
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}
      </div>

      <div
        style={{
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 9,
          padding: '10px 12px',
          paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
          background: CARD,
          borderTop: `1px solid ${LINE}`,
        }}
      >
        <textarea
          ref={taRef}
          className="coach-ta"
          value={input}
          rows={1}
          onChange={(e) => { setInput(e.target.value); autoGrow(); }}
          onKeyDown={onKeyDown}
          placeholder="Ask your coach…"
          style={{
            flex: '1 1 auto',
            resize: 'none',
            maxHeight: 120,
            padding: '11px 14px',
            borderRadius: 20,
            border: `1px solid ${LINE}`,
            background: TEAL_SOFT,
            color: INK,
            fontSize: 15,
            lineHeight: 1.4,
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          aria-label="Send"
          style={{
            flex: '0 0 auto',
            width: 42,
            height: 42,
            borderRadius: '50%',
            border: 'none',
            cursor: input.trim() && !loading ? 'pointer' : 'default',
            background: input.trim() && !loading
              ? `linear-gradient(145deg, ${TEAL}, ${NAVY})`
              : '#c3d1e2',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background .18s ease',
          }}
        >
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}