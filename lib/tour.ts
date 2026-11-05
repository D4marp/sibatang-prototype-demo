"use client";
import { callNext, checkin, enableVoice, finishBooking, getState, setKioskCode, setTour, toast, transition, wizReset, wizSet } from "./store";

let token = 0;
export function stopTour() { token++; setTour({ on: false }); }

// Demo otomatis: menjalankan seluruh alur dan berpindah antarlayar.
export async function runTour(push: (path: string) => void) {
  const my = ++token, live = () => my === token, N = 7;
  const step = (i: number, title: string, sub: string) => setTour({ on: true, i, n: N, title, sub });
  const wait = async (ms: number) => { await new Promise(r => setTimeout(r, ms)); return live(); };
  if (!getState().voice.enabled) enableVoice(); // dipanggil dari klik pengguna → suara boleh bunyi

  wizReset(); step(1, "Warga memilih layanan", "SPKT + SKCK"); push("/warga/");
  if (!await wait(1400)) return; wizSet({ svc: "SPKT" });
  if (!await wait(900)) return; wizSet({ step: 1 }); step(2, "Warga memilih slot", "Kuota dikunci atomik");
  if (!await wait(900)) return; wizSet({ slot: "10:00" });
  if (!await wait(900)) return; wizSet({ step: 2, name: "Warga Demo", nik: "3325000000000001" });
  if (!await wait(1400)) return; finishBooking(); step(3, "Booking terkonfirmasi", "Kode + QR, belum ada nomor antrean");
  if (!await wait(2400)) return;
  const code = getState().wiz.code!;
  push("/kiosk/"); setKioskCode(code); step(4, "Check-in di kiosk", "Tiket diterbitkan satu kali");
  if (!await wait(1400)) return; checkin(code);
  if (!await wait(1900)) return; checkin(code); step(4, "Scan ulang tidak membuat tiket baru", "Idempoten: nomor tetap sama");
  if (!await wait(2300)) return;
  push("/operator/"); step(5, "Operator memanggil", "Status CALLED + event + job suara");
  if (!await wait(1400)) return;
  const s = getState();
  if (s.cur[1]) { transition(1, "CALLED", "SERVING", "TICKET_SERVING"); transition(1, "SERVING", "DONE", "TICKET_DONE"); }
  callNext(1);
  if (!await wait(1800)) return;
  push("/tv/"); step(6, "Layar TV menampilkan panggilan", "Hanya nomor dan loket, tanpa nama");
  if (!await wait(5200)) return;
  push("/operator/"); step(6, "Layanan diselesaikan", "CALLED → SERVING → DONE");
  if (!await wait(1200)) return; transition(1, "CALLED", "SERVING", "TICKET_SERVING");
  if (!await wait(1400)) return; transition(1, "SERVING", "DONE", "TICKET_DONE");
  if (!await wait(1400)) return;
  push("/polda/"); step(7, "Dashboard Polda ter-update", "Agregat saja, tanpa data warga");
  if (!await wait(4500)) return;
  stopTour(); toast("Demo otomatis selesai. Silakan jelajahi layar lain.");
}
