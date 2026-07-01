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

const PACKAGES = [
  { emoji: "💍", name: "Bryllup", desc: "Hyggelige samtale- og legkort til bryllupsreception, jungfretur og brudepar-aftener.", gradient: "linear-gradient(135deg, #c9a96e, #f5e6c8)", color: "#c9a96e", tag: "Familie & par" },
  { emoji: "🎓", name: "Studenterbolle", desc: "Fejr dimissionen med boldene, studentervogn-stemningen og hele klassen samlet.", gradient: "linear-gradient(135deg, #ff3b5c, #ff6b35)", color: "#ff3b5c", tag: "Klassiker" },
  { emoji: "🌿", name: "Havefest", desc: "Perfekt til solskinsdage i haven. Kortene passer til alle aldre og stemninger.", gradient: "linear-gradient(135deg, #30d158, #34c759)", color: "#30d158", tag: "Sommer" },
  { emoji: "🎄", name: "Julefest", desc: "Julegækkeri, hvem kender hvem-spørgsmål og kortspil til hele familien.", gradient: "linear-gradient(135deg, #ff6b35, #ff3b5c)", color: "#ff6b35", tag: "Højtid" },
  { emoji: "🏢", name: "Firmafest", desc: "Hold stemningen professionel men sjov. Icebreakers og teamspil til kollegaer.", gradient: "linear-gradient(135deg, #007aff, #5856d6)", color: "#007aff", tag: "Business" },
  { emoji: "🎭", name: "Temafest", desc: "Kortpakker der passer til dit tema — fra 80'erne til galaksen.", gradient: "linear-gradient(135deg, #bf5af2, #ff375f)", color: "#bf5af2", tag: "Kreativ" },
  { emoji: "🏡", name: "Familieaften", desc: "Samtale- og catch-up kort til hyggeaften med familien. Ingen druk, bare fællesskab.", gradient: "linear-gradient(135deg, #ff9f0a, #ff6b35)", color: "#ff9f0a", tag: "Alkoholfri" },
  { emoji: "🍺", name: "Fredagsbar", desc: "Klassiske drukspil og udfordringer der skruer festen op på fredagsbar.", gradient: "linear-gradient(135deg, #ffd60a, #ff9f0a)", color: "#ffd60a", tag: "Fest" },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (code) return <JoinFlow code={code.toUpperCase()} />;

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", overflowX: "hidden" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(16px)", zIndex: 100 }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HOSTED</div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/om-os" style={{ color: "var(--muted)", textDecoration: "none", fontSize: 15 }}>Om os</Link>
          <Link href="/venteliste" style={{ background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", color: "white", padding: "8px 20px", borderRadius: 20, textDecoration: "none", fontSize: 15, fontWeight: 600 }}>Tilmeld dig</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "110px 24px 80px", maxWidth: 740, margin: "0 auto", position: "relative" }}>
        <div style={{ position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "radial-gradient(ellipse, rgba(255,59,92,0.15) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: "rgba(255,59,92,0.1)", border: "1px solid rgba(255,59,92,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#ff3b5c", fontWeight: 600, marginBottom: 28, letterSpacing: 0.5 }}>
            🎉 Kommer snart til App Store
          </div>
          <h1 style={{ fontSize: "clamp(44px, 9vw, 80px)", fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.02, marginBottom: 24 }}>
            Fest-appen<br />
            <span style={{ background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>der samler alle</span>
          </h1>
          <p style={{ fontSize: 20, color: "var(--muted)", lineHeight: 1.65, maxWidth: 520, margin: "0 auto 52px" }}>
            Fra bryllup til fredagsbar — opret din fest, invitér gæster med ét link og spil kortspil, Impostor og meget mere. Ingen download for gæster.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/venteliste" style={{ background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", color: "white", padding: "16px 36px", borderRadius: 28, textDecoration: "none", fontSize: 17, fontWeight: 700, boxShadow: "0 8px 32px rgba(255,59,92,0.35)" }}>Kom på ventelisten →</Link>
            <Link href="/om-os" style={{ border: "1px solid var(--border)", color: "var(--text)", padding: "16px 36px", borderRadius: 28, textDecoration: "none", fontSize: 17, fontWeight: 600 }}>Læs mere</Link>
          </div>
        </div>
      </section>

      {/* Party Packages */}
      <section style={{ padding: "80px 0 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <span style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: 16, padding: "5px 14px", fontSize: 12, color: "#ff6b35", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Fest-pakker</span>
          </div>
          <h2 style={{ textAlign: "center", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, letterSpacing: -1.2, marginBottom: 14 }}>En pakke til enhver fest</h2>
          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 18, marginBottom: 56, maxWidth: 500, margin: "0 auto 56px" }}>
            Vælg den pakke der passer til jeres aften — eller mix dem frit.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          {PACKAGES.map((pkg) => (
            <div key={pkg.name} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24, padding: 28, position: "relative", overflow: "hidden", transition: "transform 0.2s" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, background: pkg.gradient, opacity: 0.12, borderRadius: "50%", pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ fontSize: 44 }}>{pkg.emoji}</div>
                <span style={{ background: `rgba(${pkg.color === "#30d158" ? "48,209,88" : pkg.color === "#007aff" ? "0,122,255" : pkg.color === "#bf5af2" ? "191,90,242" : pkg.color === "#ff9f0a" ? "255,159,10" : pkg.color === "#ffd60a" ? "255,214,10" : pkg.color === "#c9a96e" ? "201,169,110" : "255,59,92"},0.15)`, border: `1px solid ${pkg.color}40`, borderRadius: 12, padding: "3px 10px", fontSize: 11, color: pkg.color, fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap" as const }}>{pkg.tag}</span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, letterSpacing: -0.3 }}>{pkg.name}</h3>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{pkg.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ikke kun druk */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ background: "linear-gradient(135deg, rgba(255,59,92,0.08), rgba(255,107,53,0.05))", border: "1px solid rgba(255,59,92,0.15)", borderRadius: 32, padding: "56px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "center" }}>
          <div>
            <span style={{ background: "rgba(255,59,92,0.1)", border: "1px solid rgba(255,59,92,0.3)", borderRadius: 16, padding: "5px 14px", fontSize: 12, color: "#ff3b5c", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" as const, display: "inline-block", marginBottom: 20 }}>Vigtigt at vide</span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, letterSpacing: -1, lineHeight: 1.1, marginBottom: 20 }}>HOSTED er ikke<br />kun et drukspil</h2>
            <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.7 }}>
              Vi har pakker til alle — fra vilde fredagsbarer til rolige familieaftener. Samtale-kort, catch-up spørgsmål og aktiviteter der fungerer uden en eneste slurk.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
            {[
              { icon: "🗣️", title: "Samtalekort", desc: "Dybe og sjove spørgsmål der faktisk starter samtaler." },
              { icon: "🤝", title: "Catch-up kort", desc: "Perfekt til familieaften eller venner man ikke har set længe." },
              { icon: "🎯", title: "Aktiviteter for alle", desc: "Spil og lege der virker uanset om man drikker eller ej." },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "18px 20px" }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Non-drinker feature */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 32, padding: "56px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 60, marginBottom: 24 }}>🚫🍺</div>
            <span style={{ background: "rgba(48,209,88,0.1)", border: "1px solid rgba(48,209,88,0.3)", borderRadius: 16, padding: "5px 14px", fontSize: 12, color: "#30d158", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" as const, display: "inline-block", marginBottom: 20 }}>Inkluderende</span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, letterSpacing: -1, lineHeight: 1.1, marginBottom: 20 }}>Ikke-drikkere<br />er med på fuld tid</h2>
            <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.7 }}>
              Hvert kortspil har en individuel toggle per spiller. Vælger du &quot;drikker ikke&quot;, modtager du ingen slurke — men du kan stadig give dem ud til andre. Du er 100% med i spillet.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
            {[
              { step: "1", title: "Vælg dine spillere", desc: "Tilføj alle til spillet fra din telefon.", color: "#ff3b5c" },
              { step: "2", title: "Sæt drikke-toggle", desc: "Hver person vælger selv om de drikker. Ingen pres.", color: "#ff6b35" },
              { step: "3", title: "Spil som normalt", desc: "Kortene giver kun slurke til dem der vil have dem — men ikke-drikkere kan stadig give dem til andre.", color: "#30d158" },
            ].map((step, i) => (
              <div key={step.step} style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "24px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${step.color}20`, border: `2px solid ${step.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: step.color, flexShrink: 0 }}>{step.step}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{step.title}</div>
                  <div style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.55 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, letterSpacing: -1.2, marginBottom: 14 }}>Alt hvad en fest behøver</h2>
          <p style={{ color: "var(--muted)", fontSize: 18 }}>Ingen downloads for gæster. Bare del linket.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[
            { emoji: "🎉", title: "Opret fest på sekunder", desc: "Navn, emoji og QR-kode. Gæster joiner direkte i browseren." },
            { emoji: "🃏", title: "Kortspil & pakker", desc: "Drik-spil, samtalekort, udfordringer — vælg hvad der passer." },
            { emoji: "🕵️", title: "Impostor", desc: "Find spionen i gruppen. Perfekt til store selskaber." },
            { emoji: "🏆", title: "Turnering", desc: "Bracket-turnering med live opdatering for alle." },
            { emoji: "📸", title: "Fotoalbum", desc: "Gæster og host uploader billeder — alt samlet ét sted." },
            { emoji: "💬", title: "Fest-chat", desc: "Beskeder til alle gæster. Ingen gruppebesked-kaos." },
          ].map((f) => (
            <div key={f.title} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 26 }}>
              <div style={{ fontSize: 34, marginBottom: 14 }}>{f.emoji}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signup */}
      <section style={{ maxWidth: 580, margin: "0 auto", padding: "60px 24px 120px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, letterSpacing: -1.2, marginBottom: 14 }}>Vær den første til at vide det</h2>
        <p style={{ color: "var(--muted)", fontSize: 18, marginBottom: 40 }}>Skriv dig op og få besked når HOSTED rammer App Store.</p>
        {submitted ? (
          <div style={{ background: "rgba(48,209,88,0.1)", border: "1px solid rgba(48,209,88,0.3)", borderRadius: 20, padding: "28px 32px", color: "#30d158", fontWeight: 700, fontSize: 20 }}>
            ✓ Du er på listen!<br /><span style={{ fontWeight: 400, fontSize: 16 }}>Vi skriver til dig når appen er klar.</span>
          </div>
        ) : (
          <form onSubmit={async (e) => {
            e.preventDefault();
            await fetch("https://mfebfftytmjhextklsgj.supabase.co/rest/v1/waitlist", {
              method: "POST",
              headers: {
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZWJmZnR5dG1qaGV4dGtsc2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTM5NzQsImV4cCI6MjA5NzY4OTk3NH0.wN6w3Ky-D1tPxWg47adOsWKdyW_7xxiwdFSOMrd4kS8",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZWJmZnR5dG1qaGV4dGtsc2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTM5NzQsImV4cCI6MjA5NzY4OTk3NH0.wN6w3Ky-D1tPxWg47adOsWKdyW_7xxiwdFSOMrd4kS8",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
              },
              body: JSON.stringify({ email, source: "forside" })
            }).catch(() => {});
            setSubmitted(true);
          }} style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <input type="email" required placeholder="din@email.dk" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 20px", fontSize: 16, color: "var(--text)", outline: "none", flex: 1, minWidth: 220 }} />
            <button type="submit" style={{ background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", color: "white", padding: "14px 28px", borderRadius: 14, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Tilmeld →</button>
          </form>
        )}
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 20 }}>Ingen spam. Kun én mail når vi er klar.</p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 10, background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>HOSTED</div>
        <p>Et produkt af KleinDesign · <Link href="/om-os" style={{ color: "var(--muted)" }}>Om os</Link> · <a href="mailto:hosted.mobileapp@gmail.com" style={{ color: "var(--muted)" }}>Kontakt</a></p>
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
