'use client';

import { useEffect, useState } from 'react';

type Entry = { date: string; poids: number | null; masse_grasse: number | null };
type Goals = { poids_cible: number | null; masse_grasse_cible: number | null };

export default function BodyPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [goals, setGoals] = useState<Goals | null>(null);
  const [range, setRange] = useState(90);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analysing, setAnalysing] = useState(false);
  const [aErr, setAErr] = useState('');

  function load() {
    fetch('/api/body')
      .then(r => r.json())
      .then(d => {
        setEntries(d.entries || []);
        setGoals(d.goals || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  function loadAnalysis() {
    fetch('/api/body/analysis')
      .then(r => r.json())
      .then(d => setAnalysis(d))
      .catch(() => {});
  }

  useEffect(() => { load(); loadAnalysis(); }, []);

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalysing(true);
    setAErr('');

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = String(reader.result).split(',')[1];
      fetch('/api/body/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: b64 })
      })
        .then(r => r.json())
        .then(d => {
          if (d.error) setAErr('Analysis failed. Try another photo.');
          else loadAnalysis();
          setAnalysing(false);
        })
        .catch(() => {
          setAErr('Network error.');
          setAnalysing(false);
        });
    };
    reader.onerror = () => {
      setAErr('Could not read the file.');
      setAnalysing(false);
    };
    reader.readAsDataURL(file);
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - range);
  const shown = entries
    .filter(e => new Date(e.date) >= cutoff)
    .slice()
    .reverse();

  const last = entries[0];

  return (
    <div className="body-page">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <header>
        <a href="/" className="back">&#8592; Dashboard</a>
        <h1>Body composition</h1>
      </header>

      {loading ? (
        <div className="empty">Loading...</div>
      ) : (
        <>
          <Summary last={last} goals={goals} entries={entries} onSaved={load} />

          <section className="card">
            <div className="card-head">
              <div className="card-title">Trend</div>
              <div className="ranges">
                {[30, 60, 90].map(r => (
                  <button
                    key={r}
                    className={range === r ? 'on' : ''}
                    onClick={() => setRange(r)}
                  >{r}d</button>
                ))}
              </div>
            </div>
            <Chart entries={shown} goals={goals} />
            <div className="legend">
              <span><i style={{ background: '#1B3A6B' }} />Weight</span>
              <span><i style={{ background: '#D4A843' }} />% fat</span>
              <span><i className="dash" />Target</span>
            </div>
          </section>

          <section className="card">
            <div className="card-head"><div className="card-title">History</div></div>
            {shown.length === 0 ? (
              <div className="empty">No entries in this range.</div>
            ) : (
              <ul className="hist">
                {shown.slice().reverse().map(e => (
                  <li key={e.date}>
                    <span className="hd">{e.date}</span>
                    <span className="hv">{e.poids ?? '--'} kg</span>
                    <span className="hv muted">{e.masse_grasse ?? '--'} %</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <div className="card-head">
              <div className="card-title">Physique analysis</div>
              <label className="ghost-btn photo-btn">
                {analysing ? 'Analysing...' : 'New photo'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={analysing}
                  onChange={onPhoto}
                />
              </label>
            </div>

            {aErr && <div className="goal-err">{aErr}</div>}

            {analysing ? (
              <div className="empty">Reading your photo — this takes a few seconds.</div>
            ) : !analysis ? (
              <div className="empty">No analysis yet. Take a front-facing photo in good light.</div>
            ) : (
              <div className="analysis">
                <div className="a-date">
                  {analysis.date || analysis.created_at
                    ? String(analysis.date || analysis.created_at).slice(0, 10)
                    : ''}
                </div>

                {analysis.commentaire && (
                  <p className="a-comment">{analysis.commentaire}</p>
                )}

                <AField label="Strengths" value={analysis.points_forts} tone="good" />
                <AField label="Weak points" value={analysis.points_faibles} tone="warn" />
                <AField label="Priorities" value={analysis.priorites} tone="prio" />
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Summary({
  last, goals, entries, onSaved
}: {
  last: Entry | undefined;
  goals: Goals | null;
  entries: Entry[];
  onSaved: () => void;
}) {
  const [panel, setPanel] = useState<'none' | 'log' | 'goals'>('none');

  const today = new Date().toLocaleDateString('en-CA');
  const loggedToday = last?.date === today;

  return (
    <section className="card summary">
      <div className="card-head">
        <div className="card-title">Current</div>
        <div className="head-actions">
          {loggedToday && <span className="logged-tag">Logged today</span>}
          <button
            className={panel === 'log' ? 'primary-btn on' : 'primary-btn'}
            onClick={() => setPanel(panel === 'log' ? 'none' : 'log')}
          >
            {panel === 'log' ? 'Close' : 'Log'}
          </button>
        </div>
      </div>

      <div className="vals">
        <div className="val">
          <div className="val-main"><b>{last?.poids ?? '--'}</b><small>kg</small></div>
          <div className="val-sub">
            <span>target {goals?.poids_cible ?? '--'}</span>
            <button
              className="edit-pen"
              aria-label="Edit targets"
              onClick={() => setPanel(panel === 'goals' ? 'none' : 'goals')}
            >&#9998;</button>
            {goals?.poids_cible != null && last?.poids != null && (
              <span className="togo">
                &middot; {(last.poids - goals.poids_cible).toFixed(1)} to go
              </span>
            )}
          </div>
        </div>

        <div className="val">
          <div className="val-main"><b>{last?.masse_grasse ?? '--'}</b><small>% fat</small></div>
          <div className="val-sub">
            <span>target {goals?.masse_grasse_cible ?? '--'}</span>
            <button
              className="edit-pen"
              aria-label="Edit targets"
              onClick={() => setPanel(panel === 'goals' ? 'none' : 'goals')}
            >&#9998;</button>
            {goals?.masse_grasse_cible != null && last?.masse_grasse != null && (
              <span className="togo">
                &middot; {(last.masse_grasse - goals.masse_grasse_cible).toFixed(1)} to go
              </span>
            )}
          </div>
        </div>
      </div>

      {panel === 'log' && (
        <LogPanel last={last} onDone={() => { setPanel('none'); onSaved(); }} />
      )}

      {panel === 'goals' && (
        <GoalsPanel goals={goals} onDone={() => { setPanel('none'); onSaved(); }} />
      )}

      <Insights entries={entries} goals={goals} />
    </section>
  );
}

function LogPanel({ last, onDone }: { last: Entry | undefined; onDone: () => void }) {
  const [poids, setPoids] = useState('');
  const [mg, setMg] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function save() {
    setErr('');

    const payload: Record<string, number> = {};

    if (poids.trim() !== '') {
      const v = Number(poids);
      if (!Number.isFinite(v)) { setErr('Weight is not a number'); return; }
      if (v < 30 || v > 250) { setErr('Weight must be between 30 and 250 kg'); return; }
      payload.poids = v;
    }

    if (mg.trim() !== '') {
      const v = Number(mg);
      if (!Number.isFinite(v)) { setErr('Body fat is not a number'); return; }
      if (v < 3 || v > 60) { setErr('Body fat must be between 3 and 60 %'); return; }
      payload.masse_grasse = v;
    }

    if (Object.keys(payload).length === 0) {
      setErr('Enter a weight or a body fat value');
      return;
    }

    setSaving(true);
    try {
      const r = await fetch('/api/body', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(d.error || 'Save failed');
        setSaving(false);
        return;
      }
      setSaving(false);
      onDone();
    } catch {
      setSaving(false);
      setErr('Network error');
    }
  }

  return (
    <div className="panel">
      <div className="panel-row">
        <div className="panel-field">
          <label htmlFor="log-weight">Weight (kg)</label>
          <input
            id="log-weight"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="30"
            max="250"
            placeholder={last?.poids != null ? String(last.poids) : '--'}
            value={poids}
            onChange={e => setPoids(e.target.value)}
          />
        </div>
        <div className="panel-field">
          <label htmlFor="log-fat">Body fat (%)</label>
          <input
            id="log-fat"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="3"
            max="60"
            placeholder={last?.masse_grasse != null ? String(last.masse_grasse) : '--'}
            value={mg}
            onChange={e => setMg(e.target.value)}
          />
        </div>
        <button className="primary-btn tall" onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      {err && <div className="goal-err">{err}</div>}
    </div>
  );
}

function GoalsPanel({ goals, onDone }: { goals: Goals | null; onDone: () => void }) {
  const [poids, setPoids] = useState(goals?.poids_cible != null ? String(goals.poids_cible) : '');
  const [mg, setMg] = useState(goals?.masse_grasse_cible != null ? String(goals.masse_grasse_cible) : '');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function save() {
    setErr('');

    const payload: Record<string, number> = {};

    if (poids.trim() !== '') {
      const v = Number(poids);
      if (!Number.isFinite(v)) { setErr('Weight target is not a number'); return; }
      if (v < 30 || v > 250) { setErr('Weight target must be between 30 and 250 kg'); return; }
      payload.poids_cible = v;
    }

    if (mg.trim() !== '') {
      const v = Number(mg);
      if (!Number.isFinite(v)) { setErr('Body fat target is not a number'); return; }
      if (v < 3 || v > 60) { setErr('Body fat target must be between 3 and 60 %'); return; }
      payload.masse_grasse_cible = v;
    }

    if (Object.keys(payload).length === 0) {
      setErr('Nothing to save');
      return;
    }

    setSaving(true);
    try {
      const r = await fetch('/api/body/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(d.error || 'Save failed');
        setSaving(false);
        return;
      }
      setSaving(false);
      onDone();
    } catch {
      setSaving(false);
      setErr('Network error');
    }
  }

  return (
    <div className="panel">
      <div className="panel-label">Targets</div>
      <div className="panel-row">
        <div className="panel-field">
          <label htmlFor="goal-weight">Weight target (kg)</label>
          <input
            id="goal-weight"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="30"
            max="250"
            value={poids}
            onChange={e => setPoids(e.target.value)}
          />
        </div>
        <div className="panel-field">
          <label htmlFor="goal-fat">Body fat target (%)</label>
          <input
            id="goal-fat"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="3"
            max="60"
            value={mg}
            onChange={e => setMg(e.target.value)}
          />
        </div>
        <button className="primary-btn tall" onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      {err && <div className="goal-err">{err}</div>}
    </div>
  );
}

function AField({ label, value, tone }: { label: string; value: unknown; tone: string }) {
  const items = Array.isArray(value)
    ? value.map(v => String(v)).filter(Boolean)
    : typeof value === 'string' && value.trim() !== ''
      ? value.split(/\r?\n|(?:^|\s)[-•]\s+/).map(v => v.trim()).filter(Boolean)
      : [];

  if (items.length === 0) return null;

  return (
    <div className={'a-field a-' + tone}>
      <span className="a-label">{label}</span>
      <ul>
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  );
}

function Insights({ entries, goals }: { entries: Entry[]; goals: Goals | null }) {
  const withW = entries.filter(e => e.poids != null);
  if (withW.length < 2) {
    return <div className="insights"><span className="muted">Log a few more entries to see trends.</span></div>;
  }

  const last = withW[0];
  const cutoff = new Date(last.date);
  cutoff.setDate(cutoff.getDate() - 30);

  let ref = withW[withW.length - 1];
  for (let i = 1; i < withW.length; i++) {
    ref = withW[i];
    if (new Date(withW[i].date) <= cutoff) break;
  }

  const days = Math.max(1, Math.round(
    (new Date(last.date).getTime() - new Date(ref.date).getTime()) / 86400000
  ));
  const perWeek = (last.poids! - ref.poids!) / days * 7;

  const lines: string[] = [];

  lines.push(
    `${perWeek > 0 ? '+' : ''}${perWeek.toFixed(2)} kg/week over ${days} days`
  );

  if (goals?.poids_cible != null && Math.abs(perWeek) > 0.05) {
    const remaining = last.poids! - goals.poids_cible;
    const towards = (remaining > 0 && perWeek < 0) || (remaining < 0 && perWeek > 0);
    if (towards) {
      const weeks = Math.abs(remaining / perWeek);
      const eta = new Date(last.date);
      eta.setDate(eta.getDate() + Math.round(weeks * 7));
      lines.push(`On track to hit ${goals.poids_cible} kg around ${eta.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`);
    } else {
      lines.push(`Moving away from your ${goals.poids_cible} kg target`);
    }
  }

  const withF = entries.filter(e => e.masse_grasse != null);
  if (withF.length >= 2 && last.poids != null && ref.poids != null) {
    const fLast = withF[0].masse_grasse!;
    const fRef = withF[withF.length - 1].masse_grasse!;
    const fatLast = last.poids * fLast / 100;
    const fatRef = ref.poids * fRef / 100;
    const leanLast = last.poids - fatLast;
    const leanRef = ref.poids - fatRef;
    const leanDiff = leanLast - leanRef;

    if (leanDiff > 0.3) lines.push('Fat down, lean mass up — good trajectory');
    else if (leanDiff < -0.5) lines.push('Losing lean mass — raise protein and training volume');
    else lines.push('Lean mass stable');
  }

  return (
    <div className="insights">
      {lines.map((l, i) => <span key={i}>{l}</span>)}
    </div>
  );
}

function Chart({ entries, goals }: { entries: Entry[]; goals: Goals | null }) {
  if (entries.length < 2) {
    return <div className="empty">Not enough data to draw a trend.</div>;
  }

  const W = 640, H = 200, pad = 16;

  const weights = entries.map(e => e.poids).filter(v => v != null) as number[];
  const fats = entries.map(e => e.masse_grasse).filter(v => v != null) as number[];

  const wMin = Math.min(...weights, goals?.poids_cible ?? Infinity) - 1;
  const wMax = Math.max(...weights, goals?.poids_cible ?? -Infinity) + 1;
  const fMin = Math.min(...fats, goals?.masse_grasse_cible ?? Infinity) - 1;
  const fMax = Math.max(...fats, goals?.masse_grasse_cible ?? -Infinity) + 1;

  function pts(vals: (number | null)[], min: number, max: number) {
    const span = max - min || 1;
    return vals
      .map((v, i) => v == null ? null : [
        pad + i * (W - 2 * pad) / (vals.length - 1),
        H - pad - (v - min) / span * (H - 2 * pad)
      ] as [number, number])
      .filter(Boolean) as [number, number][];
  }

  function path(p: [number, number][]) {
    if (!p.length) return '';
    return p.map((q, i) => (i === 0 ? 'M' : 'L') + q[0] + ' ' + q[1]).join(' ');
  }

  const wPts = pts(entries.map(e => e.poids), wMin, wMax);
  const fPts = pts(entries.map(e => e.masse_grasse), fMin, fMax);

  const wGoalY = goals?.poids_cible != null
    ? H - pad - (goals.poids_cible - wMin) / (wMax - wMin || 1) * (H - 2 * pad)
    : null;

  const fGoalY = goals?.masse_grasse_cible != null
    ? H - pad - (goals.masse_grasse_cible - fMin) / (fMax - fMin || 1) * (H - 2 * pad)
    : null;

  return (
    <div className="chart-wrap">
      <div className="ax ax-w">
        <span>{wMax.toFixed(0)}</span>
        <span>{((wMax + wMin) / 2).toFixed(0)}</span>
        <span>{wMin.toFixed(0)}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="chart">
        {wGoalY != null && (
          <line x1={pad} y1={wGoalY} x2={W - pad} y2={wGoalY}
            stroke="#1B3A6B" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.55" />
        )}
        {fGoalY != null && (
          <line x1={pad} y1={fGoalY} x2={W - pad} y2={fGoalY}
            stroke="#D4A843" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.55" />
        )}
        <path d={path(wPts)} fill="none" stroke="#1B3A6B" strokeWidth="2.5" strokeLinecap="round" />
        <path d={path(fPts)} fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round" />
        {wPts.map((p, i) => <circle key={'w' + i} cx={p[0]} cy={p[1]} r="3.5" fill="#1B3A6B" />)}
        {fPts.map((p, i) => <circle key={'f' + i} cx={p[0]} cy={p[1]} r="3.5" fill="#D4A843" />)}
      </svg>
      <div className="ax ax-f">
        <span>{fMax.toFixed(1)}</span>
        <span>{((fMax + fMin) / 2).toFixed(1)}</span>
        <span>{fMin.toFixed(1)}</span>
      </div>
    </div>
  );
}

const css = `
  .body-page { max-width: 900px; margin: 0 auto; padding: 20px 20px 80px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1a2233; }
  .body-page header { margin-bottom: 22px; }
  .body-page .back { display: inline-block; margin-bottom: 12px; color: #2E9E9E; text-decoration: none; font-size: 13px; font-weight: 600; }
  .body-page h1 { font-size: 25px; font-weight: 700; letter-spacing: -0.5px; }
  .body-page .card { background: #f3f7fc; border-radius: 16px; padding: 20px; margin-bottom: 18px; }
  .body-page .card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  .body-page .card-title { font-size: 15px; font-weight: 700; }
  .body-page .head-actions { display: flex; align-items: center; gap: 10px; }
  .body-page .logged-tag { font-size: 11.5px; font-weight: 600; color: #2E9E9E; background: #e4f2f2; padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
  .body-page .vals { display: flex; gap: 14px; flex-wrap: wrap; }
  .body-page .val { flex: 1; min-width: 150px; background: #fff; border-radius: 12px; padding: 14px 16px; }
  .body-page .val-main { display: flex; align-items: baseline; gap: 5px; }
  .body-page .val-main b { font-size: 32px; font-weight: 800; letter-spacing: -1px; color: #1B3A6B; }
  .body-page .val-main small { font-size: 12px; color: #8a97ab; }
  .body-page .val-sub { display: flex; align-items: center; gap: 5px; margin-top: 5px; font-size: 11.5px; font-weight: 600; color: #8a97ab; flex-wrap: wrap; }
  .body-page .val-sub .togo { color: #2E9E9E; }
  .body-page .edit-pen { border: none; background: none; padding: 2px 4px; font-size: 12px; color: #8a97ab; cursor: pointer; line-height: 1; }
  .body-page .edit-pen:active { color: #2E9E9E; }
  .body-page .panel { margin-top: 16px; padding: 16px; background: #fff; border-radius: 12px; }
  .body-page .panel-label { font-size: 11.5px; font-weight: 700; color: #5a6a82; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 10px; }
  .body-page .panel-row { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
  .body-page .panel-field { flex: 1; min-width: 130px; display: flex; flex-direction: column; gap: 5px; }
  .body-page .panel-field label { font-size: 11.5px; font-weight: 600; color: #5a6a82; }
  .body-page .panel-field input { width: 100%; padding: 11px 12px; min-height: 44px; border: 1px solid #e6ebf2; border-radius: 10px; background: #fff; font-size: 16px; font-weight: 600; color: #1a2233; }
  .body-page .panel-field input:focus { outline: none; border-color: #2E9E9E; }
  .body-page .insights { display: flex; flex-direction: column; gap: 7px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e6ebf2; font-size: 12.5px; color: #5a6a82; line-height: 1.45; }
  .body-page .insights span:first-child { font-weight: 700; color: #1B3A6B; font-size: 14px; }
  .body-page .insights .muted { color: #8a97ab; }
  .body-page .ranges { display: flex; gap: 6px; }
  .body-page .ranges button { padding: 5px 11px; border: 1px solid #e6ebf2; background: #e3ebf5; border-radius: 8px; font-size: 12px; font-weight: 600; color: #5a6a82; cursor: pointer; }
  .body-page .ranges button.on { background: #2E9E9E; border-color: #2E9E9E; color: #fff; }
  .body-page .primary-btn { padding: 9px 20px; min-height: 38px; border: 1px solid #2E9E9E; background: #2E9E9E; color: #fff; border-radius: 999px; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap; }
  .body-page .primary-btn.on { background: #1B3A6B; border-color: #1B3A6B; }
  .body-page .primary-btn.tall { min-height: 44px; border-radius: 10px; }
  .body-page .primary-btn:disabled { opacity: 0.55; cursor: default; }
  .body-page .ghost-btn { padding: 7px 14px; min-height: 34px; border: 1px solid #e6ebf2; background: #e3ebf5; color: #5a6a82; border-radius: 999px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
  .body-page .ghost-btn:disabled { opacity: 0.55; cursor: default; }
  .body-page .goal-err { width: 100%; margin-top: 10px; font-size: 12px; font-weight: 600; color: #c0392b; }
  .body-page .chart-wrap { display: flex; gap: 10px; }
  .body-page .ax { display: flex; flex-direction: column; justify-content: space-between; font-size: 10.5px; font-weight: 600; height: 200px; }
  .body-page .ax-w { color: #1B3A6B; }
  .body-page .ax-f { color: #D4A843; text-align: right; }
  .body-page .chart { width: 100%; height: 200px; }
  .body-page .legend { display: flex; gap: 16px; margin-top: 12px; font-size: 12px; color: #5a6a82; }
  .body-page .legend i { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; }
  .body-page .legend i.dash { width: 14px; height: 0; border-radius: 0; border-top: 2px dashed #8a97ab; vertical-align: middle; }
  .body-page .hist { list-style: none; }
  .body-page .hist li { display: flex; align-items: center; gap: 14px; padding: 9px 0; border-bottom: 1px solid #e6ebf2; font-size: 13px; }
  .body-page .hist li:last-child { border-bottom: none; }
  .body-page .hd { flex: 1; color: #5a6a82; }
  .body-page .hv { font-weight: 600; min-width: 62px; text-align: right; }
  .body-page .hv.muted { color: #8a97ab; font-weight: 500; }
  .body-page .photo-btn { position: relative; overflow: hidden; display: inline-block; }
  .body-page .photo-btn input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .body-page .analysis { display: flex; flex-direction: column; gap: 16px; }
  .body-page .a-date { font-size: 11.5px; font-weight: 600; color: #8a97ab; text-transform: uppercase; letter-spacing: 0.4px; }
  .body-page .a-comment { font-size: 13.5px; line-height: 1.55; color: #1a2233; }
  .body-page .a-field { border-left: 3px solid #e6ebf2; padding-left: 12px; }
  .body-page .a-field.a-good { border-left-color: #2E9E9E; }
  .body-page .a-field.a-warn { border-left-color: #D4A843; }
  .body-page .a-field.a-prio { border-left-color: #1B3A6B; }
  .body-page .a-label { display: block; font-size: 11.5px; font-weight: 700; color: #5a6a82; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 5px; }
  .body-page .a-field ul { list-style: none; display: flex; flex-direction: column; gap: 4px; }
  .body-page .a-field li { font-size: 13px; line-height: 1.5; color: #1a2233; }
  .body-page .empty { padding: 22px 0; text-align: center; color: #8a97ab; font-size: 13px; }
  body { background: #dde8f4; }
`;