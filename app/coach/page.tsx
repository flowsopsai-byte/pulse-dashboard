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

type Msg = { role: 'user' | 'assistant'; text: string; audioUrl?: string };

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
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, loading]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioRef.current?.pause();
    };
  }, []);

  function autoGrow() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }

  async function speak(text: string, index: number) {
    try {
      const r = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!r.ok) return;
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      setMsgs((m) => m.map((msg, i) => (i === index ? { ...msg, audioUrl: url } : msg)));
      audioRef.current?.pause();
      const audio = new Audio(url);
      audioRef.current = audio;
      setSpeaking(true);
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch {
      setSpeaking(false);
    }
  }

  function replay(url: string) {
    audioRef.current?.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    setSpeaking(true);
    audio.onended = () => setSpeaking(false);
    audio.onerror = () => setSpeaking(false);
    audio.play().catch(() => setSpeaking(false));
  }

  function stopSpeaking() {
    audioRef.current?.pause();
    setSpeaking(false);
  }

  async function send(text: string, viaVoice = false) {
    const clean = text.trim();
    if (!clean || loading) return;
    setInput('');
    if (taRef.current) taRef.current.style.height = 'auto';
    setMsgs((m) => [...m, { role: 'user', text: clean }]);
    setLoading(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean, session_id: getSessionId() }),
      });
      const data = await r.json();
      const reply = data.reply || 'Something went wrong. Try again.';
      let newIndex = 0;
      setMsgs((m) => {
        newIndex = m.length;
        return [...m, { role: 'assistant', text: reply }];
      });
      if (viaVoice && data.reply) {
        setTimeout(() => speak(reply, newIndex), 0);
      }
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', text: 'Connection failed. Try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        if (blob.size < 1000) return;
        setTranscribing(true);
        try {
          const fd = new FormData();
          fd.append('audio', blob, 'recording.webm');
          const res = await fetch('/api/transcribe', { method: 'POST', body: fd });
          if (!res.ok) throw new Error();
          const data = await res.json();
          if (data.text?.trim()) send(data.text.trim(), true);
        } catch {
          setMsgs((m) => [...m, { role: 'assistant', text: "I couldn't hear that. Try again." }]);
        } finally {
          setTranscribing(false);
        }
      };
      recorder.start();
      setRecording(true);
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', text: 'Microphone unavailable.' }]);
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  }

  function toggleMic() {
    if (speaking) stopSpeaking();
    if (recording) stopRecording();
    else startRecording();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const busy = loading || transcribing;

  return (
    <div style={{ height: '100svh', display: 'flex', flexDirection: 'column', background: PAPER, color: INK, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' }}>
      <style>{`
        .coach-scroll::-webkit-scrollbar{ width:0; }
        .coach-ta{ field-sizing:content; }
        .coach-ta::placeholder{ color:${MIST}; }
        @keyframes dotPulse{ 0%,60%,100%{opacity:.25; transform:translateY(0);} 30%{opacity:1; transform:translateY(-3px);} }
        .dot{ width:6px; height:6px; border-radius:50%; background:${SLATE}; display:inline-block; animation:dotPulse 1.2s infinite; }
        .dot:nth-child(2){ animation-delay:.15s; }
        .dot:nth-child(3){ animation-delay:.3s; }
        @keyframes recPulse{ 0%,100%{ box-shadow:0 0 0 0 rgba(192,57,43,.5);} 50%{ box-shadow:0 0 0 8px rgba(192,57,43,0);} }
        .rec{ animation:recPulse 1.4s infinite; }
      `}</style>

      <header style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', paddingTop: 'calc(14px + env(safe-area-inset-top))', background: CARD, borderBottom: `1px solid ${LINE}` }}>
        <a href="/" aria-label="Back to dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10, color: SLATE, textDecoration: 'none', flex: '0 0 auto' }}>
          <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </a>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(145deg, ${TEAL}, ${NAVY})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flex: '0 0 auto' }}>
          P
        </div>
        <div style={{ minWidth: 0, flex: '1 1 auto' }}>
          <div style={{ fontWeight: 700, fontSize: 15.5, color: NAVY, lineHeight: 1.2 }}>Pulse Coach</div>
          <div style={{ fontSize: 12, color: MIST, lineHeight: 1.3 }}>
            {recording ? 'listening…' : transcribing ? 'transcribing…' : loading ? 'typing…' : speaking ? 'speaking…' : 'online'}
          </div>
        </div>
        {speaking && (
          <button onClick={stopSpeaking} aria-label="Stop audio" style={{ flex: '0 0 auto', width: 34, height: 34, borderRadius: 10, border: `1px solid ${LINE}`, background: 'transparent', color: SLATE, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        )}
      </header>

      <div ref={scrollRef} className="coach-scroll" style={{ flex: '1 1 auto', overflowY: 'auto', padding: '18px 14px 8px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ padding: '10px 13px', borderRadius: 16, borderBottomRightRadius: m.role === 'user' ? 5 : 16, borderBottomLeftRadius: m.role === 'user' ? 16 : 5, background: m.role === 'user' ? TEAL : CARD, color: m.role === 'user' ? '#fff' : INK, fontSize: 14.5, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', boxShadow: m.role === 'user' ? '0 1px 2px rgba(27,58,107,.18)' : '0 1px 2px rgba(27,58,107,.07)', border: m.role === 'user' ? 'none' : `1px solid ${LINE}` }}>
              {m.text}
            </div>
            {m.audioUrl && (
              <button onClick={() => replay(m.audioUrl!)} aria-label="Replay" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 14, border: `1px solid ${LINE}`, background: 'transparent', color: SLATE, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Replay
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '12px 15px', borderRadius: 16, borderBottomLeftRadius: 5, background: CARD, border: `1px solid ${LINE}`, display: 'flex', gap: 4, alignItems: 'center' }}>
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}
      </div>

      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end', gap: 9, padding: '10px 12px', paddingBottom: 'calc(10px + env(safe-area-inset-bottom))', background: CARD, borderTop: `1px solid ${LINE}` }}>
        <button onClick={toggleMic} disabled={busy && !recording} aria-label={recording ? 'Stop recording' : 'Record'} className={recording ? 'rec' : ''} style={{ flex: '0 0 auto', width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: busy && !recording ? 'default' : 'pointer', background: recording ? '#c0392b' : busy ? '#c3d1e2' : `linear-gradient(145deg, ${TEAL}, ${NAVY})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .18s ease' }}>
          {recording ? (
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <path d="M12 19v3" />
            </svg>
          )}
        </button>

        <textarea ref={taRef} className="coach-ta" value={input} rows={1} onChange={(e) => { setInput(e.target.value); autoGrow(); }} onKeyDown={onKeyDown} placeholder={recording ? 'Listening…' : 'Ask your coach…'} disabled={recording} style={{ flex: '1 1 auto', resize: 'none', maxHeight: 120, padding: '11px 14px', borderRadius: 20, border: `1px solid ${LINE}`, background: TEAL_SOFT, color: INK, fontSize: 15, lineHeight: 1.4, fontFamily: 'inherit', outline: 'none' }} />

        <button onClick={() => send(input)} disabled={!input.trim() || busy} aria-label="Send" style={{ flex: '0 0 auto', width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: input.trim() && !busy ? 'pointer' : 'default', background: input.trim() && !busy ? `linear-gradient(145deg, ${TEAL}, ${NAVY})` : '#c3d1e2', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .18s ease' }}>
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}