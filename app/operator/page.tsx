"use client";
import { useState } from "react";
import { Button, Card, Note, PageHeader, Pill, Table, inputCls } from "@/components/ui";
import { COUNTERS, SERVICES, callNext, recall, seedVisitor, transition, useStore, type TState } from "@/lib/store";

const tone = (s: TState) => ({ WAITING: "warn", CALLED: "blue", SERVING: "blue", DONE: "ok", NO_SHOW: "bad" } as const)[s];

export default function Operator() {
  const s = useStore();
  const [cid, setCid] = useState(1);
  const cur = s.cur[cid];
  return (
    <>
      <PageHeader title="Operator Loket" lead="Operator hanya dapat mengubah antrean pada loket dan site yang ditugaskan dalam shift aktif." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <label className="block text-xs font-semibold text-mute">Loket (penugasan shift)</label>
          <select className={`${inputCls} mt-1.5`} value={cid} onChange={e => setCid(+e.target.value)}>
            {COUNTERS.map(c => <option key={c.id} value={c.id}>Loket {c.id} · {SERVICES[c.svc].n}</option>)}
          </select>
          <div className="my-3 flex gap-2"><Pill tone="ok">Shift aktif</Pill><Pill tone={cur ? "blue" : "ok"}>{cur ? "SEDANG BERTUGAS" : "READY"}</Pill></div>
          <div className="rounded-2xl border border-line bg-gradient-to-br from-blue-50 to-white p-5 text-center">
            <div className="text-[13px] text-mute">Sedang ditangani</div>
            <div className="text-7xl font-black leading-none text-navy">{cur ? cur.no : "—"}</div>
            <div className="mt-1 text-[13px] text-mute">{cur ? `${SERVICES[cur.svc].n} · ${cur.state}` : "Loket siap melayani"}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => callNext(cid)}>Panggil Berikutnya</Button>
            <Button tone="sec" onClick={() => recall(cid)}>Panggil Ulang</Button>
            <Button tone="ok" onClick={() => transition(cid, "CALLED", "SERVING", "TICKET_SERVING")}>Mulai Layani</Button>
            <Button tone="ok" onClick={() => transition(cid, "SERVING", "DONE", "TICKET_DONE")}>Selesai</Button>
            <Button tone="bad" onClick={() => transition(cid, "CALLED", "NO_SHOW", "TICKET_NO_SHOW")}>Tidak Hadir</Button>
          </div>
          <Note><b>Mesin status:</b> WAITING → CALLED → SERVING → DONE, atau CALLED → NO_SHOW. Transisi tidak sah ditolak server (409).</Note>
        </Card>
        <Card>
          <h3 className="mb-2 font-bold text-navy">Antrean</h3>
          <Table head={["Tiket", "Layanan", "Status"]}>
            {s.tickets.filter(t => t.state !== "DONE").map(t => (
              <tr key={t.no}><td><b>{t.no}</b></td><td>{SERVICES[t.svc].n}</td><td><Pill tone={tone(t.state)}>{t.state}{t.counter ? ` · L${t.counter}` : ""}</Pill></td></tr>
            ))}
            {s.tickets.filter(t => t.state !== "DONE").length === 0 && <tr><td colSpan={3} className="text-mute">Belum ada tiket. Lakukan check-in di tab Kiosk.</td></tr>}
          </Table>
          <div className="mt-3"><Button tone="sec" size="sm" onClick={seedVisitor}>+ Simulasikan 1 pengunjung check-in</Button></div>
        </Card>
      </div>
    </>
  );
}
