"use client";
import { useEffect, useRef } from "react";

// QR dekoratif (pola deterministik dari kode). Bukan QR fungsional: hanya untuk ilustrasi demo.
export function Qr({ code, size = 156 }: { code: string; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const g = c.getContext("2d"); if (!g) return;
    g.fillStyle = "#fff"; g.fillRect(0, 0, size, size); g.fillStyle = "#0a1f44";
    let h = 7; for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const n = 25, s = size / n;
    const finder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (finder(x, y)) {
        const lx = x < 7 ? x : x - (n - 7), ly = y < 7 ? y : y - (n - 7);
        const edge = lx === 0 || lx === 6 || ly === 0 || ly === 6, core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
        if (edge || core) g.fillRect(x * s, y * s, s + 0.5, s + 0.5);
      } else {
        h = (h * 1103515245 + 12345) >>> 0;
        if ((h >>> 16) & 1) g.fillRect(x * s, y * s, s + 0.5, s + 0.5);
      }
    }
  }, [code, size]);
  return <canvas ref={ref} width={size} height={size} className="rounded-xl border border-line p-1.5" aria-label={`QR ${code}`} />;
}
