'use client';

import { useEffect, useState } from 'react';

const GOALS = {
  calories: 2750,
  proteines: 195,
  glucides: 285,
  lipides: 92,
  fibres: 35,
  vitamine_c: 110,
  vitamine_d: 15,
  fer: 11,
  magnesium: 420,
};

const NAVY = '#1B3A6B';
const TEAL = '#2E9E9E';
const TEAL_SOFT = '#e4f2f2';
const GOLD = '#D4A843';
const INK = '#1a2233';
const SLATE = '#5a6a82';
const MIST = '#8a97ab';
const PAPER = '#dde8f4';
const WELL = '#e3ebf5';
const CARD = '#f3f7fc';
const LINE = '#e6ebf2';

type Meal = {
  id: string;
  plat: string;
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
  fibres: number;
  vitamine_c: number;
  vitamine_d: number;
  fer: number;
  magnesium: number;
  note: number;
  commentaire: string;
  created_at: string;
};

function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
}

function shiftDate(iso: string, days: number) {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function labelDate(iso: string) {
  if (iso === todayISO()) return 'Today';
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function mealTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function Ring({ value, goal }: { value: number; goal: number }) {
  const pct = Math.min(value / goal, 1);
  const r = 78;
  const c = 2 * Math.PI * r;
  const [dash, setDash] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDash(c * pct), 100);
    return () => clearTimeout(t);
  }, [pct, c]);

  return (
    <div style={{ position: 'relative', width: 180, height: 180 }}>
      <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="90" cy="90" r={r} fill="none" stroke={WELL} strokeWidth="12" />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke={TEAL}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: 'stroke-dasharray 1.1s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, color: NAVY, letterSpacing: -2 }}>
          {Math.round(value)}
        </div>
        <div style={{ fontSize: 13, color: MIST, marginTop: 4 }}>/ {goal} kcal</div>
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  goal,
  unit,
  color,
}: {
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
}) {
  const pct = Math.min((value / goal) * 100, 100);
  const [w, setW] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setW(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);

  const over = value > goal * 1.1;

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 13,
          marginBottom: 6,
        }}
      >
        <span style={{ color: SLATE }}>{label}</span>
        <span style={{ fontVariantNumeric: 'tabular-nums', color: INK }}>
          <strong style={{ fontWeight: 700 }}>{Math.round(value)}</strong>
          <span style={{ color: MIST }}>
            {' '}
            / {goal} {unit}
          </span>
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: WELL, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${w}%`,
            borderRadius: 4,
            background: over ? GOLD : color,
            transition: 'width 1s cubic-bezier(.4,0,.2,1)',
          }}
        />
      </div>
    </div>
  );
}

export default function NutritionPage() {
  const [date, setDate] = useState(todayISO());
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/nutrition/day?date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [date]);

  const t = data?.totals;
  const meals: Meal[] = data?.meals || [];

  const cardStyle = {
    background: CARD,
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
    border: `1px solid ${LINE}`,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: PAPER,
        color: INK,
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        padding: '20px 16px 60px',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <a
            href="/"
            style={{ color: SLATE, textDecoration: 'none', fontSize: 22, lineHeight: 1 }}
          >
            {'\u2190'}
          </a>
          <h1 style={{ fontSize: 27, fontWeight: 700, margin: 0, letterSpacing: -0.5, color: NAVY }}>
            Nutrition
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: CARD,
            border: `1px solid ${LINE}`,
            borderRadius: 18,
            padding: '12px 18px',
            marginBottom: 18,
          }}
        >
          <button
            onClick={() => setDate(shiftDate(date, -1))}
            style={{
              background: 'none',
              border: 'none',
              color: SLATE,
              fontSize: 20,
              cursor: 'pointer',
            }}
          >
            {'\u2039'}
          </button>
          <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{labelDate(date)}</span>
          <button
            onClick={() => setDate(shiftDate(date, 1))}
            disabled={date >= todayISO()}
            style={{
              background: 'none',
              border: 'none',
              color: date >= todayISO() ? LINE : SLATE,
              fontSize: 20,
              cursor: date >= todayISO() ? 'default' : 'pointer',
            }}
          >
            {'\u203A'}
          </button>
        </div>

        {loading && <div style={{ color: MIST, fontSize: 14 }}>Loading...</div>}

        {!loading && meals.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: MIST, fontSize: 14 }}>
            No meals logged on this day.
          </div>
        )}

        {!loading && meals.length > 0 && t && (
          <>
            <div
              style={{
                ...cardStyle,
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                flexWrap: 'wrap',
              }}
            >
              <Ring value={t.calories} goal={GOALS.calories} />
              <div style={{ flex: 1, minWidth: 260 }}>
                <Bar label="Protein" value={t.proteines} goal={GOALS.proteines} unit="g" color={TEAL} />
                <Bar label="Carbs" value={t.glucides} goal={GOALS.glucides} unit="g" color={NAVY} />
                <Bar label="Fat" value={t.lipides} goal={GOALS.lipides} unit="g" color={GOLD} />
                <Bar label="Fiber" value={t.fibres} goal={GOALS.fibres} unit="g" color="#6BA368" />
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 18 }}>
                Micronutrients
              </div>
              <Bar label="Vitamin C" value={t.vitamine_c} goal={GOALS.vitamine_c} unit="mg" color={TEAL} />
              <Bar label="Vitamin D" value={t.vitamine_d} goal={GOALS.vitamine_d} unit="ug" color={GOLD} />
              <Bar label="Iron" value={t.fer} goal={GOALS.fer} unit="mg" color="#C4614A" />
              <Bar label="Magnesium" value={t.magnesium} goal={GOALS.magnesium} unit="mg" color="#7A6BA8" />
            </div>

            <div style={{ fontSize: 15, fontWeight: 700, color: INK, margin: '26px 0 14px' }}>
              Meals
            </div>

            {meals.map((m) => (
              <div
                key={m.id}
                onClick={() => setOpen(open === m.id ? null : m.id)}
                style={{ ...cardStyle, padding: 18, cursor: 'pointer' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 14,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, marginBottom: 4 }}>
                      {mealTime(m.created_at)}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: INK }}>
                      {m.plat}
                    </div>
                    <div style={{ fontSize: 13, color: MIST }}>
                      {m.calories} kcal &middot; {m.proteines}g P &middot; {m.glucides}g C &middot;{' '}
                      {m.lipides}g F
                    </div>
                  </div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      background: TEAL_SOFT,
                      color: TEAL,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {m.note}
                  </div>
                </div>

                {open === m.id && (
                  <div
                    style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${LINE}` }}
                  >
                    <div style={{ fontSize: 13, color: SLATE, marginBottom: 14, lineHeight: 1.5 }}>
                      {m.commentaire}
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                        gap: 12,
                      }}
                    >
                      {[
                        ['Fiber', m.fibres, 'g'],
                        ['Vit C', m.vitamine_c, 'mg'],
                        ['Vit D', m.vitamine_d, 'ug'],
                        ['Iron', m.fer, 'mg'],
                        ['Mag', m.magnesium, 'mg'],
                      ].map(([l, v, u]) => (
                        <div key={l as string}>
                          <div style={{ fontSize: 12, color: MIST, marginBottom: 3 }}>{l}</div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: INK }}>
                            {v}
                            <span style={{ fontSize: 12, color: MIST }}> {u}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}