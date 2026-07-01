"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";

const SUPABASE_URL = "https://mfebfftytmjhextklsgj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZWJmZnR5dG1qaGV4dGtsc2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTM5NzQsImV4cCI6MjA5NzY4OTk3NH0.wN6w3Ky-D1tPxWg47adOsWKdyW_7xxiwdFSOMrd4kS8";

const headers = {
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

type Party = {
  id: string;
  name: string;
  emoji: string;
  host_name: string;
  code: string;
};

export default function JoinPage({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = use(params);
  const [screen, setScreen] = useState<"loading" | "enter-code" | "party-found" | "joined" | "error">("loading");
  const [codeInput, setCodeInput] = useState(kode?.toUpperCase() || "");
  const [party, setParty] = useState<Party | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinedName, setJoinedName] = useState("");

  useEffect(() => {
    if (kode && kode !== "join") {
      lookupCode(kode.toUpperCase());
    } else {
      setScreen("enter-code");
    }
  }, [kode]);

  async function lookupCode(code: string) {
    setError("");
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/parties?code=eq.${code}&select=id,name,emoji,host_name,code`,
        { headers }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setParty(data[0]);
        setScreen("party-found");
      } else {
        setError("Koden blev ikke fundet. Tjek igen.");
        setScreen("enter-code");
      }
    } catch {
      setError("Noget gik galt. Prøv igen.");
      setScreen("enter-code");
    }
  }

  async function joinParty() {
    if (!name.trim() || !party) return;
    setJoining(true);
    try {
      const guestId = crypto.randomUUID();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/guests`, {
        method: "POST",
        headers: { ...headers, "Prefer": "return=representation" },
        body: JSON.stringify({
          id: guestId,
          party_id: party.id,
          name: name.trim(),
          joined_at: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setJoinedName(name.trim());
        setScreen("joined");
      } else {
        setError("Kunne ikke joine festen. Prøv igen.");
      }
    } catch {
      setError("Noget gik galt. Prøv igen.");
    }
    setJoining(false);
  }

  const cardStyle = {
    background: "var(--card)", border: "1px solid var(--border)",
    borderRadius: 20, padding: 28
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/" style={{
          fontWeight: 800, fontSize: 22, letterSpacing: -0.5,
          background: "linear-gradient(135deg, #ff3b5c, #ff6b35)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          textDecoration: "none"
        }}>HOSTED</Link>
        <div style={{
          width: 8, height: 8, background: "#ff3b5c", borderRadius: "50%",
          animation: "pulse 2s infinite"
        }} />
      </div>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "8px 20px 60px" }}>

        {/* Enter code */}
        {screen === "enter-code" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 24 }}>
            <div style={{ textAlign: "center", paddingTop: 20 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <p style={{ color: "var(--muted)", fontSize: 16 }}>Indtast din party-kode for at joine</p>
            </div>
            <div>
              <label style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: 8 }}>Party-kode</label>
              <input
                type="text"
                placeholder="ABCD12"
                maxLength={6}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                style={{
                  width: "100%", background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: "14px 18px", fontSize: 20,
                  color: "var(--text)", outline: "none", letterSpacing: 4, textAlign: "center", fontWeight: 700
                }}
              />
            </div>
            {error && <p style={{ color: "#ff3b5c", fontSize: 14, textAlign: "center" }}>{error}</p>}
            <button onClick={() => lookupCode(codeInput)} style={{
              background: "linear-gradient(135deg, #ff3b5c, #ff6b35)",
              color: "white", padding: "16px", borderRadius: 16, border: "none",
              fontSize: 17, fontWeight: 700, cursor: "pointer", width: "100%"
            }}>
              Find party →
            </button>
          </div>
        )}

        {/* Party found */}
        {screen === "party-found" && party && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 16 }}>
            <div style={{ ...cardStyle, textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>{party.emoji || "🎊"}</div>
              <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{party.name}</h2>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Hosted af {party.host_name}</p>
              <div style={{
                display: "inline-block", background: "rgba(255,59,92,0.15)",
                border: "1px solid rgba(255,59,92,0.3)", color: "#ff3b5c",
                fontSize: 13, fontWeight: 600, padding: "4px 12px",
                borderRadius: 20, marginTop: 12, letterSpacing: 2
              }}>{party.code}</div>
            </div>

            <div>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Hvad skal du hedde?</p>
              <label style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: 8 }}>Dit navn</label>
              <input
                type="text"
                placeholder="Ingrid"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%", background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: "14px 18px", fontSize: 17,
                  color: "var(--text)", outline: "none"
                }}
              />
            </div>

            {error && <p style={{ color: "#ff3b5c", fontSize: 14, textAlign: "center" }}>{error}</p>}

            <button onClick={joinParty} disabled={joining || !name.trim()} style={{
              background: joining || !name.trim() ? "var(--border)" : "linear-gradient(135deg, #ff3b5c, #ff6b35)",
              color: "white", padding: "16px", borderRadius: 16, border: "none",
              fontSize: 17, fontWeight: 700, cursor: joining ? "wait" : "pointer", width: "100%"
            }}>
              {joining ? "Joiner..." : "Join festen 🎉"}
            </button>
          </div>
        )}

        {/* Joined */}
        {screen === "joined" && party && (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 72, marginBottom: 24 }}>🎊</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12 }}>Velkommen, {joinedName}!</h2>
            <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.6 }}>
              Du er nu med til <strong style={{ color: "var(--text)" }}>{party.name}</strong>.<br />
              Følg med på skærmen til spillet.
            </p>
          </div>
        )}

        {screen === "loading" && (
          <div style={{ textAlign: "center", paddingTop: 80, color: "var(--muted)" }}>Henter fest...</div>
        )}
      </div>
    </div>
  );
}
