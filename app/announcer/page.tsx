"use client";
import { VoiceToggle } from "@/components/Shell";
import { Button, Card, Note, PageHeader, Pill, Table, inputCls } from "@/components/ui";
import { isIndonesian } from "@/lib/speech";
import { setVoice, testVoice, useStore, type JobState } from "@/lib/store";

const tone = (s: JobState) => ({ ACK: "ok", PLAYING: "blue", QUEUED: "warn", MUTED: "neutral" } as const)[s];

export default function Announcer() {
  const { voice, jobs } = useStore();
  const sorted = [...voice.voices].sort((a, b) => Number(isIndonesian(b)) - Number(isIndonesian(a)) || a.name.localeCompare(b.name));
  return (
    <>
      <PageHeader title="Announcer Suara Otomatis" lead="Setiap tiket CALLED menghasilkan job pengumuman. Satu announcer aktif (lease) per zona audio; TTS lokal bahasa Indonesia dibacakan berurutan." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Pill tone="ok">Lease aktif · Zona Lobby</Pill><VoiceToggle />
          </div>

          <h3 className="mb-2 mt-5 font-bold text-navy">Pengaturan suara (perangkat ini)</h3>
          {voice.loaded && !voice.hasId && (
            <div className="mb-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-[13px] text-amber-900">
              Suara bahasa Indonesia belum terpasang di perangkat ini, sehingga browser memakai suara lain. Di Windows: Settings → Time &amp; language → Language &amp; region → tambahkan <b>Bahasa Indonesia</b>, lalu muat ulang halaman. Bunyi “ding-dong” tetap berfungsi.
            </div>
          )}
          <label className="block text-xs font-semibold text-mute">Suara</label>
          <select className={`${inputCls} mt-1.5`} value={voice.voiceURI} onChange={e => setVoice({ voiceURI: e.target.value })}>
            {sorted.length === 0 && <option>(memuat daftar suara…)</option>}
            {sorted.map(v => <option key={v.uri} value={v.uri}>{isIndonesian(v) ? "★ " : ""}{v.name} · {v.lang}</option>)}
          </select>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <label className="text-xs font-semibold text-mute">Volume ({Math.round(voice.volume * 100)}%)
              <input type="range" min={0.1} max={1} step={0.1} value={voice.volume} onChange={e => setVoice({ volume: +e.target.value })} className="mt-2 w-full" /></label>
            <label className="text-xs font-semibold text-mute">Kecepatan ({voice.rate.toFixed(2)}×)
              <input type="range" min={0.6} max={1.3} step={0.02} value={voice.rate} onChange={e => setVoice({ rate: +e.target.value })} className="mt-2 w-full" /></label>
          </div>
          <label className="mt-3 flex items-center gap-2 text-[13px] text-ink"><input type="checkbox" checked={voice.chime} onChange={e => setVoice({ chime: e.target.checked })} /> Bunyi “ding-dong” sebelum pengumuman</label>
          <div className="mt-4"><Button onClick={testVoice}>Tes suara</Button></div>
          <Note><b>Batas yang jujur:</b> sistem menjamin job idempoten dan ack, bukan “tepat sekali” di speaker fisik. Kegagalan memicu alert.</Note>
        </Card>

        <div className="space-y-5">
          <Card>
            <h3 className="mb-2 font-bold text-navy">Antrean job pengumuman</h3>
            <Table head={["Job", "Teks", "Status"]}>
              {jobs.slice(0, 6).map(j => (
                <tr key={j.id}><td>{j.id}</td><td className="text-xs">{j.text}</td><td><Pill tone={tone(j.state)}>{j.state}</Pill></td></tr>
              ))}
              {jobs.length === 0 && <tr><td colSpan={3} className="text-mute">Belum ada job. Panggil tiket di tab Operator.</td></tr>}
            </Table>
            <p className="mt-2 text-xs text-mute">MUTED = tiket dipanggil saat suara dinonaktifkan di perangkat ini.</p>
          </Card>
          <Card>
            <h3 className="mb-2 font-bold text-navy">Kebijakan nama</h3>
            <label className="block text-xs font-semibold text-mute">Mode pengumuman (kebijakan tenant)</label>
            <select className={`${inputCls} mt-1.5`}><option>Hanya nomor (default)</option><option disabled>Nomor + nama (perlu dasar hukum &amp; persetujuan)</option></select>
            <p className="mt-3 text-[13px] text-mute">Contoh ucapan:<br /><b className="text-[15px] text-navy">“Nomor antrean A, nol, nol, satu. Silakan menuju loket satu.”</b></p>
            <Note><b>Privasi:</b> nama tidak boleh masuk layar publik, API Polda, SSE publik, log bersama, atau penyedia TTS eksternal tanpa dasar yang disetujui.</Note>
          </Card>
        </div>
      </div>
    </>
  );
}
