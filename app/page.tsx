"use client";

import { useEffect } from "react";
import FabChat from "./components/FabChat";

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
.hero-grid { display: grid; grid-template-columns: auto 1fr; gap: 40px; }
  .ring-wrap { position: relative; width: 168px; height: 168px; }
  .hero-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }  
  .meal-cta { display: flex; align-items: center; gap: 12px; position: relative; z-index: 2; }  .meal-btn:hover { background: rgba(255,255,255,0.22); transform: translateY(-2px); }
  .hydra-cta { display: flex; align-items: center; gap: 8px; margin-top: 0; position: relative; z-index: 2; }
  .hydra-btn { background: rgba(255,255,255,0.12); border: none; border-radius: 50%; width: 38px; height: 38px; font-size: 17px; cursor: pointer; transition: all 0.2s; }
  .hydra-btn:hover { background: rgba(255,255,255,0.22); transform: translateY(-2px); }
  .hydra-btn.done { background: var(--teal); transform: scale(1.15); }  
  .meal-btn { width: 52px; height: 52px; border-radius: 26px; border: none; background: rgba(255,255,255,0.14); color: #fff; font-size: 22px; cursor: pointer; transition: background .25s, transform .15s; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .meal-btn:hover { background: rgba(255,255,255,0.22); transform: translateY(-2px); }
  .meal-btn.done { background: var(--teal); }
  .meal-btn.busy { cursor: default; }
  .meal-lab { font-size: 12px; color: rgba(255,255,255,0.7); text-align: center; max-width: 110px; line-height: 1.35; }
  .meal-spin { width: 22px; height: 22px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: mspin .8s linear infinite; }
  @keyframes mspin { to { transform: rotate(360deg) } }
  .ring-num { position: absolute; inset: 0; display: grid; place-content: center; text-align: center; }
  .ring-num b { font-size: 52px; font-weight: 800; letter-spacing: -2px; line-height: 1; }
  .ring-num small { font-size: 13px; opacity: 0.7; letter-spacing: 1px; }
  .hero-label { font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.75; margin-bottom: 6px; }
  .hero-title { font-size: 27px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 6px; }
  .hero-events { display: none; margin-bottom: 14px; font-size: 13px; color: var(--mist); }  
  .hero-events a { color: var(--mist); text-decoration: none; border-bottom: 1px dotted var(--mist); }
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
  .mood-avg { font-size: 12px; color: var(--mist); }
  .body-vals { display: flex; align-items: baseline; gap: 24px; margin: 14px 0 16px; width: 100%; }
  .body-trend { margin-left: auto; display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; }
  .body-trend .arrow { font-size: 17px; line-height: 1; }
  .body-trend.good { color: #1a8a52; }
  .body-trend.bad { color: #c0392b; }
  .body-trend.flat { color: var(--gold); }
  .body-val { display: flex; align-items: baseline; gap: 5px; }
  .body-val b { font-size: 26px; font-weight: 800; letter-spacing: -1px; color: var(--navy); }
  .body-val small { font-size: 11px; color: var(--mist); }
  .body-form { display: flex; gap: 8px; }
  .body-form input { flex: 1; min-width: 0; padding: 9px 10px; border: 1px solid var(--line); border-radius: 9px; font-size: 13px; background: var(--well); color: var(--ink); }
  .body-save { padding: 9px 16px; border: none; border-radius: 9px; background: var(--teal); color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; }
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
  .today-card .mini .big .u { font-size: 13px; margin: 0 3px; }  .today-card .mini .cap { color: var(--mist); font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.7px; margin-top: 3px; }
  .week-row { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
  .day-col { text-align: center; }
  .day-lab { font-size: 11px; font-weight: 700; color: var(--mist); margin-bottom: 7px; text-transform: uppercase; }
  .day-box { aspect-ratio: 1; border-radius: 12px; background: var(--well); border: 2px solid transparent; cursor: pointer; display: grid; place-items: center; font-size: 18px; transition: all .16s ease; }
  .day-box:hover { border-color: var(--teal); transform: translateY(-2px); }
  .day-box.done { background: var(--teal-soft); border-color: var(--teal); }
  .day-box.today { border-color: var(--navy); }
  .day-note { font-size: 9.5px; color: var(--mist); margin-top: 5px; line-height: 1.25; min-height: 12px; }
  .modal-bg { position: fixed; inset: 0; background: rgba(18,41,77,0.45); display: none; place-items: center; z-index: 50; padding: 20px; }
  .modal-bg.open { display: grid; }
  .modal { background: #fff; border-radius: 20px; padding: 26px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(18,41,77,0.3); }
  .modal h3 { font-size: 17px; color: var(--navy); margin-bottom: 4px; }
  .modal .msub { font-size: 12.5px; color: var(--mist); margin-bottom: 18px; }
  .mus-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .mus { padding: 8px 14px; border-radius: 999px; border: 2px solid var(--line); background: var(--well); font-size: 12.5px; font-weight: 600; color: var(--slate); cursor: pointer; transition: all .15s ease; }
  .mus.on { background: var(--teal-soft); border-color: var(--teal); color: var(--navy); }
  .modal textarea { width: 100%; border: 2px solid var(--line); border-radius: 12px; padding: 11px; font-size: 13px; font-family: inherit; resize: vertical; min-height: 66px; outline: none; }
  .modal textarea:focus { border-color: var(--teal); }
  .modal-btns { display: flex; gap: 10px; margin-top: 18px; }
  .modal-btns button { flex: 1; padding: 12px; border: none; border-radius: 12px; font-size: 13.5px; font-weight: 600; cursor: pointer; }
  .btn-save { background: var(--navy); color: #fff; }
  .btn-cancel { background: var(--well); color: var(--slate); }
  .btn-delete { background: transparent; color: #c0392b; border: 1px solid #e8c4bf; margin-right: auto; }
  .brief-hero { border: 1px solid var(--line); background: linear-gradient(120deg, #ffffff, var(--teal-soft) 260%); }
  .brief { display: flex; gap: 15px; align-items: flex-start; }
  .play { width: 60px; height: 60px; border-radius: 14px; flex-shrink: 0; background: linear-gradient(135deg, var(--teal), var(--navy)); border: none; cursor: pointer; display: grid; place-items: center; color: white; font-size: 20px; box-shadow: 0 6px 16px rgba(46,158,158,0.3); }
  .brief-body p { font-size: 14px; color: var(--slate); max-width: 640px; }
  .brief-body .t { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
  .wave { display: flex; align-items: center; gap: 3px; margin-top: 10px; height: 22px; }
  .wave i { width: 3px; background: var(--teal); border-radius: 2px; opacity: 0.55; }
  .wave i { transition: height .09s linear; }
  .pbar-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
  .pbar { position: relative; flex: 1; height: 14px; display: flex; align-items: center; cursor: pointer; touch-action: none; }
  .pbar::before { content: ''; position: absolute; left: 0; right: 0; height: 4px; border-radius: 2px; background: rgba(255,255,255,.28); }
  .pbar-fill { position: absolute; left: 0; height: 4px; width: 0%; border-radius: 2px; background: var(--teal); }
  .pbar-knob { position: absolute; left: 0%; width: 13px; height: 13px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.3); transform: translateX(-6.5px); }
  .pbar-dur { font-size: 12px; color: var(--slate); font-variant-numeric: tabular-nums; flex-shrink: 0; }
  .weather { background: linear-gradient(140deg, #4a7fc4, #6ea8dd 60%, #9cc9ec); color: white; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; }
  .weather-top { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; }
  .weather-city { font-size: 13px; opacity: 0.85; font-weight: 500; }
  .weather-desc { font-size: 15px; font-weight: 600; margin-top: 2px; }
  .sky { width: 74px; height: 74px; position: relative; flex-shrink: 0; }
  .sun-core { position: absolute; top: 50%; left: 50%; width: 34px; height: 34px; margin: -17px 0 0 -17px; background: radial-gradient(circle, #fff6d8, #ffd94a); border-radius: 50%; box-shadow: 0 0 18px rgba(255,217,74,0.9); }
  .sun-rays { position: absolute; inset: 0; animation: spin 14s linear infinite; }
  .sun-rays i { position: absolute; top: 50%; left: 50%; width: 3px; height: 11px; margin: -25px 0 0 -1.5px; background: rgba(255,240,190,0.95); border-radius: 3px; transform-origin: 50% 25px; }
  .cloud { position: absolute; background: rgba(255,255,255,0.92); border-radius: 999px; box-shadow: 0 3px 10px rgba(0,0,0,0.08); }
  .cloud.c1 { width: 46px; height: 18px; top: 26px; left: 12px; }
  .cloud.c1::before { content: ""; position: absolute; width: 22px; height: 22px; background: inherit; border-radius: 50%; top: -11px; left: 8px; }
  .cloud.c1::after { content: ""; position: absolute; width: 16px; height: 16px; background: inherit; border-radius: 50%; top: -8px; left: 26px; }
  .cloud.c2 { width: 30px; height: 12px; top: 44px; left: 32px; opacity: 0.65; }
  .drop { position: absolute; top: 46px; width: 2.5px; height: 9px; background: rgba(255,255,255,0.9); border-radius: 2px; animation: fall 1.1s linear infinite; }
  @keyframes fall { 0% { transform: translateY(0); opacity: 0; } 25% { opacity: 1; } 100% { transform: translateY(22px); opacity: 0; } }
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
.quote-text::before { content: "\\201C"; color: var(--gold); font-family: Georgia, serif; font-size: 20px; font-style: normal; margin-right: 4px; }
.quote-text::after { content: "\\201D"; color: var(--gold); font-family: Georgia, serif; font-size: 20px; font-style: normal; margin-left: 4px; }  
.quote-author { font-size: 12px; font-weight: 600; color: var(--navy); margin-top: 12px; }
  .footer-note { text-align: center; font-size: 12px; color: var(--mist); margin-top: 30px; }
  @media (max-width: 860px) {
    .hero-grid { grid-template-columns: 1fr; gap: 24px; text-align: center; }
    .ring-wrap { margin: 0 auto; }
    .col-8, .col-4, .col-6 { grid-column: span 12; }
    .hero { padding: 26px; }
  }
.mlink { display: inline-flex; width: fit-content; align-items: center; gap: 7px; margin-top: 14px; padding: 9px 16px; border-radius: 20px; background: #ff0000; color: #fff; font-size: 13px; font-weight: 600; text-decoration: none; transition: background .18s ease; }    
.mlink:hover { background: #cc0000; }
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
        '<div class="hero-title" id="heroGreet">Hello, Thomas.</div>' +
        '<div class="hero-events" id="heroEvents"></div>' +        
        '<div class="hero-row">' +
            '<div class="hydra-cta">' +
              '<button class="hydra-btn" data-b="cafe">&#x2615;</button>' +
              '<button class="hydra-btn" data-b="verre">&#x1FAD7;</button>' +
              '<button class="hydra-btn" data-b="litre">&#x1F4A7;</button>' +
            '</div>' +            
            '<div class="meal-cta">' +
              '<input type="file" accept="image/*" capture="environment" id="mealInput" style="display:none">' +
              '<div class="meal-lab" id="mealLab">Log a meal</div>' +
              '<button class="meal-btn" id="mealBtn">&#x1F4F7;</button>' +
            '</div>' +            
            '</div>' +
            '<div class="breakdown">' +
            '<div class="chip"><div class="lab">&#x1F634; Sleep</div><div class="val">' + sleep + ' / 20</div><div class="bar"><i style="width:' + Math.round(sleep/20*100) + '%"></i></div></div>' +            
            '<div class="chip"><div class="lab">&#x1F50B; Recovery</div><div class="val">' + recup + ' / 20</div><div class="bar"><i style="width:' + Math.round(recup/20*100) + '%"></i></div></div>' +
            '<div class="chip"><div class="lab">&#x1F4AA; Activity</div><div class="val">' + activite + ' / 20</div><div class="bar"><i style="width:' + Math.round(activite/20*100) + '%"></i></div></div>' +
            '<div class="chip"><div class="lab">&#x1F957; Nutrition</div><div class="val">' + nutrition + ' / 20</div><div class="bar"><i class="g" style="width:' + Math.round(nutrition/20*100) + '%"></i></div></div>' +            
            '<div class="chip"><div class="lab">&#x1F9E0; Mood</div><div class="val">' + ressenti + ' / 20</div><div class="bar"><i style="width:' + Math.round(ressenti/20*100) + '%"></i></div></div>' +          '</div>' +
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
                '<div class="pbar-row">' +
                  '<div class="pbar" id="pbar"><div class="pbar-fill" id="pbarFill"></div><div class="pbar-knob" id="pbarKnob"></div></div>' +
                  '<div class="pbar-dur" id="pbarDur">--:--</div>' +
                '</div>' +          
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
      '<div class="card col-4"><div class="card-head"><div class="card-title">How you feel right now</div><div class="mood-avg" id="moodAvg"></div></div><div class="mood-row" id="moodRow"><button class="mood" data-v="1">&#x1F614;</button><button class="mood" data-v="2">&#x1F615;</button><button class="mood" data-v="3">&#x1F610;</button><button class="mood active" data-v="4">&#x1F642;</button><button class="mood" data-v="5">&#x1F604;</button></div><div class="mood-labels"><span>Rough</span><span></span><span>Okay</span><span></span><span>Great</span></div><button class="mood-cta" id="moodBtn">Log my mood</button></div>' +    
      '</div>' +
    '<div class="grid">' +
      '<div class="card col-8"><div class="card-head"><div class="card-title">Mood, stress &amp; energy</div><div class="card-hint">Last 7 days</div></div>' +
        '<div class="axis-wrap">' + axisLayer([2.5, 5, 7.5, 10], 10) +
          '<svg class="chart" id="moodChart" viewBox="0 0 640 190" preserveAspectRatio="none"></svg>' +
        '</div>' +
        '<div class="legend"><span><i class="dot" style="background:#2E9E9E"></i>Mood</span><span><i class="dot" style="background:#D4A843"></i>Stress</span><span><i class="dot" style="background:#1B3A6B"></i>Energy</span></div>' +
      '</div>' +
'<div class="card col-4"><div class="card-head"><div class="card-title">Nutrition</div><a href="/nutrition" class="card-hint" style="color:var(--teal);text-decoration:none;font-weight:600">Details &#x2192;</a></div><div class="macro"><div class="macro-top"><b>Calories</b><span class="muted" id="nCalTxt">-- / 2750 kcal</span></div><div class="track"><i id="nCalBar" style="width:0%; background:var(--gold)"></i></div></div><div class="macro"><div class="macro-top"><b>Protein</b><span class="muted" id="nProTxt">-- / 195 g</span></div><div class="track"><i id="nProBar" style="width:0%; background:var(--teal)"></i></div></div><div class="macro"><div class="macro-top"><b>Carbs</b><span class="muted" id="nCarTxt">-- / 285 g</span></div><div class="track"><i id="nCarBar" style="width:0%; background:#5bb8d4"></i></div></div><div class="macro"><div class="macro-top"><b>Fat</b><span class="muted" id="nFatTxt">-- / 92 g</span></div><div class="track"><i id="nFatBar" style="width:0%; background:#c47fd4"></i></div></div></div>' +
'</div>' +    
    '<div class="grid">' +
      '<div class="card col-12"><div class="card-head"><div class="card-title">Sessions this week</div><div class="card-hint" id="weekCount">--</div></div><div class="week-row" id="weekRow"></div></div>' +
    '</div>' +

    '<div class="grid">' +
      '<div class="card col-12"><div class="card-head"><div class="card-title">Body composition</div><a href="/body" class="card-hint" style="color:var(--teal);text-decoration:none;font-weight:600">Details &#x2192;</a></div>' +
        '<div class="body-vals">' +
          '<div class="body-val"><b id="bodyWeight">--</b><small>kg</small></div>' +
          '<div class="body-val"><b id="bodyFat">--</b><small>% fat</small></div>' +
          '<div class="body-trend" id="bodyTrend"></div>' +
        '</div>' +
          '<div class="body-form">' +
          '<input type="number" step="0.1" id="bodyWeightIn" placeholder="Weight">' +
          '<input type="number" step="0.1" id="bodyFatIn" placeholder="% fat">' +
          '<button class="body-save" id="bodySave">Save</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="grid">' +
    '<div class="card col-6 music"><div class="music-head"><div class="cover">&#x1F3B5;</div><div class="music-meta"><div class="mt" id="mTitle">--</div><div class="ma" id="mArtist">--</div><div class="music-tag">&#x25C6; Suggested for today</div></div></div><a class="mlink" id="mLink" href="#" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>Listen on YouTube</a><div class="quote"><p class="quote-text" id="qText">--</p><div class="quote-author" id="qAuthor"></div></div></div>' +
'<div class="card col-6 weather"><div class="weather-top"><div><div class="weather-city">Location</div><div class="weather-desc">--</div></div><div class="sky" id="sky"></div></div><div class="temps"><div class="temp"><div class="tlab">Now</div><div class="tval">--</div></div><div class="temp"><div class="tlab">Feels like</div><div class="tval">--</div></div></div><div class="weather-note">Have a great day, Thomas.</div></div>' +
    '</div>' +
    '<div class="footer-note">Pulse AI Life Coach</div>' +
    '<div class="modal-bg" id="sessModal"><div class="modal"><h3 id="modalDay">Session</h3><div class="msub">Which muscles did you train?</div><div class="mus-row" id="musRow"></div><textarea id="sessNote" placeholder="Optional note"></textarea><div class="modal-btns"><button class="btn-delete" id="sessDelete">Delete</button><button class="btn-cancel" id="sessCancel">Cancel</button><button class="btn-save" id="sessSave">Save</button></div></div></div>' +'</div>';  
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
      var hg = document.getElementById('heroGreet');
      if (hg) {
        var h = new Date().getHours();
        var g = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : h < 22 ? 'Good evening' : 'Good night';
        hg.textContent = g + ', Thomas.';
      }
      var mealInput = document.getElementById('mealInput');
      var mealBtn = document.getElementById('mealBtn');
      var mealLab = document.getElementById('mealLab');
      
      document.querySelectorAll('.hydra-btn').forEach(function(hb) {
        hb.addEventListener('click', function() {
          if (hb.classList.contains('busy')) return;
          hb.classList.add('busy');

          fetch('/api/hydration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ boisson: hb.getAttribute('data-b') })
          })
            .then(function(r) { return r.json(); })
            .then(function() {
              hb.classList.remove('busy');
              hb.classList.add('done');
              setTimeout(function() { hb.classList.remove('done'); }, 1200);
            })
            .catch(function() { hb.classList.remove('busy'); });
        });
      });

      if (mealBtn && mealInput) {
        mealBtn.onclick = function () {
          if (mealBtn.classList.contains('busy')) return;
          mealInput.click();
        };

        mealInput.onchange = function () {
          var file = mealInput.files && mealInput.files[0];
          if (!file) return;

          mealBtn.classList.add('busy');
          mealBtn.innerHTML = '<span class="meal-spin"></span>';
          mealLab.textContent = 'Analysing...';

          createImageBitmap(file).then(function (bmp) {
            var max = 900;
            var scale = Math.min(max / bmp.width, max / bmp.height, 1);
            var cv = document.createElement('canvas');
            cv.width = Math.round(bmp.width * scale);
            cv.height = Math.round(bmp.height * scale);
            cv.getContext('2d').drawImage(bmp, 0, 0, cv.width, cv.height);
            var b64 = cv.toDataURL('image/jpeg', 0.8).split(',')[1];

            return fetch('/api/meal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: b64 })
            });
          }).then(function (r) {
            if (!r.ok) throw new Error('fail');
            mealBtn.classList.remove('busy');
            mealBtn.classList.add('done');
            mealBtn.innerHTML = '&#x2713;';
            mealLab.innerHTML = '<a href="/nutrition" style="color:#fff;text-decoration:underline">See details</a>';
            setTimeout(function () {
              mealBtn.classList.remove('done');
              mealBtn.innerHTML = '&#x1F4F7;';
              mealLab.textContent = 'Log a meal';
            }, 6000);
          }).catch(function () {
            mealBtn.classList.remove('busy');
            mealBtn.innerHTML = '&#x1F4F7;';
            mealLab.textContent = 'Failed, try again';
            setTimeout(function () { mealLab.textContent = 'Log a meal'; }, 4000);
          });

          mealInput.value = '';
        };
      }

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
      var bodySave = document.getElementById('bodySave');
      if (bodySave) {
        bodySave.addEventListener('click', function() {
          var wIn = document.getElementById('bodyWeightIn');
          var fIn = document.getElementById('bodyFatIn');
          var payload = {};
          if (wIn.value !== '') payload.poids = parseFloat(wIn.value);
          if (fIn.value !== '') payload.masse_grasse = parseFloat(fIn.value);
          if (!payload.poids && !payload.masse_grasse) return;

          bodySave.textContent = 'Saving...';

          fetch('/api/body', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
            .then(function(r) { return r.json(); })
            .then(function() {
              bodySave.textContent = 'Save';
              wIn.value = '';
              fIn.value = '';
              return fetch('/api/body').then(function(r) { return r.json(); });
            })
            .then(function(d) { renderBody(d); });
        });
      }
      var moodBtn = document.getElementById('moodBtn');      
      if (moodBtn) {
        moodBtn.addEventListener('click', function() {
          var sel = document.querySelector('.mood.active');
          if (!sel) return;
          var v = parseInt(sel.getAttribute('data-v'), 10) * 2;

          moodBtn.textContent = 'Saving...';

          fetch('/api/mood', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valeur: v })
          })
            .then(function(r) { return r.json(); })
            .then(function() {
              moodBtn.textContent = 'Mood logged';
              moodBtn.style.background = 'var(--teal)';
              setTimeout(function() {
                moodBtn.textContent = 'Log my mood';
                moodBtn.style.background = '';
              }, 2000);
              return fetch('/api/mood').then(function(r) { return r.json(); });
            })
            .then(function(d) {
              var ma = document.getElementById('moodAvg');
              if (ma && d && d.count > 0) {
                ma.textContent = 'Today: ' + d.average.toFixed(1) + '/10 · ' + d.count + ' log' + (d.count > 1 ? 's' : '');
              }
            });
        });
      }
      function renderBody(d) {
        if (!d || !d.entries || !d.entries.length) return;
        var e = d.entries;
        var last = e[0];
        var goals = d.goals || {};

        var bw = document.getElementById('bodyWeight');
        var bf = document.getElementById('bodyFat');
        if (bw && last.poids != null) bw.textContent = last.poids;
        if (bf && last.masse_grasse != null) bf.textContent = last.masse_grasse;

        var tr = document.getElementById('bodyTrend');
        if (!tr) return;

        var cutoff = new Date(last.date);
        cutoff.setDate(cutoff.getDate() - 7);
        var ref = null;
        for (var i = 1; i < e.length; i++) {
          if (e[i].poids == null) continue;
          ref = e[i];
          if (new Date(e[i].date) <= cutoff) break;
        }

        if (!ref || last.poids == null) { tr.innerHTML = ''; return; }

        var diff = last.poids - ref.poids;
        var target = goals.poids_cible != null ? goals.poids_cible : last.poids;
        var cls, arrow;

        if (Math.abs(diff) < 0.5) {
          cls = 'flat';
          arrow = '\u2192';
        } else {
          var towards = (target < last.poids && diff < 0) || (target > last.poids && diff > 0);
          cls = towards ? 'good' : 'bad';
          arrow = diff < 0 ? '\u2198' : '\u2197';
        }

        tr.className = 'body-trend ' + cls;
        tr.innerHTML = '<span class="arrow">' + arrow + '</span><span>' +
          (diff > 0 ? '+' : '') + diff.toFixed(1) + ' kg / 7d</span>';
      }

      fetch('/api/body')
        .then(function(r) { return r.json(); })
        .then(function(d) { renderBody(d); });

      fetch('/api/mood')
        .then(function(r) { return r.json(); })
        .then(function(d) {
          var ma = document.getElementById('moodAvg');
          if (ma && d && d.count > 0) {
            ma.textContent = 'Today: ' + d.average.toFixed(1) + '/10 · ' + d.count + ' log' + (d.count > 1 ? 's' : '');
          }
        });
      var wave = document.getElementById('wave');
      var bars = [];
      if (wave) {
        for (var i = 0; i < 26; i++) {
          var b = document.createElement('i');
          b.style.height = (6 + Math.abs(Math.sin(i*0.7))*16) + 'px';
          wave.appendChild(b);
          bars.push(b);
        }
      }

      var briefAudio = null;
      var briefPlaying = false;
      var playBtn = document.getElementById('playBtn');
      var pbar = document.getElementById('pbar');
      var pbarFill = document.getElementById('pbarFill');
      var pbarKnob = document.getElementById('pbarKnob');
      var pbarDur = document.getElementById('pbarDur');
      var seeking = false;
      var actx = null, analyser = null, freq = null, rafId = null;

      function fmt(s) {
        if (!isFinite(s) || s < 0) s = 0;
        var m = Math.floor(s / 60);
        var r = Math.floor(s % 60);
        return m + ':' + (r < 10 ? '0' + r : r);
      }

      function setProgress(p) {
        if (p < 0) p = 0;
        if (p > 1) p = 1;
        if (pbarFill) pbarFill.style.width = (p * 100) + '%';
        if (pbarKnob) pbarKnob.style.left = (p * 100) + '%';
      }

      function idleWave() {
        for (var i = 0; i < bars.length; i++) {
          bars[i].style.height = (6 + Math.abs(Math.sin(i*0.7))*16) + 'px';
        }
      }

      function drawWave() {
        if (!analyser) return;
        analyser.getByteFrequencyData(freq);
        var step = Math.floor(freq.length / bars.length);
        for (var i = 0; i < bars.length; i++) {
          var v = freq[i * step] / 255;
          bars[i].style.height = (5 + v * 26) + 'px';
        }
        rafId = requestAnimationFrame(drawWave);
      }

      function initAudioGraph() {
        if (actx || !briefAudio) return;
        try {
          var AC = window.AudioContext || window.webkitAudioContext;
          actx = new AC();
          var src = actx.createMediaElementSource(briefAudio);
          analyser = actx.createAnalyser();
          analyser.fftSize = 128;
          freq = new Uint8Array(analyser.frequencyBinCount);
          src.connect(analyser);
          analyser.connect(actx.destination);
        } catch (e) { actx = null; analyser = null; }
      }

      fetch('/api/briefing')
        .then(function(r) { return r.json(); })
        .then(function(bd) {
          var b0 = bd && bd[0];
          if (b0) {
            var he = document.getElementById('heroEvents');
            if (he && b0.events_count > 0) {
              he.innerHTML = '<a href="https://calendar.google.com/calendar/r/day" target="_blank" rel="noopener">\uD83D\uDCC5 ' + b0.events_count + ' event' + (b0.events_count > 1 ? 's' : '') + ' today</a>';              
              he.style.display = 'block';
            }
          }
          if (bd && bd[0] && bd[0].audio_url) {
            briefAudio = new Audio();            
            briefAudio.crossOrigin = 'anonymous';
            briefAudio.preload = 'metadata';
            briefAudio.src = bd[0].audio_url;
            var mParts = (b0.musique || '').split(' - ');
            var mT = document.getElementById('mTitle');
            var mA = document.getElementById('mArtist');
            var mL = document.getElementById('mLink');
            if (mT) mT.textContent = mParts[1] || b0.musique || '--';
            if (mA) mA.textContent = mParts[0] || '';
            if (mL && b0.musique_url) mL.href = b0.musique_url;
            var qT = document.getElementById('qText');
            if (qT) qT.textContent = b0.citation || '';
            var qA = document.getElementById('qAuthor');
            if (qA) qA.textContent = b0.citation_auteur ? '— ' + b0.citation_auteur : '';

            briefAudio.addEventListener('loadedmetadata', function() {
              if (pbarDur) pbarDur.textContent = fmt(briefAudio.duration);
            });
            briefAudio.addEventListener('timeupdate', function() {
              if (seeking || !briefAudio.duration) return;
              setProgress(briefAudio.currentTime / briefAudio.duration);
            });
            briefAudio.addEventListener('ended', function() {
              briefPlaying = false;
              if (playBtn) playBtn.textContent = '\u25B6';
              setProgress(0);
              briefAudio.currentTime = 0;
              if (rafId) cancelAnimationFrame(rafId);
              rafId = null;
              idleWave();
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
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
            idleWave();
          } else {
            initAudioGraph();
            if (actx && actx.state === 'suspended') actx.resume();
            briefAudio.play();
            briefPlaying = true;
            playBtn.textContent = '\u275A\u275A';
            if (analyser && !rafId) drawWave();
          }
        });
      }

      if (pbar) {
        function seekTo(clientX) {
          if (!briefAudio || !briefAudio.duration) return;
          var r = pbar.getBoundingClientRect();
          var p = (clientX - r.left) / r.width;
          if (p < 0) p = 0;
          if (p > 1) p = 1;
          setProgress(p);
          briefAudio.currentTime = p * briefAudio.duration;
        }
        pbar.addEventListener('pointerdown', function(e) {
          seeking = true;
          pbar.setPointerCapture(e.pointerId);
          seekTo(e.clientX);
        });
        pbar.addEventListener('pointermove', function(e) {
          if (seeking) seekTo(e.clientX);
        });
        pbar.addEventListener('pointerup', function(e) {
          seeking = false;
          try { pbar.releasePointerCapture(e.pointerId); } catch (err) {}
        });
        pbar.addEventListener('pointercancel', function() { seeking = false; });
      }
      function drawSky(kind) {
        var sky = document.getElementById('sky');
        if (!sky) return;
        if (kind === 'Clouds' || kind === 'Mist' || kind === 'Haze' || kind === 'Fog') {
          sky.innerHTML = '<div class="cloud c1"></div><div class="cloud c2"></div>';
        } else if (kind === 'Rain' || kind === 'Drizzle' || kind === 'Thunderstorm') {
          var drops = '';
          for (var k = 0; k < 6; k++) {
            drops += '<i class="drop" style="left:' + (14 + k * 9) + 'px; animation-delay:' + (k * 0.18) + 's"></i>';
          }
          sky.innerHTML = '<div class="cloud c1"></div>' + drops;
        } else {
          var rays = '';
          for (var j = 0; j < 12; j++) {
            rays += '<i style="transform: rotate(' + (j*30) + 'deg);"></i>';
          }
          sky.innerHTML = '<div class="sun-rays">' + rays + '</div><div class="sun-core"></div>';
        }
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
          drawSky(w.icon);
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
if (sl) {
            var totMin = Math.round((g.sleep_hours || 0) * 60);
            sl.innerHTML = Math.floor(totMin / 60) + '<span class="u">h</span>' + String(totMin % 60).padStart(2, '0');
}
          if (hr) hr.innerHTML = (g.resting_hr || 0) + '<span class="u">bpm</span>';          if (gd && g.date) gd.textContent = g.date;
        });

      fetch('/api/nutrition')
        .then(function(r) { return r.json(); })
        .then(function(n) {
          if (!n) return;
          var goals = { cal: 2750, pro: 195, car: 285, fat: 92 };
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

      var MUSCLES = ['Chest','Back','Triceps','Biceps','Shoulders','Legs','Cardio','Abs'];
      var sessData = [];
      var modalDate = null;
      var picked = [];
      var editingId = null;

      function isoDay(offset) {
        var t = new Date();
        var dow = t.getDay();
        var back = (dow === 0 ? 6 : dow - 1);
        t.setDate(t.getDate() - back + offset);
        return t.getFullYear() + '-' + String(t.getMonth()+1).padStart(2,'0') + '-' + String(t.getDate()).padStart(2,'0');
      }      

      function renderWeek() {
        var row = document.getElementById('weekRow');
        if (!row) return;
        var labs = ['M','T','W','T','F','S','S'];
        var html = '';
        var count = 0;
        var d = new Date();
        var todayIso = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
        for (var i = 0; i <= 6; i++) {
          var iso = isoDay(i);
          var hit = sessData.filter(function(s) { return s.date === iso; });
          var done = hit.length > 0;
          if (done) count++;
          var mus = done ? hit.map(function(s) { return s.muscles || ''; }).join(', ') : '';
          html += '<div class="day-col">' +
            '<div class="day-lab">' + labs[i] + '</div>' +
            '<div class="day-box' + (done ? ' done' : '') + (iso === todayIso ? ' today' : '') + '" data-date="' + iso + '">' +
              (done ? '&#x2714;' : '&#x2b;') +
            '</div>' +
            '<div class="day-note">' + mus + '</div>' +
          '</div>';
        }
        row.innerHTML = html;
        var wc = document.getElementById('weekCount');
        if (wc) wc.textContent = count + ' / 5 sessions';
        row.querySelectorAll('.day-box').forEach(function(b) {
          b.addEventListener('click', function() { openModal(b.getAttribute('data-date')); });
        });
      }
      function openModal(iso) {
        modalDate = iso;
        picked = [];
        editingId = null;

        var existing = sessData.filter(function(s) { return s.date === iso; })[0];
        if (existing) {
          editingId = existing.id;
          picked = (existing.muscles || '').split(',').map(function(m) { return m.trim(); }).filter(Boolean);
        }

        var mr = document.getElementById('musRow');
        if (mr) {
          mr.innerHTML = MUSCLES.map(function(m) {
            var on = picked.indexOf(m.toLowerCase()) !== -1 || picked.indexOf(m) !== -1;
            return '<div class="mus' + (on ? ' on' : '') + '" data-m="' + m + '">' + m + '</div>';
          }).join('');
          mr.querySelectorAll('.mus').forEach(function(el) {
            el.addEventListener('click', function() {
              var m = el.getAttribute('data-m');
              if (picked.indexOf(m) === -1) { picked.push(m); el.classList.add('on'); }
              else { picked.splice(picked.indexOf(m), 1); el.classList.remove('on'); }
            });
          });
        }

        var md = document.getElementById('modalDay');
        if (md) md.textContent = iso;
        var na = document.getElementById('sessNote');
        if (na) na.value = existing ? (existing.description || '') : '';

        var del = document.getElementById('sessDelete');
        if (del) del.style.display = editingId ? 'block' : 'none';

        var bg = document.getElementById('sessModal');
        if (bg) bg.classList.add('open');
      }

      var sessCancel = document.getElementById('sessCancel');
      if (sessCancel) {
        sessCancel.addEventListener('click', function() {
          document.getElementById('sessModal').classList.remove('open');
        });
      }

      var sessSave = document.getElementById('sessSave');
      if (sessSave) {
        sessSave.addEventListener('click', function() {
          if (picked.length === 0) return;
          var note = document.getElementById('sessNote').value;
          sessSave.textContent = 'Saving...';

          var payload = { date: modalDate, muscles: picked.join(', ').toLowerCase(), description: note };
          if (editingId) payload.id = editingId;

          fetch('/api/sessions/submit', {
            method: editingId ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
            .then(function(r) { return r.json(); })
            .then(function() {
              sessSave.textContent = 'Save';
              document.getElementById('sessModal').classList.remove('open');
              return fetch('/api/sessions').then(function(r) { return r.json(); });
            })
            .then(function(d) { sessData = d || []; renderWeek(); });
        });
      }

      var sessDelete = document.getElementById('sessDelete');
      if (sessDelete) {
        sessDelete.addEventListener('click', function() {
          if (!editingId) return;
          sessDelete.textContent = 'Deleting...';

          fetch('/api/sessions/submit', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingId })
          })
            .then(function(r) { return r.json(); })
            .then(function() {
              sessDelete.textContent = 'Delete';
              document.getElementById('sessModal').classList.remove('open');
              return fetch('/api/sessions').then(function(r) { return r.json(); });
            })
            .then(function(d) { sessData = d || []; renderWeek(); });
        });
      }

      fetch('/api/sessions')
        .then(function(r) { return r.json(); })
        .then(function(d) { sessData = d || []; renderWeek(); });

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
    <FabChat />
    </>
  );
}