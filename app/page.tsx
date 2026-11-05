"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Button, Card, H2, Kpi, Note, Pill } from "@/components/ui";
import { metrics, useStore } from "@/lib/store";
import { runTour } from "@/lib/tour";

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
