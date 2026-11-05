import { Card, H2, PageHeader, Pill } from "@/components/ui";

const PHASES = [
  ["Fase 1", "Fondasi", ["Seed Polda Jateng & Polres Batang", "RBAC / RLS", "Kontrak OpenAPI & CI"], "border-t-navy3"],
  ["Fase 2", "Alur inti", ["Booking & slot atomik", "Check-in & tiket", "Antrean & panggilan"], "border-t-navy3"],
  ["Fase 3", "Perangkat", ["Kiosk & operator", "Layar TV & announcer", "Aplikasi Android"], "border-t-navy3"],
  ["Fase 4", "Go-live", ["Dashboard Polda", "UAT & uji keamanan", "Backup & rilis Batang"], "border-t-gold"]
] as const;
const DOD = ["go test ./... -race hijau", "Validasi kontrak API hijau", "Lint, typecheck, E2E Next hijau", "Flutter analyze, test, build hijau", "Migrasi lulus di DB baru & upgrade baseline", "Tanpa kebocoran data pribadi", "Direview pemilik scope", "Rollback terdokumentasi"];

export default function Roadmap() {
  return (
    <>
      <PageHeader title="Roadmap Pilot · 16 Minggu" lead="Dashboard Polda, login, dan suara desktop dirilis bersama pilot Batang." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PHASES.map(([f, t, items, b], i) => (
          <Card key={f} className={`border-t-4 ${b}`}>
            <Pill tone={i === 3 ? "warn" : "blue"}>{f}</Pill>
            <h3 className="mt-2 font-bold text-navy">{t}</h3>
            <ul className="mt-2 list-disc pl-5 text-[13.5px] text-slate-600">{items.map(x => <li key={x}>{x}</li>)}</ul>
          </Card>
        ))}
      </div>
      <H2>Definition of Done</H2>
      <Card>
        <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
          {DOD.map(d => (
            <li key={d} className="flex items-center gap-2.5 py-1 text-[14px]">
              <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-emerald-50 text-[11px] font-extrabold text-ok">✓</span>{d}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
