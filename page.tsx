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
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--paper); color: var(--ink); -webkit-font-smoothing: antialiased; line-height: 1.5; }
  .wrap { max-width: 1180px; margin: 0 auto; padding: 0 20px 80px; }
  header { display: flex; align-items: center; justify-content: space-between; padding: 22px 0 26px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-mark { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, var(--navy), var(--teal)); display: grid; place-items: center; color: white; font-weight: 800; font-size: 22px; box-shadow: 0 4px 14px rgba(27,58,107,0.25); }
  .brand-name { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; color: var(--navy); }
  .brand-name span { color: var(--teal); }
  .brand-sub { font-size: 12px; color: var(--mist); letter-spacing: 0.5px; text-transform: uppercase; }
  .date-badge { font-size: 13px; color: var(--slate); font-weight: 500; background: var(--card); padding: 9px 16px; border-radius: 999px; border: 1px solid var(--line); }
  .hero { background: linear-gradient(140deg, var(--navy-deep), var(--navy) 55%, #234a86); border-radius: 24px; padding: 34px; color: white; position: relative; overflow: hidden; box-shadow: 0 16px 40px rgba(27,58,107,0.28); }
  .hero::after { content: ""; position: absolute; right: -80px; top: -80px; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, rgba(46,158,158,0.35), transparent 70%); }
  .hero-grid { display: grid; grid-template-columns: auto 1fr; gap: 40px; align-items: center; position: relative; z-index: 1; }
  .ring-wrap { position: relative; width: 168px; height: 168px; }
  .ring-num { position: absolute; inset: 0; display: grid; place-content: center; text-align: center; }
  .ring-num b { font-size: 52px; font-weight: 800; letter-spacing: -2px; line-height: 1; }
  .ring-num small { font-size: 13px; opacity: 0.7; letter-spacing: 1px; }
  .hero-label { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.75; margin-bottom: 6px; }
  .hero-title { font-size: 27px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 14px; }
  .hero-trend { display: inline-flex; align-items: center; gap: 7px; font-size: 14px; background: rgba(255,255,255,0.14); padding: 7px 14px; border-radius: 999px; }
  .breakdown { display: flex; gap: 10px; margin-top: 26px; position: relative; z-index: 1; flex-wrap: wrap; }
  .chip { flex: 1; min-width: 128px; background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.14); border-radius: 14px; padding: 13px 15px; }
  .chip .lab { font-size: 12px; opacity: 0.72; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
  .chip .val { font-size: 15px; font-weight: 600; }
  .chip .bar { height: 5px; background: rgba(255,255,255,0.15); border-radius: 3px; margin-top: 9px; overflow: hidden; }
  .chip .bar i { display: block; height: 100%; border-radius: 3px; background: var(--teal); }
  .chip .bar i.g { background: var(--gold); }
  .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 18px; margin-top: 22px; }
  .card { background: var(--card); border-radius: 18px; padding: 22px; border: 1px solid var(--line); }
  .col-8 { grid-column: span 8; }
  .col-4 { grid-column: span 4; }
  .col-6 { grid-column: span 6; }
  .col-12 { grid-column: span 12; }
  .card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .card-title { font-size: 15px; font-weight: 700; color: var(--ink); letter-spacing: -0.2px; }
  .card-hint { font-size: 12px; color: var(--mist); }
  .chart { width: 100%; height: 190px; }
  .axis-wrap { position: relative; padding: 0 30px; }
  .axis-wrap .chart { display: block; width: 100%; position: relative; z-index: 1; }
  .axis-line { position: absolute; left: 30px; right: 30px; height: 1px; background: rgba(27,58,107,0.10); z-index: 0; }
  .axis-lab { position: absolute; transform: translateY(-50%); font-size: 11px; font-weight: 600; color: var(--mist); font-variant-numeric: tabular-nums; pointer-events: none; z-index: 2; }
  .axis-lab.l { left: 2px; }
  .axis-lab.r { right: 2px; }
  .legend { display: flex; gap: 16px; margin-top: 12px; }
  .legend span { font-size: 12px; color: var(--slate); display: flex; align-items: center; gap: 6px; }
  .dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
  .mood-row { display: flex; justify-content: space-between; gap: 8px; }
  .mood { flex: 1; aspect-ratio: 1; border: 2px solid var(--line); background: var(--well); border-radius: 16px; font-size: 30px; cursor: pointer; transition: all .18s ease; display: grid; place-items: center; }
  .mood:hover { transform: translateY(-3px); border-color: var(--teal); }
  .mood.active { border-color: var(--teal); background: var(--teal-soft); transform: translateY(-3px); box-shadow: 0 8px 18px rgba(46,158,158,0.2); }
  .mood-labels { display: flex; justify-content: space-between; margin-top: 10px; }
  .mood-labels span { flex: 1; text-align: center; font-size: 10.5px; color: var(--mist); }
  .mood-cta { width: 100%; margin-top: 18px; padding: 13px; border: none; border-radius: 12px; background: var(--navy); color: white; font-size: 14px; font-weight: 600; cursor: pointer; }
  .macro { margin-bottom: 15px; }
  .macro:last-child { margin-bottom: 0; }
  .macro-top { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 7px; }
  .macro-top b { font-weight: 600; }
  .macro-top .muted { color: var(--mist); }
  .track { height: 8px; background: var(--well); border-radius: 5px; overflow: hidden; }
  .track i { display: block; height: 100%; border-radius: 5px; }
  .coach-tip { display: flex; gap: 9px; align-items: flex-start; margin-top: 16px; padding: 12px 13px; background: var(--gold-soft); border-radius: 12px; font-size: 12.5px; color: #7a5e1e; line-height: 1.45; }
  .mini-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .mini { text-align: center; padding: 6px 0; }
  .mini .big { font-size: 30px; font-weight: 800; letter-spacing: -1px; color: var(--navy); }
  .mini .big .u { font-size: 15px; color: var(--mist); font-weight: 600; }
  .mini .cap { font-size: 12px; color: var(--slate); margin-top: 3px; }
  .mini + .mini { border-left: 1px solid var(--line); }
  .today-card .mini-row { gap: 10px; }
  .today-card .mini { padding: 14px 6px; background: var(--well); border-radius: 14px; }
  .today-card .mini + .mini { border-left: none; }
  .today-card .mini .ic { width: 34px; height: 34px; margin: 0 auto 9px; border-radius: 10px; display: grid; place-items: center; font-size: 16px; }
  .today-card .mini .big { font-size: 26px; color: var(--teal); }
  .today-card .card-title { color: var(--teal); }
  .today-card .mini .big .u { font-size: 13px; margin-left: 1px; }
  .today-card .mini .cap { color: var(--mist); font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.7px; margin-top: 3px; }
  .brief-hero { border: 1px solid var(--line); background: linear-gradient(120deg, #ffffff, var(--teal-soft) 260%); }
  .brief { display: flex; gap: 15px; align-items: flex-start; }
  .play { width: 60px; height: 60px; border-radius: 14px; flex-shrink: 0; background: linear-gradient(135deg, var(--teal), var(--navy)); border: none; cursor: pointer; display: grid; place-items: center; color: white; font-size: 20px; box-shadow: 0 6px 16px rgba(46,158,158,0.3); }
  .brief-body p { font-size: 14px; color: var(--slate); max-width: 640px; }
  .brief-body .t { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
  .wave { display: flex; align-items: center; gap: 3px; margin-top: 10px; height: 22px; }
  .wave i { width: 3px; background: var(--teal); border-radius: 2px; opacity: 0.55; }
  .weather { background: linear-gradient(140deg, #4a7fc4, #6ea8dd 60%, #9cc9ec); color: white; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; }
  .weather-top { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; }
  .weather-city { font-size: 13px; opacity: 0.85; font-weight: 500; }
  .weather-desc { font-size: 15px; font-weight: 600; margin-top: 2px; }
  .sky { width: 74px; height: 74px; position: relative; flex-shrink: 0; }
  .sun-core { position: absolute; top: 50%; left: 50%; width: 34px; height: 34px; margin: -17px 0 0 -17px; background: radial-gradient(circle, #fff6d8, #ffd94a); border-radius: 50%; box-shadow: 0 0 18px rgba(255,217,74,0.9); }
  .sun-rays { position: absolute; inset: 0; animation: spin 14s linear infinite; }
  .sun-rays i { position: absolute; top: 50%; left: 50%; width: 3px; height: 11px; margin: -5.5px 0 0 -1.5px; background: rgba(255,240,190,0.95); border-radius: 3px; transform-origin: 50% 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .temps { display: flex; gap: 22px; position: relative; z-index: 2; margin-top: 20px; }
  .temp .tlab { font-size: 11px; opacity: 0.8; display: flex; align-items: center; gap: 5px; }
  .temp .tval { font-size: 26px; font-weight: 700; letter-spacing: -1px; margin-top: 2px; }
  .weather-note { font-size: 12px; opacity: 0.9; margin-top: 14px; position: relative; z-index: 2; background: rgba(255,255,255,0.15); padding: 8px 12px; border-radius: 10px; }
  .music { display: flex; flex-direction: column; }
  .music-head { display: flex; align-items: center; gap: 13px; }
  .cover { width: 58px; height: 58px; border-radius: 13px; flex-shrink: 0; background: linear-gradient(135deg, var(--gold), #e8c069); display: grid; place-items: center; font-size: 24px; }
  .music-meta { flex: 1; min-width: 0; }
  .music-meta .mt { font-size: 14px; font-weight: 700; }
  .music-meta .ma { font-size: 12.5px; color: var(--mist); }
  .music-tag { font-size: 11px; color: var(--teal); font-weight: 600; margin-top: 3px; }
  .music-ctrl { display: flex; align-items: center; gap: 13px; margin-top: 16px; }
  .mplay { width: 44px; height: 44px; border-radius: 50%; border: none; cursor: pointer; flex-shrink: 0; background: var(--navy); color: white; font-size: 15px; display: grid; place-items: center; }
  .mbar { flex: 1; }
  .mbar-track { height: 5px; background: var(--well); border-radius: 3px; overflow: hidden; }
  .mbar-track i { display: block; height: 100%; width: 0%; background: var(--teal); border-radius: 3px; }
  .mbar-time { display: flex; justify-content: space-between; font-size: 11px; color: var(--mist); margin-top: 6px; }
  .quote { margin-top: 20px; padding: 20px 8px 4px; border-top: 1px solid var(--line); text-align: center; }
  .quote-text { font-size: 14px; font-style: italic; color: var(--slate); line-height: 1.6; }
  .quote-text::before { content: "\\201C"; color: var(--gold); font-family: Georgia, serif; font-size: 20px; font-style: normal; }
  .quote-text::after { content: "\\201D"; color: var(--gold); font-family: Georgia, serif; font-size: 20px; font-style: normal; }
  .quote-author { font-size: 12px; font-weight: 600; color: var(--navy); margin-top: 12px; }
  .footer-note { text-align: center; font-size: 12px; color: var(--mist); margin-top: 30px; }
  @media (max-width: 860px) {
    .hero-grid { grid-template-columns: 1fr; gap: 24px; text-align: center; }
    .ring-wrap { margin: 0 auto; }
    .col-8, .col-4, .col-6 { grid-column: span 12; }
    .hero { padding: 26px; }
  }
`;

function axisLayer(ticks, max) {
  var H = 190, pad = 14;
  var out = '';
  for (var i = 0; i < ticks.length; i++) {
    var top = ((H - pad - (ticks[i] / max) * (H - 2 * pad)) / H) * 100;
    out += '<div class="axis-line" style="top:' + top + '%"></div>' +
           '<span class="axis-lab l" style="top:' + top + '%">' + ticks[i] + '</span>' +
           '<span class="axis-lab r" style="top:' + top + '%">' + ticks[i] + '</span>';
  }
  return out;
}

function buildHtml(d) {
  const sleep = d.detail_sommeil || 0;
  const recup = d.detail_recup || 0;
  const activite = d.detail_activite || 0;
  const nutrition = d.detail_nutrition || 0;
  const ressenti = d.detail_ressenti || 0;

  return '<div class="wrap">' +
    '<header>' +
      '<div class="brand">' +
        '<div class="brand-mark">P</div>' +
        '<div>' +
          '<div class="brand-name">Pulse<span>.</span></div>' +
          '<div class="brand-sub">AI Life Coach</div>' +
        '</div>' +
      '</div>' +
      '<div class="date-badge" id="today">Loading...</div>' +
    '</header>' +
    '<section class="hero">' +
      '<div class="hero-grid">' +
        '<div class="ring-wrap">' +
          '<svg width="168" height="168" viewBox="0 0 168 168">' +
            '<circle cx="84" cy="84" r="72" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="13"/>' +
            '<circle id="scoreRing" cx="84" cy="84" r="72" fill="none" stroke="url(#grad)" stroke-width="13" stroke-linecap="round" stroke-dasharray="452" stroke-dashoffset="452" transform="rotate(-90 84 84)"/>' +
            '<defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2E9E9E"/><stop offset="100%" stop-color="#7fe0c4"/></linearGradient></defs>' +
          '</svg>' +
          '<div class="ring-num"><div><b id="scoreNum">0</b><br><small>/ 100</small></div></div>' +
        '</div>' +
        '<div>' +
          '<div class="hero-label">Your Pulse Score today</div>' +
          '<div class="hero-title">Good morning, Thomas.</div>' +
          '<div class="hero-trend">&#x1F4C8; <span>Latest score</span></div>' +
          '<div class="breakdown">' +
            '<div class="chip"><div class="lab">&#x1F634; Sleep</div><div class="val">' + sleep + ' / 20</div><div class="bar"><i style="width:' + Math.round(sleep/20*100) + '%"></i></div></div>' +
            '<div class="chip"><div class="lab">&#x1F50B; Recovery</div><div class="val">' + recup + ' / 20</div><div class="bar"><i style="width:' + Math.round(recup/20*100) + '%"></i></div></div>' +
            '<div class="chip"><div class="lab">&#x1F4AA; Activity</div><div class="val">' + activite + ' / 20</div><div class="bar"><i style="width:' + Math.round(activite/20*100) + '%"></i></div></div>' +
            '<div class="chip"><div class="lab">&#x1F957; Nutrition</div><div class="val">' + nutrition + ' / 15</div><div class="bar"><i class="g" style="width:' + Math.round(nutrition/15*100) + '%"></i></div></div>' +
            '<div class="chip"><div class="lab">&#x1F9E0; Mood</div><div class="val">' + ressenti + ' / 25</div><div class="bar"><i style="width:' + Math.round(ressenti/25*100) + '%"></i></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +
    '<div class="grid">' +
      '<div class="card col-8 brief-hero">' +
        '<div class="brief">' +
          '<button class="play" id="playBtn">&#x25B6;</button>' +
          '<div class="brief-body">' +
            '<div class="t">Your morning briefing</div>' +
            '<p>Your coach has analyzed your night, your mood and your week.</p>' +
            '<div class="wave" id="wave"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="card col-4 today-card"><div class="card-head"><div class="card-title">Yesterday</div><div class="card-hint" id="garminDate">--</div></div><div class="mini-row"><div class="mini"><div class="ic" style="background:var(--teal-soft)">&#x1F45F;</div><div class="big" id="gSteps">--</div><div class="cap">Steps</div></div><div class="mini"><div class="ic" style="background:#e7e2f7">&#x1F634;</div><div class="big" id="gSleep">--<span class="u">h</span></div><div class="cap">Sleep</div></div><div class="mini"><div class="ic" style="background:#fae0e0">&#x2764;&#xFE0F;</div><div class="big" id="gHr">--<span class="u">bpm</span></div><div class="cap">Resting HR</div></div></div></div>' +
    '</div>' +
    '<div class="grid">' +
      '<div class="card col-8"><div class="card-head"><div class="card-title">Pulse Score trend</div><div class="card-hint">Last 30 days</div></div>' +
        '<div class="axis-wrap">' + axisLayer([25, 50, 75, 100], 100) +
          '<svg class="chart" id="scoreChart" viewBox="0 0 640 190" preserveAspectRatio="none"></svg>' +
        '</div>' +
      '</div>' +
      '<div class="card col-4"><div class="card-head"><div class="card-title">How you feel right now</div></div><div class="mood-row" id="moodRow"><button class="mood" data-v="1">&#x1F614;</button><button class="mood" data-v="2">&#x1F615;</button><button class="mood" data-v="3">&#x1F610;</button><button class="mood active" data-v="4">&#x1F642;</button><button class="mood" data-v="5">&#x1F604;</button></div><div class="mood-labels"><span>Rough</span><span></span><span>Okay</span><span></span><span>Great</span></div><button class="mood-cta" id="moodBtn">Log my mood</button></div>' +
    '</div>' +
    '<div class="grid">' +
      '<div class="card col-8"><div class="card-head"><div class="card-title">Mood, stress &amp; energy</div><div class="card-hint">Last 7 days</div></div>' +
        '<div class="axis-wrap">' + axisLayer([2.5, 5, 7.5, 10], 10) +
          '<svg class="chart" id="moodChart" viewBox="0 0 640 190" preserveAspectRatio="none"></svg>' +
        '</div>' +
        '<div class="legend"><span><i class="dot" style="background:#2E9E9E"></i>Mood</span><span><i class="dot" style="background:#D4A843"></i>Stress</span><span><i class="dot" style="background:#1B3A6B"></i>Energy</span></div>' +
      '</div>' +
      '<div class="card col-4"><div class="card-head"><div class="card-title">Nutrition</div><div class="card-hint" id="nutriDate">--</div></div><div class="macro"><div class="macro-top"><b>Calories</b><span class="muted" id="nCalTxt">-- / 2100 kcal</span></div><div class="track"><i id="nCalBar" style="width:0%; background:var(--gold)"></i></div></div><div class="macro"><div class="macro-top"><b>Protein</b><span class="muted" id="nProTxt">-- / 140 g</span></div><div class="track"><i id="nProBar" style="width:0%; background:var(--teal)"></i></div></div><div class="macro"><div class="macro-top"><b>Carbs</b><span class="muted" id="nCarTxt">-- / 250 g</span></div><div class="track"><i id="nCarBar" style="width:0%; background:#5bb8d4"></i></div></div><div class="macro"><div class="macro-top"><b>Fat</b><span class="muted" id="nFatTxt">-- / 70 g</span></div><div class="track"><i id="nFatBar" style="width:0%; background:#c47fd4"></i></div></div></div>' +
    '</div>' +
    '<div class="grid">' +
      '<div class="card col-6 music"><div class="music-head"><div class="cover">&#x1F3B5;</div><div class="music-meta"><div class="mt">Weightless</div><div class="ma">Marconi Union</div><div class="music-tag">&#x25C6; Suggested for your morning focus</div></div></div><div class="music-ctrl"><button class="mplay" id="mplay">&#x25B6;</button><div class="mbar"><div class="mbar-track"><i id="mfill"></i></div><div class="mbar-time"><span id="mcur">0:00</span><span>8:10</span></div></div></div><div class="quote"><p class="quote-text">Waste no more time arguing what a good man should be. Be one.</p><div class="quote-author">- Marc Aurele</div></div></div>' +
      '<div class="card col-6 weather"><div class="weather-top"><div><div class="weather-city">Location</div><div class="weather-desc">--</div></div><div class="sky" id="sky"></div></div><div class="temps"><div class="temp"><div class="tlab">Now</div><div class="tval">--</div></div><div class="temp"><div class="tlab">Feels like</div><div class="tval">--</div></div></div><div class="weather-note">Have a great day, Thomas.</div></div>' +
    '</div>' +
    '<div class="footer-note">Pulse AI Life Coach</div>' +
  '</div>';
}

export default function Home() {
  useEffect(() => {
    fetch('/api/pulse')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var row = (data && data[0]) ? data[0] : {};
        var score = row.pulse_score || 0;
        var container = document.getElementById('pulse-root');
        if (container) container.innerHTML = buildHtml(row);
        initDashboard(score, data);
      })
      .catch(function() {
        var container = document.getElementById('pulse-root');
        if (container) container.innerHTML = buildHtml({});
        initDashboard(0, []);
      });

    function initDashboard(pulseScore, allData) {
      var d = new Date();
      var jours = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      var mois = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      var todayEl = document.getElementById('today');
      if (todayEl) todayEl.textContent = jours[d.getDay()] + ', ' + mois[d.getMonth()] + ' ' + d.getDate();

      var target = pulseScore;
      var ring = document.getElementById('scoreRing');
      var num = document.getElementById('scoreNum');
      var circ = 452;
      var cur = 0;
      var anim = setInterval(function() {
        cur += 1.5;
        if (cur >= target) { cur = target; clearInterval(anim); }
        if (num) num.textContent = String(Math.round(cur));
        if (ring) ring.style.strokeDashoffset = String(circ - (circ * cur / 100));
      }, 18);

      function smoothPath(pts) {
        var dstr = 'M ' + pts[0][0] + ' ' + pts[0][1];
        for (var i = 0; i < pts.length - 1; i++) {
          var x0 = pts[i][0], y0 = pts[i][1], x1 = pts[i+1][0], y1 = pts[i+1][1];
          var cx = (x0 + x1) / 2;
          dstr += ' C ' + cx + ' ' + y0 + ', ' + cx + ' ' + y1 + ', ' + x1 + ' ' + y1;
        }
        return dstr;
      }

      (function() {
        var scores;
        if (allData && allData.length > 1) {
          scores = allData.slice().reverse().map(function(r) { return r.pulse_score || 0; });
        } else {
          scores = [58,61,60,64,62,59,63,66,64,68,65,63,67,70,69,66,64,68,71,73,70,68,72,74,71,69,73,72,70,pulseScore];
        }
        var W=640, H=190, pad=14, max=100, min=0;
        var pts = scores.map(function(v, i) {
          return [pad + i*(W-2*pad)/(scores.length-1), H-pad-(v-min)/(max-min)*(H-2*pad)];
        });
        var svg = document.getElementById('scoreChart');
        if (!svg) return;
        var area = smoothPath(pts) + ' L ' + pts[pts.length-1][0] + ' ' + H + ' L ' + pts[0][0] + ' ' + H + ' Z';
        svg.innerHTML =
          '<defs><linearGradient id="fill1" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#2E9E9E" stop-opacity="0.28"/>' +
          '<stop offset="100%" stop-color="#2E9E9E" stop-opacity="0"/>' +
          '</linearGradient></defs>' +
          '<path d="' + area + '" fill="url(#fill1)"/>' +
          '<path d="' + smoothPath(pts) + '" fill="none" stroke="#2E9E9E" stroke-width="2.5" stroke-linecap="round"/>' +
          '<circle cx="' + pts[pts.length-1][0] + '" cy="' + pts[pts.length-1][1] + '" r="5" fill="#2E9E9E" stroke="white" stroke-width="2.5"/>';
      })();

      (function() {
        var hum=[6,7,5,7,8,7,8], str=[5,4,7,5,3,4,3], ene=[6,6,5,7,7,8,8];
        var W=640, H=190, pad=14, max=10, min=0;
        function mk(arr) {
          return arr.map(function(v, i) { return [pad+i*(W-2*pad)/(arr.length-1), H-pad-(v-min)/(max-min)*(H-2*pad)]; });
        }
        function line(pts, col) {
          return '<path d="' + smoothPath(pts) + '" fill="none" stroke="' + col + '" stroke-width="2.5" stroke-linecap="round"/>' +
            pts.map(function(p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="' + col + '"/>'; }).join('');
        }
        var mc = document.getElementById('moodChart');
        if (mc) mc.innerHTML = line(mk(hum),'#2E9E9E') + line(mk(str),'#D4A843') + line(mk(ene),'#1B3A6B');
      })();

      document.querySelectorAll('.mood').forEach(function(m) {
        m.addEventListener('click', function() {
          document.querySelectorAll('.mood').forEach(function(x) { x.classList.remove('active'); });
          m.classList.add('active');
        });
      });
      var moodBtn = document.getElementById('moodBtn');
      if (moodBtn) {
        moodBtn.addEventListener('click', function() {
          moodBtn.textContent = 'Mood logged';
          moodBtn.style.background = 'var(--teal)';
          setTimeout(function() { moodBtn.textContent = 'Log my mood'; moodBtn.style.background = 'var(--navy)'; }, 1800);
        });
      }

      var wave = document.getElementById('wave');
      if (wave) {
        for (var i = 0; i < 26; i++) {
          var b = document.createElement('i');
          b.style.height = (6 + Math.abs(Math.sin(i*0.7))*16) + 'px';
          wave.appendChild(b);
        }
      }

      var briefAudio = null;
      var briefPlaying = false;
      var playBtn = document.getElementById('playBtn');
      fetch('/api/briefing')
        .then(function(r) { return r.json(); })
        .then(function(bd) {
          if (bd && bd[0] && bd[0].audio_url) {
            briefAudio = new Audio(bd[0].audio_url);
            briefAudio.addEventListener('ended', function() {
              briefPlaying = false;
              if (playBtn) playBtn.textContent = '\u25B6';
            });
          }
        });
      if (playBtn) {
        playBtn.addEventListener('click', function() {
          if (!briefAudio) return;
          if (briefPlaying) {
            briefAudio.pause();
            briefPlaying = false;
            playBtn.textContent = '\u25B6';
          } else {
            briefAudio.play();
            briefPlaying = true;
            playBtn.textContent = '\u275A\u275A';
          }
        });
      }

      var sky = document.getElementById('sky');
      if (sky) {
        var rays = '';
        for (var j = 0; j < 12; j++) {
          rays += '<i style="transform: rotate(' + (j*30) + 'deg) translateY(-24px);"></i>';
        }
        sky.innerHTML = '<div class="sun-rays">' + rays + '</div><div class="sun-core"></div>';
      }

      var audioCtx = null, osc = null, gain = null, playing = false, prog = 0, timer = null;
      var mplay = document.getElementById('mplay');
      var mfill = document.getElementById('mfill');
      var mcur = document.getElementById('mcur');
      function fmt(s) { var m = Math.floor(s/60); var ss = Math.floor(s%60); return m + ':' + (ss<10?'0':'') + ss; }
      if (mplay) {
        mplay.addEventListener('click', function() {
          if (!playing) {
            audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            osc = audioCtx.createOscillator();
            var osc2 = audioCtx.createOscillator();
            gain = audioCtx.createGain();
            osc.type = 'sine'; osc.frequency.value = 196;
            osc2.type = 'sine'; osc2.frequency.value = 293.66;
            gain.gain.value = 0; gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime+1.5);
            osc.connect(gain); osc2.connect(gain); gain.connect(audioCtx.destination);
            osc.start(); osc2.start();
            osc._sib = osc2;
            playing = true; mplay.textContent = '\u275A\u275A';
            timer = setInterval(function() {
              prog += 0.4; if (prog >= 490) prog = 0;
              if (mfill) mfill.style.width = (prog/490*100) + '%';
              if (mcur) mcur.textContent = fmt(prog);
            }, 400);
          } else {
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime+0.4);
            setTimeout(function() { try { osc.stop(); osc._sib.stop(); } catch(e) {} }, 450);
            clearInterval(timer);
            playing = false; mplay.textContent = '\u25B6';
          }
        });
      }

      fetch('/api/weather')
        .then(function(r) { return r.json(); })
        .then(function(w) {
          if (!w || w.error) return;
          var c = document.querySelector('.weather-city');
          var ds = document.querySelector('.weather-desc');
          var tv = document.querySelectorAll('.temp .tval');
          var nt = document.querySelector('.weather-note');
          if (c) c.textContent = w.city || '';
          if (ds) ds.textContent = (w.desc || '').replace(/^./, function(m) { return m.toUpperCase(); });
          if (tv[0]) tv[0].textContent = w.temp + '\u00B0';
          if (tv[1]) tv[1].textContent = w.feels + '\u00B0';
          if (nt && w.feels >= 35) nt.textContent = 'High heat index. Increase your hydration today.';
        });

      fetch('/api/garmin')
        .then(function(r) { return r.json(); })
        .then(function(g) {
          if (!g) return;
          var st = document.getElementById('gSteps');
          var sl = document.getElementById('gSleep');
          var hr = document.getElementById('gHr');
          var gd = document.getElementById('garminDate');
          if (st) st.textContent = String(g.total_steps || 0);
          if (sl) sl.innerHTML = (g.sleep_hours || 0) + '<span class="u">h</span>';
          if (hr) hr.innerHTML = (g.resting_hr || 0) + '<span class="u">bpm</span>';
          if (gd && g.date) gd.textContent = g.date;
        });

      fetch('/api/nutrition')
        .then(function(r) { return r.json(); })
        .then(function(n) {
          if (!n) return;
          var goals = { cal: 2100, pro: 140, car: 250, fat: 70 };
          function set(txtId, barId, val, goal, unit) {
            var t = document.getElementById(txtId);
            var b = document.getElementById(barId);
            if (t) t.textContent = Math.round(val) + ' / ' + goal + ' ' + unit;
            if (b) b.style.width = Math.min(100, Math.round(val / goal * 100)) + '%';
          }
          set('nCalTxt', 'nCalBar', n.calories || 0, goals.cal, 'kcal');
          set('nProTxt', 'nProBar', n.proteines || 0, goals.pro, 'g');
          set('nCarTxt', 'nCarBar', n.glucides || 0, goals.car, 'g');
          set('nFatTxt', 'nFatBar', n.lipides || 0, goals.fat, 'g');
          var nd = document.getElementById('nutriDate');
          if (nd && n.date) nd.textContent = n.date;
        });

      fetch('/api/checkin')
        .then(function(r) { return r.json(); })
        .then(function(cdata) {
          if (cdata && cdata.length > 0) {
            var reversed = cdata.slice().reverse();
            var hum = reversed.map(function(x) { return x.humeur || 0; });
            var str = reversed.map(function(x) { return x.stress || 0; });
            var ene = reversed.map(function(x) { return x.energie || 0; });
            var W=640, H=190, pad=14, max=10, min=0;
            function mk(arr) {
              return arr.map(function(v, i) {
                return [pad+i*(W-2*pad)/(arr.length-1), H-pad-(v-min)/(max-min)*(H-2*pad)];
              });
            }
            function line(pts, col) {
              return '<path d="'+smoothPath(pts)+'" fill="none" stroke="'+col+'" stroke-width="2.5" stroke-linecap="round"/>'+
                pts.map(function(p) { return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.5" fill="'+col+'"/>'; }).join('');
            }
            var mc = document.getElementById('moodChart');
            if (mc) mc.innerHTML = line(mk(hum),'#2E9E9E')+line(mk(str),'#D4A843')+line(mk(ene),'#1B3A6B');
          }
        });
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styleCss }} />
      <div id="pulse-root">
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'#5a6a82'}}>
          Loading...
        </div>
      </div>
    </>
  );
}