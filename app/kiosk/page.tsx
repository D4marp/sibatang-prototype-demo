"use client";
import { EventLog } from "@/components/Shell";
import { Button, Card, Note, PageHeader, Pill } from "@/components/ui";
import { SERVICES, checkin, setKioskCode, useStore } from "@/lib/store";

export default function Kiosk() {
  const { kioskCode, kioskOut, bookings } = useStore();
  const quick = () => setKioskCode((Object.values(bookings).find(b => !b.ticket) ?? bookings["BTG-DEMO1"]).code);
  return (
    <>
      <PageHeader title="Kiosk Check-in" lead="Perangkat Windows layar sentuh di lokasi. Tiket diterbitkan sekali setelah check-in; percobaan ulang menampilkan tiket yang sama." />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border-8 border-[#101a33] bg-[radial-gradient(circle_at_20%_0,#1b3f86,#0a1f44_70%)] px-6 py-8 text-center text-white shadow-xl">
          <div className="text-sm text-[#b9c8ec]">POLRES BATANG</div>
          <h2 className="my-1.5 text-[22px] font-bold">Selamat Datang di SIBATANG</h2>
          <p className="text-sm text-[#b9c8ec]">Pindai QR booking atau ketik kode</p>
          <input
            value={kioskCode} onChange={e => setKioskCode(e.target.value)} onKeyDown={e => e.key === "Enter" && checkin(kioskCode)}
            placeholder="BTG-XXXXX" autoComplete="off"
            className="mx-auto my-3 block w-full max-w-xs rounded-xl border border-white/20 bg-white px-3 py-3 text-center text-xl font-bold tracking-widest text-ink outline-none"
          />
          <div className="flex flex-wrap justify-center gap-2">
            <Button tone="gold" onClick={() => checkin(kioskCode)}>Check-in</Button>
            <Button tone="ghost" onClick={quick}>Isi kode demo</Button>
          </div>
          {kioskOut?.kind === "err" && <p className="mt-4"><Pill tone="bad">{kioskOut.msg}</Pill></p>}
          {kioskOut && kioskOut.kind !== "err" && kioskOut.svc && (
            <>
              <div className="mx-auto mt-5 w-60 bg-white p-4 font-mono text-xs text-black shadow-2xl">
                <b>POLRES BATANG</b><br />{SERVICES[kioskOut.svc].n}
                <hr className="my-2 border-dashed border-slate-400" />
                <div className="text-5xl font-black leading-tight">{kioskOut.ticketNo}</div>
                Mohon menunggu panggilan<br /><small>{kioskOut.at}</small>
              </div>
              <div className="mt-3">{kioskOut.kind === "again"
                ? <Pill tone="warn">Tiket sudah pernah diterbitkan · nomor tetap sama</Pill>
                : <Pill tone="ok">Tiket diterbitkan</Pill>}</div>
            </>
          )}
        </div>
        <Card>
          <h3 className="mb-2 font-bold text-navy">Event &amp; audit server</h3>
          <EventLog height="h-64" />
          <Note><b>Invarian:</b> tiket tidak pernah dibuat di klien saat offline. Retry scan/cetak bersifat idempoten.</Note>
        </Card>
      </div>
    </>
  );
}
