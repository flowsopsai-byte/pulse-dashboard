"use client";

import { useEffect } from "react";

const styleCss = `
  :root {
    --navy: #1B3A6B;
    --navy-deep: #12294d;
    --teal: #2E9E9E;
    --teal-soft: #e4f2f2;
    --gold: #D4A843;
    --gold-soft: #f7efd8;
    --ink: #1a2233;
    --slate: #5a6a82;
    --mist: #8a97ab;
    --paper: #dde8f4;
    --well: #e3ebf5;
    --card: #f3f7fc;
    --line: #e6ebf2;
    --good: #2E9E9E;
    --warn: #D4A843;
    --bad: #d9776b;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: var(--paper);
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
  }

  .wrap { max-width: 1180px; margin: 0 auto; padding: 0 20px 80px; }

  /* Header */
  header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 0 26px;
  }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-mark {
    width: 42px; height: 42px; border-radius: 12px;
    background: linear-gradient(135deg, var(--navy), var(--teal));
    display: grid; place-items: center;
    color: white; font-weight: 800; font-size: 22px;
    box-shadow: 0 4px 14px rgba(27,58,107,0.25);
  }
  .brand-name { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; color: var(--navy); }
  .brand-name span { color: var(--teal); }
  .brand-sub { font-size: 12px; color: var(--mist); letter-spacing: 0.5px; text-transform: uppercase; }
  .date-badge {
    font-size: 13px; color: var(--slate); font-weight: 500;
    background: var(--card); padding: 9px 16px; border-radius: 999px;
    border: 1px solid var(--line);
  }

  /* Hero score */
  .hero {
    background: linear-gradient(140deg, var(--navy-deep), var(--navy) 55%, #234a86);
    border-radius: 24px; padding: 34px; color: white;
    position: relative; overflow: hidden;
    box-shadow: 0 16px 40px rgba(27,58,107,0.28);
  }
  .hero::after {
    content: ""; position: absolute; right: -80px; top: -80px;
    width: 320px; height: 320px; border-radius: 50%;
    background: radial-gradient(circle, rgba(46,158,158,0.35), transparent 70%);
  }
  .hero-grid {
    display: grid; grid-template-columns: auto 1fr; gap: 40px; align-items: center;
    position: relative; z-index: 1;
  }
  .ring-wrap { position: relative; width: 168px; height: 168px; }
  .ring-num {
    position: absolute; inset: 0; display: grid; place-content: center; text-align: center;
  }
  .ring-num b { font-size: 52px; font-weight: 800; letter-spacing: -2px; line-height: 1; }
  .ring-num small { font-size: 13px; opacity: 0.7; letter-spacing: 1px; }
  .hero-label { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.75; margin-bottom: 6px; }
  .hero-title { font-size: 27px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 14px; }
  .hero-trend { display: inline-flex; align-items: center; gap: 7px; font-size: 14px;
    background: rgba(255,255,255,0.14); padding: 7px 14px; border-radius: 999px; }
  .hero-trend b { color: #7fe0c4; }

  .breakdown { display: flex; gap: 10px; margin-top: 26px; position: relative; z-index: 1; flex-wrap: wrap; }
  .chip {
    flex: 1; min-width: 128px; background: rgba(255,255,255,0.10);
    border: 1px solid rgba(255,255,255,0.14); border-radius: 14px; padding: 13px 15px;
  }
  .chip .lab { font-size: 12px; opacity: 0.72; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
  .chip .val { font-size: 15px; font-weight: 600; }
  .chip .bar { height: 5px; background: rgba(255,255,255,0.15); border-radius: 3px; margin-top: 9px; overflow: hidden; }
  .chip .bar i { display: block; height: 100%; border-radius: 3px; background: var(--teal); }
  .chip .bar i.g { background: var(--gold); }

  /* Section grid */
  .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 18px; margin-top: 22px; }
  .card {
    background: var(--card); border-radius: 18px; padding: 22px;
    border: 1px solid var(--line);
  }
  .col-8 { grid-column: span 8; }
  .col-4 { grid-column: span 4; }
  .col-6 { grid-column: span 6; }
  .col-12 { grid-column: span 12; }

  .card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .card-title { font-size: 15px; font-weight: 700; color: var(--ink); letter-spacing: -0.2px; }
  .card-hint { font-size: 12px; color: var(--mist); }

  /* Line chart */
  .chart { width: 100%; height: 190px; }
  .legend { display: flex; gap: 16px; margin-top: 12px; }
  .legend span { font-size: 12px; color: var(--slate); display: flex; align-items: center; gap: 6px; }
  .dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }

  /* Mood picker */
  .mood-row { display: flex; justify-content: space-between; gap: 8px; }
  .mood {
    flex: 1; aspect-ratio: 1; border: 2px solid var(--line); background: var(--well);
    border-radius: 16px; font-size: 30px; cursor: pointer; transition: all .18s ease;
    display: grid; place-items: center;
  }
  .mood:hover { transform: translateY(-3px); border-color: var(--teal); }
  .mood.active { border-color: var(--teal); background: var(--teal-soft); transform: translateY(-3px); box-shadow: 0 8px 18px rgba(46,158,158,0.2); }
  .mood-labels { display: flex; justify-content: space-between; margin-top: 10px; }
  .mood-labels span { flex: 1; text-align: center; font-size: 10.5px; color: var(--mist); }
  .mood-cta {
    width: 100%; margin-top: 18px; padding: 13px; border: none; border-radius: 12px;
    background: var(--navy); color: white; font-size: 14px; font-weight: 600; cursor: pointer;
    transition: background .18s;
  }
  .mood-cta:hover { background: var(--navy-deep); }

  /* Nutrition rings */
  .macro { margin-bottom: 15px; }
  .macro:last-child { margin-bottom: 0; }
  .macro-top { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 7px; }
  .macro-top b { font-weight: 600; }
  .macro-top .muted { color: var(--mist); }
  .track { height: 8px; background: var(--well); border-radius: 5px; overflow: hidden; }
  .track i { display: block; height: 100%; border-radius: 5px; }

  .coach-tip { display: flex; gap: 9px; align-items: flex-start; margin-top: 16px; padding: 12px 13px;
    background: var(--gold-soft); border-radius: 12px; font-size: 12.5px; color: #7a5e1e; line-height: 1.45; }
  .coach-tip .tip-ico { flex-shrink: 0; }

  /* Streak / stats row */
  .mini-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .mini { text-align: center; padding: 6px 0; }
  .mini .big { font-size: 30px; font-weight: 800; letter-spacing: -1px; color: var(--navy); }
  .mini .big .u { font-size: 15px; color: var(--mist); font-weight: 600; }
  .mini .cap { font-size: 12px; color: var(--slate); margin-top: 3px; }
  .mini + .mini { border-left: 1px solid var(--line); }

  /* Sessions */
  .sess { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--line); }
  .sess:last-child { border-bottom: none; }
  .sess-ico { width: 38px; height: 38px; border-radius: 10px; background: var(--teal-soft); display: grid; place-items: center; font-size: 18px; flex-shrink: 0; }
  .sess-body { flex: 1; }
  .sess-body .t { font-size: 13.5px; font-weight: 600; }
  .sess-body .s { font-size: 12px; color: var(--mist); }
  .sess-day { font-size: 11px; color: var(--mist); font-weight: 500; }

  .week-dots { display: flex; gap: 7px; margin-top: 4px; }
  .wd { flex: 1; height: 34px; border-radius: 8px; background: var(--well); display: grid; place-items: center; font-size: 11px; color: var(--mist); font-weight: 600; }
  .wd.done { background: var(--teal); color: white; }
  .wd.rest { background: var(--gold-soft); color: var(--gold); }

  /* Briefing hero (pleine largeur) */
  .brief-hero { border: 1px solid var(--line); background: linear-gradient(120deg, #ffffff, var(--teal-soft) 260%); }
  .brief-hero .play { width: 60px; height: 60px; font-size: 20px; }
  .brief-hero .brief-body .t { font-size: 15px; }
  .brief-hero .brief-body p { font-size: 14px; max-width: 640px; }

  /* Briefing */
  .brief { display: flex; gap: 15px; align-items: flex-start; }
  .play {
    width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--teal), var(--navy)); border: none; cursor: pointer;
    display: grid; place-items: center; color: white; box-shadow: 0 6px 16px rgba(46,158,158,0.3);
  }
  .brief-body p { font-size: 13.5px; color: var(--slate); }
  .brief-body .t { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
  .wave { display: flex; align-items: center; gap: 3px; margin-top: 10px; height: 22px; }
  .wave i { width: 3px; background: var(--teal); border-radius: 2px; opacity: 0.55; }

  /* Weather widget */
  .weather {
    background: linear-gradient(140deg, #4a7fc4, #6ea8dd 60%, #9cc9ec);
    color: white; position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .weather.rain { background: linear-gradient(140deg, #4a5a72, #647d97 60%, #8299b0); }
  .weather-top { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; }
  .weather-city { font-size: 13px; opacity: 0.85; font-weight: 500; }
  .weather-desc { font-size: 15px; font-weight: 600; margin-top: 2px; }
  .sky { width: 74px; height: 74px; position: relative; flex-shrink: 0; }

  /* Sun */
  .sun-core { position: absolute; top: 50%; left: 50%; width: 34px; height: 34px; margin: -17px 0 0 -17px;
    background: radial-gradient(circle, #fff6d8, #ffd94a); border-radius: 50%;
    box-shadow: 0 0 18px rgba(255,217,74,0.9); }
  .sun-rays { position: absolute; inset: 0; animation: spin 14s linear infinite; }
  .sun-rays i { position: absolute; top: 50%; left: 50%; width: 3px; height: 11px; margin: -5.5px 0 0 -1.5px;
    background: rgba(255,240,190,0.95); border-radius: 3px; transform-origin: 50% 0; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Rain cloud */
  .cloud { position: absolute; top: 20px; left: 12px; width: 46px; height: 18px; background: #f0f4f8; border-radius: 12px; }
  .cloud::before { content:""; position:absolute; top:-9px; left:8px; width:20px; height:20px; background:#f0f4f8; border-radius:50%; }
  .cloud::after { content:""; position:absolute; top:-13px; left:20px; width:26px; height:26px; background:#f0f4f8; border-radius:50%; }
  .drop { position: absolute; width: 2.5px; height: 10px; background: rgba(255,255,255,0.8); border-radius: 3px; animation: fall 1s linear infinite; }
  @keyframes fall { 0% { transform: translateY(0); opacity: 0; } 30%{opacity:1;} 100% { transform: translateY(30px); opacity: 0; } }

  .temps { display: flex; gap: 22px; position: relative; z-index: 2; margin-top: 20px; }
  .temp .tlab { font-size: 11px; opacity: 0.8; display: flex; align-items: center; gap: 5px; }
  .temp .tval { font-size: 26px; font-weight: 700; letter-spacing: -1px; margin-top: 2px; }
  .weather-note { font-size: 12px; opacity: 0.9; margin-top: 14px; position: relative; z-index: 2;
    background: rgba(255,255,255,0.15); padding: 8px 12px; border-radius: 10px; }

  /* Music player */
  .music { display: flex; flex-direction: column; }
  .music-head { display: flex; align-items: center; gap: 13px; }
  .cover { width: 58px; height: 58px; border-radius: 13px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--gold), #e8c069); position: relative; overflow: hidden;
    display: grid; place-items: center; font-size: 24px; }
  .cover::after { content:""; position:absolute; inset:0; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%); }
  .music-meta { flex: 1; min-width: 0; }
  .music-meta .mt { font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .music-meta .ma { font-size: 12.5px; color: var(--mist); }
  .music-tag { font-size: 11px; color: var(--teal); font-weight: 600; margin-top: 3px; }
  .music-ctrl { display: flex; align-items: center; gap: 13px; margin-top: 16px; }
  .mplay { width: 44px; height: 44px; border-radius: 50%; border: none; cursor: pointer; flex-shrink: 0;
    background: var(--navy); color: white; font-size: 15px; display: grid; place-items: center;
    transition: background .18s; }
  .mplay:hover { background: var(--navy-deep); }
  .mbar { flex: 1; }
  .mbar-track { height: 5px; background: var(--well); border-radius: 3px; overflow: hidden; }
  .mbar-track i { display: block; height: 100%; width: 0%; background: var(--teal); border-radius: 3px; transition: width .2s linear; }
  .mbar-time { display: flex; justify-content: space-between; font-size: 11px; color: var(--mist); margin-top: 6px; }

  .quote { margin-top: 20px; padding: 20px 8px 4px; border-top: 1px solid var(--line); text-align: center; }
  .quote-text { font-size: 14px; font-style: italic; color: var(--slate); line-height: 1.6; position: relative; display: inline; }
  .quote-text::before { content: "\\201C"; color: var(--gold); font-family: Georgia, serif; font-size: 20px; font-style: normal; vertical-align: -3px; margin-right: 2px; }
  .quote-text::after { content: "\\201D"; color: var(--gold); font-family: Georgia, serif; font-size: 20px; font-style: normal; vertical-align: -3px; margin-left: 2px; }
  .quote-author { font-size: 12px; font-weight: 600; color: var(--navy); margin-top: 12px; letter-spacing: 0.3px; }

  .footer-note { text-align: center; font-size: 12px; color: var(--mist); margin-top: 30px; }

  @media (max-width: 860px) {
    .hero-grid { grid-template-columns: 1fr; gap: 24px; text-align: center; }
    .ring-wrap { margin: 0 auto; }
    .hero-trend { margin: 0 auto; }
    .col-8, .col-4, .col-6 { grid-column: span 12; }
    .hero { padding: 26px; }
  }
`;

const bodyHtml = `<div class="wrap">

  <header>
    <div class="brand">
      <div class="brand-mark">P</div>
      <div>
        <div class="brand-name">Pulse<span>.</span></div>
        <div class="brand-sub">AI Life Coach</div>
      </div>
    </div>
    <div class="date-badge" id="today">jeudi 13 août</div>
  </header>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-grid">
      <div class="ring-wrap">
        <svg width="168" height="168" viewBox="0 0 168 168">
          <circle cx="84" cy="84" r="72" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="13"/>
          <circle id="scoreRing" cx="84" cy="84" r="72" fill="none" stroke="url(#grad)" stroke-width="13"
                  stroke-linecap="round" stroke-dasharray="452" stroke-dashoffset="452"
                  transform="rotate(-90 84 84)"/>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#2E9E9E"/>
              <stop offset="100%" stop-color="#7fe0c4"/>
            </linearGradient>
          </defs>
        </svg>
        <div class="ring-num"><div><b id="scoreNum">0</b><br><small>/ 100</small></div></div>
      </div>
      <div>
        <div class="hero-label">Your Pulse Score today</div>
        <div class="hero-title">Strong energy this morning, Thomas.</div>
        <div class="hero-trend">📈 <span>7-day trend: <b>+6 points</b></span></div>
        <div class="breakdown">
          <div class="chip">
            <div class="lab">😴 Sleep</div>
            <div class="val">17 / 20</div>
            <div class="bar"><i style="width:85%"></i></div>
          </div>
          <div class="chip">
            <div class="lab">🔋 Recovery</div>
            <div class="val">13 / 20</div>
            <div class="bar"><i style="width:65%"></i></div>
          </div>
          <div class="chip">
            <div class="lab">💪 Activity</div>
            <div class="val">12 / 20</div>
            <div class="bar"><i style="width:60%"></i></div>
          </div>
          <div class="chip">
            <div class="lab">🥗 Nutrition</div>
            <div class="val">11 / 15</div>
            <div class="bar"><i class="g" style="width:73%"></i></div>
          </div>
          <div class="chip">
            <div class="lab">🧠 Mood</div>
            <div class="val">20 / 25</div>
            <div class="bar"><i style="width:80%"></i></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- BRIEFING — pièce maîtresse, juste sous le score -->
  <div class="grid">
    <div class="card col-12 brief-hero">
      <div class="brief">
        <button class="play" id="playBtn">▶</button>
        <div class="brief-body">
          <div class="t">Your morning briefing — 2 min 34</div>
          <p>Your coach has analyzed your night, your mood and your week. Solid sleep, stress at its lowest, but training is falling behind. Listen for today's focus and your mental lever.</p>
          <div class="wave" id="wave"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- ROW 1 -->
  <div class="grid">

    <!-- Score trend chart -->
    <div class="card col-8">
      <div class="card-head">
        <div class="card-title">Pulse Score trend</div>
        <div class="card-hint">Last 30 days</div>
      </div>
      <svg class="chart" id="scoreChart" viewBox="0 0 640 190" preserveAspectRatio="none"></svg>
    </div>

    <!-- Mood picker -->
    <div class="card col-4">
      <div class="card-head">
        <div class="card-title">How you feel right now</div>
      </div>
      <div class="mood-row" id="moodRow">
        <button class="mood" data-v="1">😔</button>
        <button class="mood" data-v="2">😕</button>
        <button class="mood" data-v="3">😐</button>
        <button class="mood active" data-v="4">🙂</button>
        <button class="mood" data-v="5">😄</button>
      </div>
      <div class="mood-labels">
        <span>Rough</span><span></span><span>Okay</span><span></span><span>Great</span>
      </div>
      <button class="mood-cta" id="moodBtn">Log my mood</button>
    </div>
  </div>

  <!-- ROW 2 -->
  <div class="grid">

    <!-- Emotional trends -->
    <div class="card col-8">
      <div class="card-head">
        <div class="card-title">Mood, stress &amp; energy</div>
        <div class="card-hint">Last 7 days</div>
      </div>
      <svg class="chart" id="moodChart" viewBox="0 0 640 190" preserveAspectRatio="none"></svg>
      <div class="legend">
        <span><i class="dot" style="background:#2E9E9E"></i>Mood</span>
        <span><i class="dot" style="background:#D4A843"></i>Stress</span>
        <span><i class="dot" style="background:#1B3A6B"></i>Energy</span>
      </div>
    </div>

    <!-- Nutrition -->
    <div class="card col-4">
      <div class="card-head">
        <div class="card-title">Yesterday's nutrition</div>
        <div class="card-hint">the day before</div>
      </div>
      <div class="macro">
        <div class="macro-top"><b>Protein</b><span class="muted">131 / 142 g</span></div>
        <div class="track"><i style="width:92%; background:var(--teal)"></i></div>
      </div>
      <div class="macro">
        <div class="macro-top"><b>Calories</b><span class="muted">1180 / 2100 kcal</span></div>
        <div class="track"><i style="width:56%; background:var(--gold)"></i></div>
      </div>
      <div class="macro">
        <div class="macro-top"><b>Carbs</b><span class="muted">96 / 210 g</span></div>
        <div class="track"><i style="width:46%; background:var(--navy)"></i></div>
      </div>
      <div class="macro">
        <div class="macro-top"><b>Hydration</b><span class="muted">2.1 / 3.1 L</span></div>
        <div class="track"><i style="width:68%; background:#5bb8d4"></i></div>
      </div>
      <div class="coach-tip">
        <span class="tip-ico">💡</span>
        <span>You were low on calories yesterday. Aim for a real protein-rich breakfast today.</span>
      </div>
    </div>
  </div>

  <!-- ROW 3 -->
  <div class="grid">

    <!-- Streaks / stats -->
    <div class="card col-6">
      <div class="card-head"><div class="card-title">Your records</div></div>
      <div class="mini-row">
        <div class="mini">
          <div class="big">12<span class="u">j</span></div>
          <div class="cap">Check-in streak</div>
        </div>
        <div class="mini">
          <div class="big">84</div>
          <div class="cap">Best score</div>
        </div>
        <div class="mini">
          <div class="big">9.2<span class="u">h</span></div>
          <div class="cap">Sleep record</div>
        </div>
      </div>
    </div>

    <!-- Weekly sessions -->
    <div class="card col-6">
      <div class="card-head">
        <div class="card-title">Sessions this week</div>
        <div class="card-hint">3 / 5</div>
      </div>
      <div class="week-dots">
        <div class="wd done">M</div>
        <div class="wd">T</div>
        <div class="wd done">W</div>
        <div class="wd rest">T</div>
        <div class="wd done">F</div>
        <div class="wd">S</div>
        <div class="wd">S</div>
      </div>
      <div class="sess" style="margin-top:14px">
        <div class="sess-ico">🏋️</div>
        <div class="sess-body"><div class="t">Legs — 20 sets</div><div class="s">Quads, hamstrings, calves</div></div>
        <div class="sess-day">Fri</div>
      </div>
      <div class="sess">
        <div class="sess-ico">💪</div>
        <div class="sess-body"><div class="t">Chest &amp; biceps</div><div class="s">Press, curls, dips</div></div>
        <div class="sess-day">Wed</div>
      </div>
    </div>

  </div>

  <!-- ROW FIN — musique + météo (l'ambiance pour clore) -->
  <div class="grid">

    <!-- Music -->
    <div class="card col-6 music">
      <div class="music-head">
        <div class="cover">🎵</div>
        <div class="music-meta">
          <div class="mt">Weightless</div>
          <div class="ma">Marconi Union</div>
          <div class="music-tag">◆ Suggested for your morning focus</div>
        </div>
      </div>
      <div class="music-ctrl">
        <button class="mplay" id="mplay">▶</button>
        <div class="mbar">
          <div class="mbar-track"><i id="mfill"></i></div>
          <div class="mbar-time"><span id="mcur">0:00</span><span>8:10</span></div>
        </div>
      </div>
      <div class="quote">
        <p class="quote-text">Waste no more time arguing what a good man should be. Be one.</p>
        <div class="quote-author">— Marc Aurèle</div>
      </div>
    </div>

    <!-- Weather -->
    <div class="card col-6 weather" id="weather">
      <div class="weather-top">
        <div>
          <div class="weather-city">Piriac-sur-Mer</div>
          <div class="weather-desc" id="wDesc">Sunny, a few clouds</div>
        </div>
        <div class="sky" id="sky"></div>
      </div>
      <div class="temps">
        <div class="temp">
          <div class="tlab">🌅 Morning</div>
          <div class="tval">14°</div>
        </div>
        <div class="temp">
          <div class="tlab">☀️ Afternoon</div>
          <div class="tval">22°</div>
        </div>
      </div>
      <div class="weather-note">Great day to get outside. Make the most of it for your walk.</div>
    </div>
  </div>

  <div class="footer-note">Demo mockup · sample data · Pulse AI Life Coach</div>

</div>`;

export default function Home() {
  useEffect(() => {
    // Le script de la maquette, exécuté une fois le HTML monté
    const run = () => {

  // Date du jour en anglais
  const d = new Date();
  const jours = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const mois = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('today').textContent = `${jours[d.getDay()]}, ${mois[d.getMonth()]} ${d.getDate()}`;

  // Animation du score
  const target = 73;
  const ring = document.getElementById('scoreRing');
  const num = document.getElementById('scoreNum');
  const circ = 452;
  let cur = 0;
  const anim = setInterval(() => {
    cur += 1.5;
    if (cur >= target) { cur = target; clearInterval(anim); }
    num.textContent = Math.round(cur);
    ring.style.strokeDashoffset = circ - (circ * cur / 100);
  }, 18);

  // Helper: courbe lissée
  function smoothPath(pts) {
    let dstr = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0,y0] = pts[i], [x1,y1] = pts[i+1];
      const cx = (x0 + x1) / 2;
      dstr += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
    }
    return dstr;
  }

  // Score chart (30 j)
  (function(){
    const data = [58,61,60,64,62,59,63,66,64,68,65,63,67,70,69,66,64,68,71,73,70,68,72,74,71,69,73,72,70,73];
    const W=640,H=190,pad=14;
    const max=85,min=45;
    const pts = data.map((v,i)=>[
      pad + i*(W-2*pad)/(data.length-1),
      H-pad - (v-min)/(max-min)*(H-2*pad)
    ]);
    const svg=document.getElementById('scoreChart');
    const area=smoothPath(pts)+` L ${pts[pts.length-1][0]} ${H} L ${pts[0][0]} ${H} Z`;
    svg.innerHTML=`
      <defs><linearGradient id="fill1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2E9E9E" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="#2E9E9E" stop-opacity="0"/>
      </linearGradient></defs>
      <path d="${area}" fill="url(#fill1)"/>
      <path d="${smoothPath(pts)}" fill="none" stroke="#2E9E9E" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="${pts[pts.length-1][0]}" cy="${pts[pts.length-1][1]}" r="5" fill="#2E9E9E" stroke="white" stroke-width="2.5"/>
    `;
  })();

  // Mood chart (humeur / stress / énergie)
  (function(){
    const hum=[6,7,5,7,8,7,8], str=[5,4,7,5,3,4,3], ene=[6,6,5,7,7,8,8];
    const W=640,H=190,pad=14, max=10,min=0;
    const mk=arr=>arr.map((v,i)=>[pad+i*(W-2*pad)/(arr.length-1), H-pad-(v-min)/(max-min)*(H-2*pad)]);
    const line=(pts,col)=>`<path d="${smoothPath(pts)}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round"/>`+
      pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="${col}"/>`).join('');
    document.getElementById('moodChart').innerHTML =
      line(mk(hum),'#2E9E9E')+line(mk(str),'#D4A843')+line(mk(ene),'#1B3A6B');
  })();

  // Mood picker
  document.querySelectorAll('.mood').forEach(m=>{
    m.addEventListener('click',()=>{
      document.querySelectorAll('.mood').forEach(x=>x.classList.remove('active'));
      m.classList.add('active');
    });
  });
  document.getElementById('moodBtn').addEventListener('click',()=>{
    const btn=document.getElementById('moodBtn');
    btn.textContent='✓ Mood logged';
    btn.style.background='var(--teal)';
    setTimeout(()=>{ btn.textContent='Log my mood'; btn.style.background='var(--navy)'; },1800);
  });

  // Wave bars
  const wave=document.getElementById('wave');
  for(let i=0;i<26;i++){
    const b=document.createElement('i');
    b.style.height=(6+Math.abs(Math.sin(i*0.7))*16)+'px';
    wave.appendChild(b);
  }
  document.getElementById('playBtn').addEventListener('click',function(){
    this.textContent = this.textContent==='▶' ? '❚❚' : '▶';
  });

  // ---- MÉTÉO ANIMÉE ----
  // Passe à 'rain' pour tester la pluie
  const weatherType = 'sun';
  const sky = document.getElementById('sky');
  const weatherCard = document.getElementById('weather');

  if (weatherType === 'sun') {
    let rays = '';
    for (let i = 0; i < 12; i++) {
      rays += `<i style="transform: rotate(${i*30}deg) translateY(-24px);"></i>`;
    }
    sky.innerHTML = `<div class="sun-rays">${rays}</div><div class="sun-core"></div>`;
  } else {
    weatherCard.classList.add('rain');
    document.getElementById('wDesc').textContent = 'Light rain, grey skies';
    weatherCard.querySelector('.weather-note').textContent = "Gloomy weather. A bit of light and movement will lift your mood.";
    let drops = '<div class="cloud"></div>';
    for (let i = 0; i < 6; i++) {
      drops += `<div class="drop" style="left:${14+i*7}px; top:40px; animation-delay:${i*0.15}s"></div>`;
    }
    sky.innerHTML = drops;
  }

  // ---- LECTEUR MUSIQUE (son d'ambiance généré) ----
  let audioCtx=null, osc=null, gain=null, playing=false, prog=0, timer=null;
  const mplay=document.getElementById('mplay'), mfill=document.getElementById('mfill'), mcur=document.getElementById('mcur');

  function fmt(s){ const m=Math.floor(s/60); const ss=Math.floor(s%60); return m+':'+(ss<10?'0':'')+ss; }

  mplay.addEventListener('click', ()=>{
    if(!playing){
      // démarre un pad d'ambiance doux
      audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
      osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      gain = audioCtx.createGain();
      osc.type='sine'; osc.frequency.value=196;      // sol grave
      osc2.type='sine'; osc2.frequency.value=293.66; // ré
      gain.gain.value=0; gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime+1.5);
      osc.connect(gain); osc2.connect(gain); gain.connect(audioCtx.destination);
      osc.start(); osc2.start();
      osc._sib=osc2;
      playing=true; mplay.textContent='❚❚';
      timer=setInterval(()=>{
        prog+=0.4; if(prog>=490) prog=0;
        mfill.style.width=(prog/490*100)+'%';
        mcur.textContent=fmt(prog);
      },400);
    } else {
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime+0.4);
      setTimeout(()=>{ try{osc.stop();osc._sib.stop();}catch(e){} },450);
      clearInterval(timer);
      playing=false; mplay.textContent='▶';
    }
  });

    };
    run();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styleCss }} />
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );
}