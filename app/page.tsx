"use client";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const SUPABASE_URL = "https://mfebfftytmjhextklsgj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZWJmZnR5dG1qaGV4dGtsc2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTM5NzQsImV4cCI6MjA5NzY4OTk3NH0.wN6w3Ky-D1tPxWg47adOsWKdyW_7xxiwdFSOMrd4kS8";
const headers = {
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

type Party = { id: string; name: string; emoji: string; host_name: string; code: string };

function JoinFlow({ code }: { code: string }) {
  const [screen, setScreen] = useState<"loading" | "found" | "joined" | "error">("loading");
  const [party, setParty] = useState<Party | null>(null);
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinedName, setJoinedName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { lookupCode(code); }, [code]);

  async function lookupCode(c: string) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/parties?code=eq.${c}&select=id,name,emoji,host_name,code`, { headers });
      const data = await res.json();
      if (data?.length > 0) { setParty(data[0]); setScreen("found"); }
      else { setError("Koden blev ikke fundet."); setScreen("error"); }
    } catch { setError("Noget gik galt."); setScreen("error"); }
  }

  async function joinParty() {
    if (!name.trim() || !party) return;
    setJoining(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/guests`, {
        method: "POST",
        headers: { ...headers, "Prefer": "return=representation" },
        body: JSON.stringify({ id: crypto.randomUUID(), party_id: party.id, name: name.trim(), joined_at: new Date().toISOString() }),
      });
      if (res.ok) { setJoinedName(name.trim()); setScreen("joined"); }
      else setError("Kunne ikke joine. Prøv igen.");
    } catch { setError("Noget gik galt."); }
    setJoining(false);
  }

  if (screen === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
      Henter fest...
    </div>
  );

  if (screen === "error") return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
      <div style={{ fontSize: 48 }}>😬</div>
      <p style={{ color: "#ff3b5c", fontWeight: 600 }}>{error}</p>
      <Link href="/" style={{ color: "var(--muted)", fontSize: 14 }}>Tilbage til forsiden</Link>
    </div>
  );

  if (screen === "joined" && party) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
      <div style={{ fontSize: 72, marginBottom: 24 }}>🎊</div>
      <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12 }}>Velkommen, {joinedName}!</h2>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.6 }}>Du er nu med til <strong style={{ color: "var(--text)" }}>{party.name}</strong>.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "60px 20px" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 22, background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 24 }}>HOSTED</div>
      </div>
      {party && (
        <>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 28, textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{party.emoji || "🎊"}</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>{party.name}</h2>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>Hosted af {party.host_name}</p>
            <div style={{ display: "inline-block", background: "rgba(255,59,92,0.15)", border: "1px solid rgba(255,59,92,0.3)", color: "#ff3b5c", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 20, marginTop: 12, letterSpacing: 2 }}>{party.code}</div>
          </div>
          <p style={{ fontWeight: 700, marginBottom: 12 }}>Hvad skal du hedde?</p>
          <input type="text" placeholder="Ingrid" value={name} onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 18px", fontSize: 17, color: "var(--text)", outline: "none", marginBottom: 16 }} />
          {error && <p style={{ color: "#ff3b5c", fontSize: 14, marginBottom: 12 }}>{error}</p>}
          <button onClick={joinParty} disabled={joining || !name.trim()} style={{
            width: "100%", background: !name.trim() ? "var(--border)" : "linear-gradient(135deg, #ff3b5c, #ff6b35)",
            color: "white", padding: 16, borderRadius: 16, border: "none", fontSize: 17, fontWeight: 700, cursor: "pointer"
          }}>
            {joining ? "Joiner..." : "Join festen 🎉"}
          </button>
        </>
      )}
    </div>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (code) return <JoinFlow code={code.toUpperCase()} />;

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HOSTED</div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/om-os" style={{ color: "var(--muted)", textDecoration: "none", fontSize: 15 }}>Om os</Link>
          <Link href="/venteliste" style={{ background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", color: "white", padding: "8px 20px", borderRadius: 20, textDecoration: "none", fontSize: 15, fontWeight: 600 }}>Tilmeld dig</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "100px 24px 80px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "rgba(255,59,92,0.1)", border: "1px solid rgba(255,59,92,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#ff3b5c", fontWeight: 600, marginBottom: 28, letterSpacing: 0.5 }}>
          🎉 Kommer snart til App Store
        </div>
        <h1 style={{ fontSize: "clamp(42px, 8vw, 72px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, marginBottom: 24 }}>
          Festen starter<br />
          <span style={{ background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>med HOSTED</span>
        </h1>
        <p style={{ fontSize: 20, color: "var(--muted)", lineHeight: 1.6, maxWidth: 500, margin: "0 auto 48px" }}>
          Opret din fest, invitér gæster via QR-kode, og spil kortspil, Impostor og turnering — alt samlet på én app.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/venteliste" style={{ background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", color: "white", padding: "16px 36px", borderRadius: 28, textDecoration: "none", fontSize: 17, fontWeight: 700 }}>Kom på ventelisten →</Link>
          <Link href="/om-os" style={{ border: "1px solid var(--border)", color: "var(--text)", padding: "16px 36px", borderRadius: 28, textDecoration: "none", fontSize: 17, fontWeight: 600 }}>Læs mere</Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>Alt til en god fest</h2>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 18, marginBottom: 60 }}>Ingen downloads for gæster. Bare scan og join.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { emoji: "🎉", title: "Opret fest på sekunder", desc: "Navn, emoji og QR-kode — gæster joiner fra deres browser. Ingen download nødvendig." },
            { emoji: "🃏", title: "Kortspil med 6 pakker", desc: "Fra klassikere til vilde varianter. Non-drinker toggle til alle spillere." },
            { emoji: "🕵️", title: "Impostor", desc: "Find spionen i gruppen. Perfekt til store selskaber." },
            { emoji: "🏆", title: "Turnering", desc: "Bracket-turnering med automatisk opdatering. Alle følger med live." },
            { emoji: "📸", title: "Fotoalbum", desc: "Host og gæster uploader billeder fra festen — direkte fra browseren." },
            { emoji: "💬", title: "Chat i festen", desc: "Beskeder til alle gæster. Hold styringen uden gruppebesked-kaos." },
          ].map((f) => (
            <div key={f.title} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.emoji}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signup */}
      <section style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px 120px", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>Vær den første til at vide det</h2>
        <p style={{ color: "var(--muted)", fontSize: 18, marginBottom: 40 }}>Skriv dig op og få besked når HOSTED rammer App Store.</p>
        {submitted ? (
          <div style={{ background: "rgba(48,209,88,0.1)", border: "1px solid rgba(48,209,88,0.3)", borderRadius: 16, padding: "24px 32px", color: "#30d158", fontWeight: 600, fontSize: 18 }}>
            ✓ Du er på listen! Vi skriver til dig.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <input type="email" required placeholder="din@email.dk" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 20px", fontSize: 16, color: "var(--text)", outline: "none", flex: 1, minWidth: 220 }} />
            <button type="submit" style={{ background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", color: "white", padding: "14px 28px", borderRadius: 14, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Tilmeld →</button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>HOSTED</div>
        <p>Et produkt af KleinDesign · <Link href="/om-os" style={{ color: "var(--muted)" }}>Om os</Link> · <a href="mailto:hej@hosted.app" style={{ color: "var(--muted)" }}>Kontakt</a></p>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <HomeContent />
    </Suspense>
  );
}
