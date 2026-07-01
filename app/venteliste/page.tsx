"use client";
import Link from "next/link";
import { useState } from "react";

export default function Venteliste() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 32px", borderBottom: "1px solid var(--border)"
      }}>
        <Link href="/" style={{
          fontSize: 22, fontWeight: 800, letterSpacing: -0.5,
          background: "linear-gradient(135deg, #ff3b5c, #ff6b35)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          textDecoration: "none"
        }}>HOSTED</Link>
      </nav>

      <div style={{
        maxWidth: 520, margin: "0 auto", padding: "100px 24px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
        <h1 style={{
          fontSize: 42, fontWeight: 800, letterSpacing: -1.5,
          marginBottom: 16
        }}>Kom på ventelisten</h1>
        <p style={{ color: "var(--muted)", fontSize: 18, lineHeight: 1.6, marginBottom: 48 }}>
          HOSTED rammer App Store snart. Skriv dig op og vær den første til at vide det — og få tidlig adgang.
        </p>

        {submitted ? (
          <div style={{
            background: "rgba(48,209,88,0.1)", border: "1px solid rgba(48,209,88,0.3)",
            borderRadius: 20, padding: "32px", color: "#30d158", fontWeight: 700, fontSize: 20
          }}>
            ✓ Du er på listen!<br />
            <span style={{ fontWeight: 400, fontSize: 16, opacity: 0.8 }}>Vi skriver til dig når appen er klar.</span>
          </div>
        ) : (
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="email"
              required
              placeholder="din@email.dk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 16, padding: "16px 20px", fontSize: 17,
                color: "var(--text)", outline: "none", textAlign: "center"
              }}
            />
            <button type="submit" style={{
              background: "linear-gradient(135deg, #ff3b5c, #ff6b35)",
              color: "white", padding: "16px", borderRadius: 16,
              border: "none", fontSize: 17, fontWeight: 700, cursor: "pointer"
            }}>
              Tilmeld venteliste →
            </button>
          </form>
        )}

        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 24 }}>
          Ingen spam. Kun én mail når appen er live.
        </p>
      </div>
    </div>
  );
}
