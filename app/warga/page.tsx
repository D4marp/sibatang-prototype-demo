"use client";
import { Qr } from "@/components/Qr";
import { Button, Card, Note, PageHeader, Pill, Table, cx, inputCls } from "@/components/ui";
import { SERVICES, SLOTS, finishBooking, toast, useStore, wizReset, wizSet, type Svc } from "@/lib/store";

function Phone() {
  const { wiz } = useStore();
  const bars = (
    <div className="mb-4 flex gap-1.5">
      {[0, 1, 2, 3].map(i => <span key={i} className={cx("h-1 flex-1 rounded", i <= wiz.step ? "bg-gold" : "bg-slate-200")} />)}
    </div>
  );
  const digits = (wiz.nik.replace(/\D/g, "") + "0".repeat(16)).slice(0, 16);
  return (
    <div className="mx-auto w-[340px] max-w-full rounded-[42px] bg-[#0e1424] p-3 shadow-2xl">
      <div className="flex min-h-[580px] flex-col overflow-hidden rounded-[32px] bg-white">
        <div className="bg-gradient-to-br from-navy to-navy3 px-5 pb-4 pt-6 text-white"><small className="text-[#bccaee]">Polres Batang</small><b className="block text-lg">SIBATANG</b></div>
        <div className="flex-1 p-4">
          {bars}
          {wiz.step === 0 && (
            <>
              <h3 className="mb-3 font-bold text-navy">Pilih layanan</h3>
              {(Object.keys(SERVICES) as Svc[]).map(k => (
                <button key={k} disabled={!SERVICES[k].on} onClick={() => wizSet({ svc: k })}
                  className={cx("mb-2.5 flex w-full items-center gap-2 rounded-xl border-[1.5px] px-3 py-3 text-left text-sm",
                    wiz.svc === k ? "border-navy3 bg-blue-50" : "border-line hover:border-navy3", !SERVICES[k].on && "cursor-not-allowed opacity-45")}>
                  <b>{SERVICES[k].n}</b>{!SERVICES[k].on && <Pill className="ml-auto">segera</Pill>}
                </button>
              ))}
              <Button full disabled={!wiz.svc} onClick={() => wizSet({ step: 1 })}>Lanjut</Button>
            </>
          )}
          {wiz.step === 1 && (
            <>
              <h3 className="mb-3 font-bold text-navy">Pilih slot · besok</h3>
              <div className="mb-4 grid grid-cols-4 gap-2">
                {SLOTS.map(([t, q]) => (
                  <button key={t} disabled={q === 0} onClick={() => wizSet({ slot: t })}
                    className={cx("rounded-xl border-[1.5px] px-1 py-2 text-[13px] font-semibold", wiz.slot === t ? "border-navy bg-navy text-white" : "border-line", q === 0 && "line-through opacity-35")}>
                    {t}<small className={cx("block text-[10.5px] font-normal", wiz.slot === t ? "text-[#bccaee]" : "text-mute")}>sisa {q}</small>
                  </button>
                ))}
              </div>
              <Button full disabled={!wiz.slot} onClick={() => wizSet({ step: 2 })}>Lanjut</Button>
            </>
          )}
          {wiz.step === 2 && (
            <>
              <h3 className="mb-1 font-bold text-navy">Data pemohon</h3>
              <label className="mt-2 block text-xs font-semibold text-mute">Nama lengkap</label>
              <input className={inputCls} value={wiz.name} onChange={e => wizSet({ name: e.target.value })} placeholder="Nama (fiktif)" />
              <label className="mt-3 block text-xs font-semibold text-mute">NIK (16 digit)</label>
              <input className={inputCls} value={wiz.nik} maxLength={16} inputMode="numeric" onChange={e => wizSet({ nik: e.target.value })} placeholder="Gunakan angka fiktif" />
              <p className="my-2 text-xs text-mute">NIK disimpan terenkripsi dan tidak ditampilkan utuh.</p>
              <Button full onClick={() => (wiz.name.trim() ? finishBooking() : toast("Isi nama (gunakan data fiktif)."))}>Konfirmasi booking</Button>
            </>
          )}
          {wiz.step === 3 && wiz.code && wiz.svc && (
            <div className="text-center">
              <Pill tone="ok">Booking terkonfirmasi</Pill>
              <div className="my-3 grid place-items-center"><Qr code={wiz.code} /></div>
              <div className="font-mono text-[22px] font-extrabold text-navy">{wiz.code}</div>
              <p className="my-1.5 text-[13px] text-mute">{SERVICES[wiz.svc].n}<br />Besok · {wiz.slot} WIB<br />NIK {digits.slice(0, 4)}••••••••{digits.slice(-2)}</p>
              <div className="rounded-r-xl border-l-[3px] border-gold bg-[#f7f4e8] p-2.5 text-left text-[13px]"><b>Ini bukan nomor antrean.</b> Nomor diterbitkan saat Anda check-in di kiosk.</div>
              <Button tone="sec" full className="mt-3" onClick={wizReset}>Booking lagi</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Warga() {
  const { bookings } = useStore();
  const open = Object.values(bookings).filter(b => !b.ticket);
  return (
    <>
      <PageHeader title="Warga · Booking Layanan" lead="Simulasi aplikasi Android / web SIBATANG. Pilih layanan, slot, isi data (gunakan data fiktif), lalu terima kode booking." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Phone />
        <div className="space-y-4">
          <Card>
            <h3 className="mb-2 font-bold text-navy">Aturan yang diterapkan sistem</h3>
            <Table>
              {["Konfirmasi booking bukan nomor antrean", "Kuota slot dikunci atomik", "Idempotency-Key pada submit (klik ganda aman)", "NIK tersamar di layar & log", "QR bearer tidak muncul di event publik"].map(r => (
                <tr key={r}><td>{r}</td><td className="text-right"><Pill tone="ok">Aktif</Pill></td></tr>
              ))}
            </Table>
          </Card>
          <Card>
            <h3 className="mb-2 font-bold text-navy">Kode booking aktif (untuk kiosk)</h3>
            <div className="font-mono text-[15px] font-bold leading-8">
              {open.length ? open.map(b => <div key={b.code}>{b.code}</div>) : <span className="font-sans text-[13px] font-normal text-mute">Semua booking sudah check-in.</span>}
            </div>
          </Card>
          <Note><b>Catatan:</b> QR pada demo hanya ilustrasi. Di sistem nyata QR membawa token bearer berumur pendek.</Note>
        </div>
      </div>
    </>
  );
}
