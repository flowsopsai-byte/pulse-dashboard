"use client";

export default function FabChat() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .fab-chat{
          position:fixed;
          right:20px;
          bottom:calc(20px + env(safe-area-inset-bottom));
          z-index:900;
          height:52px;
          padding:0 20px 0 17px;
          border-radius:26px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:9px;
          background:linear-gradient(145deg,#2E9E9E,#1B3A6B);
          color:#fff;
          font:600 14.5px/1 system-ui,-apple-system,'Segoe UI',sans-serif;
          letter-spacing:.2px;
          white-space:nowrap;
          text-decoration:none;
          box-shadow:0 6px 20px rgba(27,58,107,.28), 0 2px 6px rgba(27,58,107,.16);
          transition:transform .18s ease, box-shadow .18s ease;
          -webkit-tap-highlight-color:transparent;
        }
        .fab-chat svg{ width:20px; height:20px; flex:0 0 auto; }
        .fab-chat:hover{
          transform:translateY(-2px);
          box-shadow:0 10px 26px rgba(27,58,107,.34), 0 3px 8px rgba(27,58,107,.2);
        }
        .fab-chat:active{ transform:translateY(0) scale(.97); }

        .fab-checkin{
          position:fixed;
          right:20px;
          bottom:calc(84px + env(safe-area-inset-bottom));
          z-index:900;
          width:52px;
          height:52px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(145deg,#D4A843,#b8862a);
          color:#fff;
          border:none;
          text-decoration:none;
          box-shadow:0 5px 18px rgba(184,134,42,.32), 0 2px 6px rgba(184,134,42,.2);
          transition:transform .18s ease, box-shadow .18s ease;
          -webkit-tap-highlight-color:transparent;
        }
        .fab-checkin svg{ width:22px; height:22px; }
        .fab-checkin:hover{
          transform:translateY(-2px);
          box-shadow:0 9px 24px rgba(184,134,42,.4), 0 3px 8px rgba(184,134,42,.26);
        }
        .fab-checkin:active{ transform:translateY(0) scale(.96); }

        @media (max-width:520px){
          .fab-chat{ right:16px; bottom:calc(16px + env(safe-area-inset-bottom)); height:50px; padding:0 18px 0 15px; }
          .fab-checkin{ right:16px; bottom:calc(78px + env(safe-area-inset-bottom)); width:50px; height:50px; }
        }
      `}} />

      <a href="/checkin" className="fab-checkin" aria-label="Evening check-in">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
        </svg>
      </a>

      <a href="/coach" className="fab-chat" aria-label="Ask your coach">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        <span>Ask coach</span>
      </a>
    </>
  );
}