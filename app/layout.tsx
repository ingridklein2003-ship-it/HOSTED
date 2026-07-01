import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HOSTED — Fest-appen der samler alle",
  description: "Opret din fest, invitér gæster via QR-kode, og play kortspil, Impostor og meget mere — alt samlet på én app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
