"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Button, Card, H2, Kpi, Note, Pill } from "@/components/ui";
import { metrics, useStore } from "@/lib/store";
import { runTour } from "@/lib/tour";

const Box = ({ t, children, gold }: { t: string; children: React.ReactNode; gold?: boolean }) => (
  <div className={`rounded-xl border p-3 text-[13px] ${gold ? "border-[#eadba5] bg-[#fbf6e6]" : "border-line bg-[#f8faff]"}`}>
    <b className="mb-0.5 block text-navy">{t}</b>{children}
  </div>
);
const Layer = ({ t, children, cols }: { t: string; children: React.ReactNode; cols: string }) => (
  <div className="grid gap-3 lg:grid-cols-[100px_1fr]">
    <div className="flex items-center text-[11px] font-bold uppercase tracking-[0.12em] text-mute">{t}</div>
    <div className={`grid gap-2.5 ${cols}`}>{children}</div>
  </div>
);
const Conn = ({ children }: { children: React.ReactNode }) => <div className="text-center text-[11.5px] text-mute lg:ml-[112px]">{children}</div>;

export default function Home() {
  const m = metrics(useStore());
  const router = useRouter();
  return (
    <>
      <section className="relative mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-navy3 p-8 text-white">
        <div className="pointer-events-none absolute -right-14 -top-14 h-64 w-64 rounded-full bg-[radial-gradient(#c8a13a66,transparent_70%)]" />
        <Pill className="!bg-white/15 !text-gold2">Pilot Polres Batang · Pengawasan Polda Jawa Tengah</Pill>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight">Booking &amp; Antrean Pelayanan Publik yang Terukur, Aman, dan Transparan</h1>
        <p className="mb-5 mt-2 max-w-2xl text-[#c9d6f2]">
          Warga memesan jadwal, check-in di kiosk, dipanggil otomatis lewat layar dan suara, sementara Polda Jawa Tengah memantau kinerja secara agregat tanpa melihat data pribadi warga.
        </p>
        <div className="relative z-10 flex flex-wrap gap-2.5">
          <Button tone="gold" onClick={() => runTour(p => router.push(p))}><Icon name="play" className="h-4 w-4" /> Jalankan demo otomatis</Button>
          <Link href="/warga/"><Button tone="ghost">Coba sebagai warga</Button></Link>
          <Link href="/polda/"><Button tone="ghost">Lihat dashboard Polda</Button></Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi value={m.book} label="Booking hari ini (demo)" />
        <Kpi value={m.waiting} label="Sedang menunggu" />
        <Kpi value={m.done} label="Pelayanan selesai" />
        <Kpi value={1} label="Polres aktif (Batang)" />
      </div>

      <H2>Alur Pelayanan</H2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Booking", "Warga memilih layanan & slot, menerima kode booking + QR. Belum ada nomor antrean."],
          ["Check-in Kiosk", "Scan QR di kiosk; tiket diterbitkan satu kali. Scan atau cetak ulang tidak membuat tiket baru."],
          ["Pemanggilan", "Operator memanggil (atau auto-ready oleh server). Status, event, dan job suara dibuat dalam satu transaksi."],
          ["Layar & Suara", "TV menampilkan nomor & loket; announcer membacakan nomor. Nama tidak ditampilkan ke publik."]
        ].map(([t, d], i) => (
          <Card key={t} className="relative !pt-6">
            <span className="absolute -top-3 left-4 grid h-7 w-7 place-items-center rounded-full bg-gold text-[13px] font-extrabold text-[#1a1300]">{i + 1}</span>
            <b className="mb-1 block text-navy">{t}</b><span className="text-[13px] text-mute">{d}</span>
          </Card>
        ))}
      </div>

      <H2>Arsitektur</H2>
      <Card className="grid gap-2">
        <Layer t="Klien" cols="md:grid-cols-3">
          <Box t="Web Next.js 16">Publik SIBATANG · Admin Polres · Dashboard Polda</Box>
          <Box t="Flutter Android">Booking, e-tiket QR, status antrean</Box>
          <Box t="Flutter Desktop Windows">Kiosk · Operator · Layar TV · Announcer</Box>
        </Layer>
        <Conn>▼ REST (satu kontrak OpenAPI → klien TS &amp; Dart ter-generate) + SSE ▼</Conn>
        <Layer t="Backend" cols="md:grid-cols-2">
          <Box t="Go · modular monolith" gold>Auth &amp; RBAC · Booking &amp; slot · Check-in &amp; tiket · Antrean · Announcer · Laporan · Audit</Box>
          <Box t="Worker" gold>Outbox, pengingat, agregasi Polda, kedaluwarsa slot</Box>
        </Layer>
        <Conn>▼ pgx / sqlc ▼</Conn>
        <Layer t="Data" cols="md:grid-cols-2">
          <Box t="PostgreSQL 18 + RLS">Tenant &amp; site · transaksi atomik · audit &amp; event transaksional</Box>
          <Box t="Self-hosted / privat">TLS · backup terenkripsi teruji · perangkat site dapat dicabut</Box>
        </Layer>
      </Card>

      <H2>Layanan Pilot Batang</H2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><h3 className="mb-2 font-bold text-navy">SPKT + SKCK</h3><Pill tone="ok">Aktif pilot</Pill></Card>
        <Card><h3 className="mb-2 font-bold text-navy">SATPAS / SIM</h3><Pill tone="warn">Aktif setelah approval</Pill></Card>
        <Card><h3 className="mb-2 font-bold text-navy">SAMSAT / STNK + BPKB</h3><Pill tone="warn">Aktif setelah approval</Pill></Card>
      </div>
      <Note><b>Catatan:</b> nama institusi final (“Polres” atau “Polresta” Batang) menunggu validasi legal sebelum seed produksi. Cakupan platform hanya Polda Jawa Tengah.</Note>
    </>
  );
}
