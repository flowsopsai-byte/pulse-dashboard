"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PinPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  function handleSubmit() {
    fetch("/api/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.ok) {
          router.push("/");
        } else {
          setError(true);
        }
      });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#dde8f4" }}>
      <div style={{ background: "#f3f7fc", borderRadius: "18px", padding: "40px", textAlign: "center", boxShadow: "0 8px 30px rgba(27,58,107,0.15)" }}>
        <div style={{ fontSize: "32px", fontWeight: 800, color: "#1B3A6B", marginBottom: "8px" }}>Pulse.</div>
        <div style={{ fontSize: "13px", color: "#8a97ab", marginBottom: "32px", textTransform: "uppercase", letterSpacing: "1px" }}>AI Life Coach</div>
        <input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={function(e) { setPin(e.target.value); }}
          onKeyDown={function(e) { if (e.key === "Enter") handleSubmit(); }}
          style={{ width: "200px", padding: "14px", borderRadius: "12px", border: error ? "2px solid #d9776b" : "2px solid #e6ebf2", fontSize: "18px", textAlign: "center", outline: "none", letterSpacing: "8px", pointerEvents: "auto", color: "#1B3A6B" }}
        />
        {error && <div style={{ color: "#d9776b", fontSize: "13px", marginTop: "8px" }}>Incorrect PIN</div>}
        <button
          onClick={handleSubmit}
          style={{ display: "block", width: "200px", margin: "16px auto 0", padding: "14px", background: "#1B3A6B", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
        >
          Enter
        </button>
      </div>
    </div>
  );
}