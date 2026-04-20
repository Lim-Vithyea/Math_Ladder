import type { Metadata } from "next";
import { Nunito, Kantumruy_Pro } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

// Kantumruy Pro covers Khmer script; it gracefully falls back to Nunito for Latin
const kantumruy = Kantumruy_Pro({
  subsets: ["khmer", "latin"],
  weight: ["400", "700"],
  variable: "--font-kantumruy",
});

export const metadata: Metadata = {
  title: "Math Ladder Race 🧮",
  description: "A fun calculator game for kids! Climb the ladder by solving math problems!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        Font stack: Kantumruy Pro first (handles Khmer glyphs),
        then Nunito (handles Latin / numbers), then system fallback.
      */}
      <body
        className={`${kantumruy.variable} ${nunito.variable}`}
        style={{
          fontFamily: "var(--font-kantumruy), var(--font-nunito), sans-serif",
          margin: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
