"use client";
import { Card, H2, Kpi, Note, PageHeader, Pill, Table, cx } from "@/components/ui";
import { BASE, SERVICES, metrics, useStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function Polda() {
  const m = metrics(useStore());
  const [asof, setAsof] = useState("");
  useEffect(() => setAsof(new Date().toLocaleString("id-ID") + " WIB"), [m.book, m.done, m.waiting]);
  const pct = Math.round((m.done / m.book) * 100);
  const days = ["H-6", "H-5", "H-4", "H-3", "H-2", "H-1", "Hari ini"];
  const vals = [...BASE.week, m.book], mx = Math.max(...vals);
  return (
    <>
      <PageHeader title="Dashboard Pengawasan Polda Jawa Tengah" lead="Metrik agregat saja, tanpa data warga. Hari pertama hanya Polres Batang. Angka berubah mengikuti simulasi di layar lain." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi value={1} label="Polres aktif" />
        <Kpi value={m.book} label="Total booking" />
        <Kpi value={m.waiting} label="Menunggu sekarang" />
        <Kpi value={m.avg} label="Rata-rata tunggu (menit, demo)" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-bold text-navy">Kinerja per layanan · Polres Batang</h3>
          <Table head={["Layanan", "Booking", "Hadir", "Selesai", "Tdk hadir"]}>
            <tr><td>{SERVICES.SPKT.n}</td><td>{m.book}</td><td>{m.arrived}</td><td>{m.done}</td><td>{m.noshow}</td></tr>
            <tr><td className="text-mute">SATPAS / SAMSAT</td><td colSpan={4} className="text-mute">Belum aktif (menunggu approval)</td></tr>
          </Table>
          <div className="mt-4 text-[13px] text-mute">Tingkat penyelesaian</div>
          <div className="mt-1 h-2 overflow-hidden rounded bg-slate-200"><i className="block h-full bg-gradient-to-r from-navy3 to-blue-500 transition-all duration-500" style={{ width: `${pct}%` }} /></div>
          <div className="mt-1 text-[13px] text-mute">{m.done} dari {m.book} booking selesai ({pct}%)</div>
        </Card>
        <Card>
          <h3 className="mb-2 font-bold text-navy">Kesehatan perangkat</h3>
          <Table>
            <tr><td>Kiosk</td><td><Pill tone="ok">2/2 online</Pill></td></tr>
            <tr><td>Printer tiket</td><td><Pill tone="ok">2/2 online</Pill></td></tr>
            <tr><td>Layar TV</td><td><Pill tone="ok">1/1 online</Pill></td></tr>
            <tr><td>Announcer</td><td><Pill tone="warn">1 aktif · 1 error TTS</Pill></td></tr>
          </Table>
          <p className="mt-3 text-[13px] text-mute">Data per: <b>{asof}</b>. Angka 0 dibedakan dari “data belum tersedia”.</p>
        </Card>
      </div>
      <Card className="mt-4">
        <h3 className="mb-1 font-bold text-navy">Booking 7 hari terakhir (sintetis)</h3>
        <div className="flex h-44 items-end gap-2.5 pt-2">
          {vals.map((v, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <em className="text-[11px] font-bold not-italic text-navy">{v}</em>
              <i className={cx("block w-full rounded-t-lg transition-all duration-500", i === 6 ? "bg-gradient-to-b from-gold2 to-gold" : "bg-gradient-to-b from-navy3 to-navy")} style={{ height: `${Math.round((v / mx) * 100)}%`, minHeight: 4 }} />
              <span className="text-[11px] text-mute">{days[i]}</span>
            </div>
          ))}
        </div>
      </Card>
      <H2>Onboarding Polres Jawa Tengah berikutnya</H2>
      <Card>
        <Pill>Belum ada tenant tambahan</Pill>
        <Note><b>Batas keras:</b> hanya Polres di Jawa Tengah setelah otorisasi, persetujuan, dan uji isolasi lulus. Tidak ada Polda lain atau dashboard nasional.</Note>
      </Card>
    </>
  );
}
