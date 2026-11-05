"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { NAV } from "@/lib/nav";
import { disableVoice, enableVoice, initVoices, useStore } from "@/lib/store";
import { runTour, stopTour } from "@/lib/tour";
import { Icon } from "./Icon";
import { Button, cx } from "./ui";

export function VoiceToggle({ big = false }: { big?: boolean }) {
  const { voice } = useStore();
  const on = voice.enabled;
  return (
    <button
      onClick={() => (on ? disableVoice() : enableVoice())}
      title={on ? "Suara announcer aktif (klik untuk mematikan)" : "Klik untuk mengaktifkan suara announcer"}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl border font-semibold transition",
        big ? "px-5 py-3 text-base" : "px-3 py-1.5 text-[13px]",
        on ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-amber-300 bg-amber-50 text-amber-800 animate-pulse"
      )}
    >
      <Icon name={on ? "volume" : "mute"} />
      {on ? "Suara aktif" : "Aktifkan suara"}
    </button>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const s = useStore();
  const [feed, setFeed] = useState(false);
  const cur = NAV.find(n => n.href === path || n.href === path + "/") ?? NAV[0];

  useEffect(() => { void initVoices(); }, []);

  return (
    <div className="grid min-h-screen lg:grid-cols-[262px_1fr]">
      <aside className="no-print bg-gradient-to-b from-navy to-[#071533] p-4 text-[#cdd8f0] lg:sticky lg:top-0 lg:h-screen lg:overflow-auto">
        <div className="flex items-center gap-3 border-b border-white/10 px-2 pb-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-gold to-[#8a6d17] text-[#1a1300]"><Icon name="shield" className="h-6 w-6" /></div>
          <div>
            <b className="block text-lg tracking-wide text-white">SIBATANG</b>
            <small className="block text-[11px] leading-tight text-[#9fb0d6]">Polres Batang · Polda Jawa Tengah</small>
          </div>
        </div>
        <nav className="mt-2 flex flex-wrap gap-1 lg:block">
          {NAV.map(n => (
            <div key={n.href} className="lg:block">
              {n.g && <div className="mx-2.5 mb-1.5 mt-4 hidden text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#7f92bd] lg:block">{n.g}</div>}
              <Link
                href={n.href}
                onClick={stopTour}
                className={cx(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-white/10",
                  n.href === cur.href ? "bg-gradient-to-r from-gold/25 to-gold/5 text-white shadow-[inset_3px_0_0_var(--color-gold)]" : ""
                )}
              >
                <Icon name={n.i} />
                <span>{n.t}</span>
                {n.n && <span className="ml-auto hidden text-[10.5px] text-[#7f92bd] lg:inline">{n.n}</span>}
              </Link>
            </div>
          ))}
        </nav>
        <p className="mx-2 mt-6 hidden border-t border-white/10 pt-3 text-[11.5px] text-[#8da0c9] lg:block">
          Prototipe statis untuk presentasi. Seluruh data sintetis; tidak terhubung ke sistem produksi.
        </p>
      </aside>

      <div className="min-w-0">
        <header className="no-print sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-line bg-white px-5 py-3 lg:px-8">
          <div className="text-[13px] text-mute">SIBATANG <span>/</span> <b className="text-ink">{cur.t}</b></div>
          <div className="flex-1" />
          <span className="rounded-full border border-[#ecd48a] bg-[#fff6dd] px-3 py-1 text-[11.5px] font-semibold text-[#7a5a00]">PROTOTIPE · DATA SINTETIS</span>
          <VoiceToggle />
          <Button tone="gold" size="sm" onClick={() => runTour(p => router.push(p))}><Icon name="play" className="h-4 w-4" /> Jalankan demo otomatis</Button>
        </header>
        <main className="page-in mx-auto max-w-[1220px] px-5 pb-32 pt-7 lg:px-8" key={path}>{children}</main>
      </div>

      {s.tour.on && (
        <div className="no-print fixed bottom-5 left-1/2 z-50 flex min-w-[340px] max-w-[92vw] -translate-x-1/2 items-center gap-4 rounded-2xl border border-gold bg-navy px-5 py-3 text-white shadow-2xl">
          <div className="flex-1">
            <b className="block">Langkah {s.tour.i}/{s.tour.n} · {s.tour.title}</b>
            <small className="text-[#b9c8ee]">{s.tour.sub}</small>
            <div className="mt-2 h-1 overflow-hidden rounded bg-white/15"><i className="block h-full bg-gold transition-all" style={{ width: `${(s.tour.i / s.tour.n) * 100}%` }} /></div>
          </div>
          <Button tone="ghost" size="sm" onClick={stopTour}>Hentikan</Button>
        </div>
      )}

      <div className="no-print fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {feed && (
          <div className="w-[min(440px,92vw)] rounded-2xl border border-line bg-white p-3 shadow-2xl">
            <h3 className="mb-2 text-sm font-bold text-navy">Event stream (SSE) &amp; audit</h3>
            <EventLog height="h-60" />
          </div>
        )}
        <Button tone="sec" size="sm" onClick={() => setFeed(v => !v)}><Icon name="list" className="h-4 w-4" /> Event stream</Button>
      </div>

      {s.toast && <div key={s.toast.id} className="fixed right-6 top-20 z-[60] max-w-sm rounded-xl border-l-4 border-warn bg-white px-4 py-2.5 text-sm shadow-xl">{s.toast.msg}</div>}
    </div>
  );
}

export function EventLog({ height = "h-52" }: { height?: string }) {
  const { events } = useStore();
  return (
    <div className={cx("overflow-auto rounded-xl bg-[#0b1327] p-3 font-mono text-xs leading-relaxed text-[#a9e6c4]", height)}>
      {events.length === 0 && <div className="text-[#6f82ab]">Belum ada event. Mulai demo untuk melihat alurnya.</div>}
      {events.map((e, i) => (
        <div key={i} className={e.cls === "a" ? "text-[#f1d98a]" : e.cls === "e" ? "text-[#ffb4b2]" : ""}>
          <span className="text-[#6f82ab]">{e.t}</span> {e.msg}
        </div>
      ))}
    </div>
  );
}
