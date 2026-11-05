import { Card, H2, PageHeader, Table } from "@/components/ui";

const Y = ({ children }: { children: React.ReactNode }) => <td className="font-bold text-ok">{children}</td>;
const N = ({ children }: { children: React.ReactNode }) => <td className="text-bad">{children}</td>;
const P = ({ children }: { children: React.ReactNode }) => <td className="font-semibold text-warn">{children}</td>;

export default function Keamanan() {
  return (
    <>
      <PageHeader title="Keamanan, Privasi & Kontrol Akses" lead="Ringkasan matriks peran terhadap data, dan lapisan pertahanan yang dirancang." />
      <Card className="overflow-x-auto">
        <Table head={["Peran", "Booking sendiri", "Antrean loket", "Detail warga", "Agregat Batang", "Konfigurasi"]}>
          <tr><td className="font-semibold text-navy">Warga</td><Y>Ya (miliknya)</Y><N>Tidak</N><N>Tidak</N><N>Tidak</N><N>Tidak</N></tr>
          <tr><td className="font-semibold text-navy">Operator loket</td><N>Tidak</N><Y>Ya (loketnya)</Y><P>Terbatas</P><N>Tidak</N><N>Tidak</N></tr>
          <tr><td className="font-semibold text-navy">Admin Polres</td><N>Tidak</N><Y>Ya (site-nya)</Y><P>Sesuai kebijakan</P><Y>Ya</Y><Y>Ya</Y></tr>
          <tr><td className="font-semibold text-navy">Pengawas Polda</td><N>Tidak</N><N>Tidak</N><N>Tidak (default)</N><Y>Ya (agregat)</Y><N>Tidak</N></tr>
          <tr><td className="font-semibold text-navy">Perangkat</td><N>Tidak</N><P>Sesuai mode</P><N>Tidak</N><N>Tidak</N><N>Tidak</N></tr>
        </Table>
      </Card>
      <H2>Pertahanan berlapis</H2>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Isolasi tenant", "Peran saja tidak cukup: cek scope resource di backend dan RLS PostgreSQL. Role runtime bukan superuser / BYPASSRLS."],
          ["Anti-bocor data pribadi", "Tanpa NIK / HP / QR / token / isi formulir di layar, laporan agregat, event publik, atau log. Log terstruktur dan ter-redaksi."],
          ["Atomik & teraudit", "Slot, pembatalan, check-in, call-next: atomik, idempoten, diuji race. Audit ditulis dalam transaksi yang sama."],
          ["Sesi & login", "Cookie HttpOnly + CSRF. Login staf OIDC (Authorization Code + PKCE), gerbang MFA, tanpa auto-provision."],
          ["Satu kontrak API", "OpenAPI tunggal menghasilkan klien TS & Dart; error dan enum stabil; kompatibel dengan perangkat desktop terpasang."],
          ["Operasional", "Self-hosted / privat, TLS, DB terbatas, backup terenkripsi teruji, perangkat site dapat dicabut."]
        ].map(([t, d]) => <Card key={t}><h3 className="mb-1.5 font-bold text-navy">{t}</h3><p className="text-[14px] text-slate-600">{d}</p></Card>)}
      </div>
    </>
  );
}
