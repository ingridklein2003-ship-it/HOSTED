import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om os — HOSTED",
  description: "Mød holdet bag HOSTED.",
};

export default function OmOs() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>HOSTED</Link>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link href="/om-os" style={{ color: "white", textDecoration: "none", fontSize: 15, fontWeight: 600 }}>Om os</Link>
          <Link href="/venteliste" style={{ background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", color: "white", padding: "8px 20px", borderRadius: 20, textDecoration: "none", fontSize: 15, fontWeight: 600 }}>Tilmeld dig</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "80px 24px" }}>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800, letterSpacing: -1.5, marginBottom: 24 }}>Vi er HOSTED</h1>
        <p style={{ fontSize: 20, color: "var(--muted)", lineHeight: 1.7, marginBottom: 60 }}>
          HOSTED startede som en idé og blev til en app — designet, bygget og bragt til live fra bunden af én person med en vision om at gøre fester bedre.
        </p>

        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, marginBottom: 32 }}>Holdet</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 80 }}>
          {[
            {
              name: "Ingrid Klein",
              role: "Grundlægger & CEO",
              desc: "Ingrid grundlagde HOSTED og har stået for alt — fra den første idé til design, udvikling og lancering. Hun driver KleinDesign og har bygget hele appen fra bunden.",
              emoji: "👩‍🎨",
              badge: "Grundlægger"
            },
            {
              name: "Mikkel Schrøder",
              role: "Medejer & Udvikler",
              desc: "Mikkel kom ind som medejer og udvikler. Han bidrager med teknisk ekspertise og er med til at tage HOSTED til næste niveau.",
              emoji: "👨‍💻",
              badge: "Medejer"
            }
          ].map((person) => (
            <div key={person.name} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{person.emoji}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700 }}>{person.name}</h3>
                <span style={{ background: "rgba(255,59,92,0.15)", border: "1px solid rgba(255,59,92,0.3)", color: "#ff3b5c", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: 0.5 }}>{person.badge}</span>
              </div>
              <p style={{ color: "#ff3b5c", fontSize: 13, fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>{person.role}</p>
              <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6 }}>{person.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>Historien</h2>
        <div style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.8 }}>
          <p style={{ marginBottom: 20 }}>
            HOSTED blev skabt af Ingrid Klein — grafisk designer og iværksætter — som en løsning på et problem hun kendte alt for godt: fester der manglede struktur, gæster der ikke vidste hvad der skete, og hosts der brugte halvdelen af aftenen på at svare på de samme spørgsmål.
          </p>
          <p style={{ marginBottom: 20 }}>
            Fra den første skitse til en kørende app med kortspil, fotoalbum, Impostor og meget mere — alt er bygget med ét mål: at gøre festen bedre for alle.
          </p>
          <p>
            HOSTED er et produkt af KleinDesign og er på vej til App Store.
          </p>
        </div>

        <div style={{ marginTop: 60, textAlign: "center" }}>
          <Link href="/venteliste" style={{ background: "linear-gradient(135deg, #ff3b5c, #ff6b35)", color: "white", padding: "16px 36px", borderRadius: 28, textDecoration: "none", fontSize: 17, fontWeight: 700, display: "inline-block" }}>
            Kom på ventelisten →
          </Link>
        </div>
      </div>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px", textAlign: "center", color: "var(--muted)", fontSize: 14, marginTop: 40 }}>
        <p>© 2026 HOSTED · Et produkt af KleinDesign</p>
      </footer>
    </div>
  );
}
