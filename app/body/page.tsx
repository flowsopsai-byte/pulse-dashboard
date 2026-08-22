'use client';

import { useEffect, useState } from 'react';

type Entry = { date: string; poids: number | null; masse_grasse: number | null };
type Goals = { poids_cible: number | null; masse_grasse_cible: number | null };

export default function BodyPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [goals, setGoals] = useState<Goals | null>(null);
  const [range, setRange] = useState(90);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { load(); }, []);

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
                    <section className="card">
            <div className="now">
              <div className="now-left">
                <div className="now-val">
                  <b>{last?.poids ?? '--'}</b><small>kg</small>
                  {goals?.poids_cible != null && last?.poids != null && (
                    <span className="togo">
                      {(last.poids - goals.poids_cible).toFixed(1)} kg to go
                    </span>
                  )}
                </div>
                <div className="now-val">
                  <b>{last?.masse_grasse ?? '--'}</b><small>% fat</small>
                  {goals?.masse_grasse_cible != null && last?.masse_grasse != null && (
                    <span className="togo">
                      {(last.masse_grasse - goals.masse_grasse_cible).toFixed(1)} pts to go
                    </span>
                  )}
                </div>
              </div>
              <Insights entries={entries} goals={goals} />
            </div>
          </section>

          <GoalsEditor goals={goals} onSaved={load} />

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
        </>
      )}
    </div>
  );
}

function GoalsEditor({ goals, onSaved }: { goals: Goals | null; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [poids, setPoids] = useState('');
  const [mg, setMg] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  function open() {
    setPoids(goals?.poids_cible != null ? String(goals.poids_cible) : '');
    setMg(goals?.masse_grasse_cible != null ? String(goals.masse_grasse_cible) : '');
    setErr('');
    setEditing(true);
  }

  function cancel() {
    setErr('');
    setEditing(false);
  }

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
      setEditing(false);
      onSaved();
    } catch {
      setSaving(false);
      setErr('Network error');
    }
  }

  return (
    <section className="card">
      <div className="card-head">
        <div className="card-title">Targets</div>
        {!editing && (
          <button className="ghost-btn" onClick={open}>Edit</button>
        )}
      </div>

      {!editing ? (
        <div className="goals-read">
          <div className="goal-item">
            <span className="goal-label">Weight</span>
            <span className="goal-value">{goals?.poids_cible ?? '--'}<small>kg</small></span>
          </div>
          <div className="goal-item">
            <span className="goal-label">Body fat</span>
            <span className="goal-value">{goals?.masse_grasse_cible ?? '--'}<small>%</small></span>
          </div>
        </div>
      ) : (
        <div className="goals-edit">
          <div className="goal-field">
            <label htmlFor="goal-weight">Weight target (kg)</label>
            <input
              id="goal-weight"
              type="number"
              step="0.1"
              min="30"
              max="250"
              value={poids}
              onChange={e => setPoids(e.target.value)}
            />
          </div>
          <div className="goal-field">
            <label htmlFor="goal-fat">Body fat target (%)</label>
            <input
              id="goal-fat"
              type="number"
              step="0.1"
              min="3"
              max="60"
              value={mg}
              onChange={e => setMg(e.target.value)}
            />
          </div>
          <div className="goal-actions">
            <button className="primary-btn" onClick={save} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button className="ghost-btn" onClick={cancel} disabled={saving}>Cancel</button>
          </div>
          {err && <div className="goal-err">{err}</div>}
        </div>
      )}
    </section>
  );
}

function Insights({ entries, goals }: { entries: Entry[]; goals: Goals | null }) {
  const withW = entries.filter(e => e.poids != null);
  if (withW.length < 2) return <div className="insights"><span className="muted">Log a few more entries to see trends.</span></div>;

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
  .body-page .card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .body-page .card-title { font-size: 15px; font-weight: 700; }
  .body-page .now { display: flex; gap: 28px; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; }
  .body-page .now-left { display: flex; gap: 14px; flex: 1; min-width: 260px; }
  .body-page .now-val { flex: 1; min-width: 130px; display: flex; align-items: baseline; gap: 5px; flex-wrap: wrap; background: #fff; border-radius: 12px; padding: 14px 16px; }
  .body-page .insights { display: flex; flex-direction: column; gap: 7px; text-align: left; font-size: 12.5px; color: #5a6a82; line-height: 1.45; flex: 1; min-width: 210px; padding-left: 22px; border-left: 3px solid #e4f2f2; }
  .body-page .insights span:first-child { font-weight: 700; color: #1B3A6B; font-size: 14px; }
  .body-page .insights .muted { color: #8a97ab; }
  .body-page .now-val b { font-size: 32px; font-weight: 800; letter-spacing: -1px; color: #1B3A6B; }
  .body-page .now-val small { font-size: 12px; color: #8a97ab; }
  .body-page .togo { width: 100%; font-size: 11.5px; color: #2E9E9E; font-weight: 600; }
  .body-page .ranges { display: flex; gap: 6px; }
  .body-page .ranges button { padding: 5px 11px; border: 1px solid #e6ebf2; background: #e3ebf5; border-radius: 8px; font-size: 12px; font-weight: 600; color: #5a6a82; cursor: pointer; }
  .body-page .ranges button.on { background: #2E9E9E; border-color: #2E9E9E; color: #fff; }
  .body-page .goals-read { display: flex; gap: 14px; flex-wrap: wrap; }
  .body-page .goal-item { flex: 1; min-width: 140px; display: flex; flex-direction: column; gap: 3px; background: #e4f2f2; border-radius: 12px; padding: 14px 16px; }
  .body-page .goal-label { font-size: 11.5px; font-weight: 600; color: #2E9E9E; text-transform: uppercase; letter-spacing: 0.4px; }
  .body-page .goal-value { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #1B3A6B; }
  .body-page .goal-value small { font-size: 11.5px; font-weight: 600; color: #8a97ab; margin-left: 4px; }
  .body-page .goals-edit { display: flex; gap: 18px; flex-wrap: wrap; align-items: flex-end; }
  .body-page .goal-field { display: flex; flex-direction: column; gap: 5px; }
  .body-page .goal-field label { font-size: 11.5px; font-weight: 600; color: #5a6a82; }
  .body-page .goal-field input { width: 150px; padding: 8px 10px; border: 1px solid #e6ebf2; border-radius: 8px; background: #fff; font-size: 14px; font-weight: 600; color: #1a2233; }
  .body-page .goal-field input:focus { outline: none; border-color: #2E9E9E; }
  .body-page .goal-actions { display: flex; gap: 8px; }
  .body-page .primary-btn { padding: 8px 16px; border: 1px solid #2E9E9E; background: #2E9E9E; color: #fff; border-radius: 8px; font-size: 12.5px; font-weight: 700; cursor: pointer; }
  .body-page .primary-btn:disabled { opacity: 0.55; cursor: default; }
  .body-page .ghost-btn { padding: 6px 14px; border: 1px solid #e6ebf2; background: #e3ebf5; color: #5a6a82; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
  .body-page .ghost-btn:disabled { opacity: 0.55; cursor: default; }
  .body-page .goal-err { width: 100%; font-size: 12px; font-weight: 600; color: #c0392b; }
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
  .body-page .empty { padding: 22px 0; text-align: center; color: #8a97ab; font-size: 13px; }
  body { background: #dde8f4; }
`;