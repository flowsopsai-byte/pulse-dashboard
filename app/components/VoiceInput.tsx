'use client';

import { useRef, useState } from 'react';

type Props = {
  onTranscript: (text: string) => void;
  className?: string;
};

export default function VoiceInput({ onTranscript, className = '' }: Props) {
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stopStream();
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];

        if (blob.size < 1000) {
          setError('Recording too short');
          return;
        }

        setBusy(true);
        try {
          const fd = new FormData();
          fd.append('audio', blob, 'recording.webm');

          const res = await fetch('/api/transcribe', { method: 'POST', body: fd });
          if (!res.ok) throw new Error('Transcription failed');

          const data = await res.json();
          if (data.text) onTranscript(data.text.trim());
          else setError('Nothing to transcribe');
        } catch {
          setError('Transcription failed');
        } finally {
          setBusy(false);
        }
      };

      recorder.start();
      setRecording(true);
    } catch {
      setError('Microphone unavailable');
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  };

  const toggle = () => (recording ? stop() : start());

  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-label={recording ? 'Stop' : 'Dictate'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '10px 18px',
          borderRadius: 22,
          border: 'none',
          cursor: busy ? 'wait' : 'pointer',
          background: recording ? '#c0392b' : 'linear-gradient(145deg, #2E9E9E, #1B3A6B)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'inherit',
          opacity: busy ? 0.6 : 1,
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {recording ? (
            <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />
          ) : (
            <>
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <path d="M12 19v3" />
            </>
          )}
        </svg>
        {busy ? 'Transcribing…' : recording ? 'Stop' : 'Dictate'}
      </button>
      {error && (
        <span style={{ fontSize: 12.5, color: '#c0392b' }}>{error}</span>
      )}
    </div>
  );
}