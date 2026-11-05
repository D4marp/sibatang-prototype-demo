import { Button, Card, Note, PageHeader, Pill, Table } from "@/components/ui";

export default function Admin() {
  return (
    <>
      <PageHeader title="Admin Polres Batang" lead="Konfigurasi tenant: layanan, jam, kuota, loket, operator, dan perangkat." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-bold text-navy">Layanan &amp; kuota</h3>
          <Table head={["Layanan", "Jam", "Kuota/slot", "Status"]}>
            <tr><td>SPKT + SKCK</td><td>08.00–15.00</td><td>5</td><td><Pill tone="ok">Publik</Pill></td></tr>
            <tr><td>SATPAS / SIM</td><td>08.00–14.00</td><td>8</td><td><Pill tone="warn">Draft</Pill></td></tr>
            <tr><td>SAMSAT</td><td>08.00–14.00</td><td>10</td><td><Pill tone="warn">Draft</Pill></td></tr>
          </Table>
        </Card>
        <Card>
          <h3 className="mb-2 font-bold text-navy">Loket &amp; operator</h3>
          <Table head={["Loket", "Layanan", "Operator"]}>
            <tr><td>1</td><td>SPKT/SKCK</td><td>Operator A · shift pagi</td></tr>
            <tr><td>2</td><td>SPKT/SKCK</td><td>Operator B · shift pagi</td></tr>
            <tr><td>3</td><td>SATPAS</td><td><Pill>Belum ditugaskan</Pill></td></tr>
          </Table>
        </Card>
        <Card>
          <h3 className="mb-2 font-bold text-navy">Perangkat site</h3>
          <Table>
            {["KIOSK-01", "TV-01", "ANNOUNCER-LOBBY"].map(d => (
              <tr key={d}><td>{d}</td><td><Pill tone="ok">terdaftar</Pill></td><td className="text-right"><Button tone="sec" size="sm">Cabut</Button></td></tr>
            ))}
          </Table>
          <Note>Autentikasi perangkat terikat site / zona audio dan dapat dicabut.</Note>
        </Card>
        <Card>
          <h3 className="mb-2 font-bold text-navy">Auto-advance (opsional)</h3>
          <p className="text-[14px]"><Pill tone="blue">AUTO_ADVANCE_ON_READY</Pill> dijalankan server hanya bila shift aktif, ada penugasan, ada check-in eligible, loket READY, tidak ada tiket aktif, dengan DB-lock dan audit.</p>
          <Note><b>Bukan</b> berdasarkan jam slot booking dan <b>bukan</b> keputusan klien.</Note>
        </Card>
      </div>
    </>
  );
}
