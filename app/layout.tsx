import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Shell } from "@/components/Shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIBATANG — Prototipe Sistem Booking & Antrean Terpadu",
  description: "Prototipe interaktif statis SIBATANG (Polres Batang, Polda Jawa Tengah). Seluruh data sintetis.",
  robots: { index: false, follow: false },
  icons: { icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' fill='%23c8a13a'/%3E%3C/svg%3E" }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="font-sans antialiased"><Shell>{children}</Shell></body>
    </html>
  );
}
