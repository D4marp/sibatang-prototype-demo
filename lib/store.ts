"use client";
import { useSyncExternalStore } from "react";
import { announce, isIndonesian, loadVoices, unlockAudio, type VoiceInfo } from "./speech";

/* ---------- tipe & konstanta (semua data sintetis) ---------- */
export type Svc = "SPKT" | "SATPAS" | "SAMSAT";
export type TState = "WAITING" | "CALLED" | "SERVING" | "DONE" | "NO_SHOW";
export type Ticket = { no: string; svc: Svc; state: TState; counter: number | null; code: string };
export type Booking = { code: string; svc: Svc; slot: string; ticket: Ticket | null };
export type JobState = "QUEUED" | "PLAYING" | "ACK" | "MUTED";
export type Job = { id: string; text: string; state: JobState };
export type Ev = { t: string; msg: string; cls: "" | "a" | "e" };
export type Wiz = { step: number; svc: Svc | null; slot: string | null; name: string; nik: string; code: string | null };
export type KioskOut = { kind: "ok" | "again" | "err"; ticketNo?: string; svc?: Svc; at?: string; msg?: string } | null;
export type VoiceState = {
  enabled: boolean; voiceURI: string; rate: number; volume: number; chime: boolean;
  voices: VoiceInfo[]; loaded: boolean; hasId: boolean;
};
export type TourState = { on: boolean; i: number; n: number; title: string; sub: string };
export type State = {
  bookings: Record<string, Booking>;
  tickets: Ticket[];
  seq: Record<string, number>;
  jobs: Job[];
  hist: { no: string; c: number }[];
  cur: Record<number, Ticket | null>;
  events: Ev[];
  wiz: Wiz;
  kioskCode: string;
  kioskOut: KioskOut;
  voice: VoiceState;
  tour: TourState;
  toast: { id: number; msg: string } | null;
  callPulse: number;
};

export const SERVICES: Record<Svc, { n: string; p: string; on: boolean }> = {
  SPKT: { n: "SPKT + SKCK", p: "A", on: true },
  SATPAS: { n: "SATPAS / SIM", p: "B", on: false },
  SAMSAT: { n: "SAMSAT / STNK+BPKB", p: "C", on: false }
};
export const COUNTERS: { id: number; svc: Svc }[] = [{ id: 1, svc: "SPKT" }, { id: 2, svc: "SPKT" }];
export const SLOTS: [string, number][] = [["08:00", 5], ["08:30", 5], ["09:00", 2], ["09:30", 0], ["10:00", 5], ["10:30", 4], ["11:00", 5], ["13:00", 5]];
export const BASE = { book: 34, arrived: 26, done: 21, noshow: 2, week: [22, 31, 28, 35, 30, 18] };
const WORD = ["nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"];
const LOKET = ["", "satu", "dua", "tiga"];
const pad = (n: number) => String(n).padStart(3, "0");
const nowT = () => new Date().toLocaleTimeString("id-ID");

const emptyWiz: Wiz = { step: 0, svc: null, slot: null, name: "", nik: "", code: null };
const initial: State = {
  bookings: { "BTG-DEMO1": { code: "BTG-DEMO1", svc: "SPKT", slot: "09:00", ticket: null } },
  tickets: [], seq: { A: 0, B: 0, C: 0 }, jobs: [], hist: [], cur: { 1: null, 2: null }, events: [],
  wiz: { ...emptyWiz }, kioskCode: "BTG-DEMO1", kioskOut: null,
  voice: { enabled: false, voiceURI: "", rate: 0.92, volume: 1, chime: true, voices: [], loaded: false, hasId: false },
  tour: { on: false, i: 0, n: 0, title: "", sub: "" }, toast: null, callPulse: 0
};

/* ---------- store minimal (tanpa dependensi) ---------- */
let state: State = initial;
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const getState = () => state;
export function useStore(): State { return useSyncExternalStore(subscribe, () => state, () => initial); }
function set(fn: (d: State) => void) {
  const d = structuredClone(state); // referensi bersama (tiket) tetap konsisten dalam satu klon
  fn(d); state = d; listeners.forEach(l => l());
}
function ev(d: State, msg: string, cls: Ev["cls"] = "") {
  d.events.unshift({ t: nowT(), msg, cls }); d.events = d.events.slice(0, 80);
}
export function toast(msg: string) {
  const id = Date.now();
  set(d => { d.toast = { id, msg }; });
  setTimeout(() => { if (state.toast?.id === id) set(d => { d.toast = null; }); }, 3200);
}
export function log(msg: string, cls: Ev["cls"] = "") { set(d => ev(d, msg, cls)); }
export function setTour(p: Partial<TourState>) { set(d => { Object.assign(d.tour, p); }); }

/* ---------- metrik (satu sumber untuk semua layar) ---------- */
export function metrics(s: State = state) {
  const live = Object.keys(s.bookings).length;
  const c = (x: TState) => s.tickets.filter(t => t.state === x).length;
  return {
    book: BASE.book + live, arrived: BASE.arrived + s.tickets.length, done: BASE.done + c("DONE"),
    noshow: BASE.noshow + c("NO_SHOW"), waiting: c("WAITING"), avg: 11 + Math.min(s.tickets.length, 9)
  };
}

/* ---------- wizard booking warga ---------- */
export function wizSet(p: Partial<Wiz>) { set(d => { Object.assign(d.wiz, p); }); }
export function wizReset() { set(d => { d.wiz = { ...emptyWiz }; }); }
export function finishBooking() {
  set(d => {
    const w = d.wiz; if (!w.svc || !w.slot) return;
    const code = "BTG-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    d.bookings[code] = { code, svc: w.svc, slot: w.slot, ticket: null };
    w.code = code; w.step = 3;
    ev(d, `BOOKING_CONFIRMED ${code} slot ${w.slot} (kuota dikunci atomik; belum ada nomor antrean)`);
  });
}

/* ---------- kiosk: check-in idempoten ---------- */
export function setKioskCode(v: string) { set(d => { d.kioskCode = v; }); }
export function checkin(raw: string) {
  set(d => {
    const code = raw.trim().toUpperCase(), b = d.bookings[code], at = new Date().toLocaleString("id-ID");
    if (!b) { d.kioskOut = { kind: "err", msg: "Kode booking tidak ditemukan." }; return; }
    if (b.ticket) {
      d.kioskOut = { kind: "again", ticketNo: b.ticket.no, svc: b.svc, at };
      ev(d, `CHECKIN_RETRY ${code} → tiket ${b.ticket.no} (idempoten, tidak menerbitkan tiket baru)`, "a"); return;
    }
    const p = SERVICES[b.svc].p; d.seq[p]++;
    const t: Ticket = { no: `${p}-${pad(d.seq[p])}`, svc: b.svc, state: "WAITING", counter: null, code };
    b.ticket = t; d.tickets.push(t);
    d.kioskOut = { kind: "ok", ticketNo: t.no, svc: b.svc, at };
    ev(d, `CHECKIN ${code} → TICKET_ISSUED ${t.no} (audit + event dalam satu transaksi)`);
  });
}
export function seedVisitor() {
  set(d => {
    const code = "BTG-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    d.bookings[code] = { code, svc: "SPKT", slot: "10:00", ticket: null };
  });
  const code = Object.keys(state.bookings).at(-1)!;
  checkin(code);
}

/* ---------- operator & announcer ---------- */
function makeCall(d: State, t: Ticket): Job {
  d.hist.unshift({ no: t.no, c: t.counter! }); d.hist = d.hist.slice(0, 6);
  const [p, n] = t.no.split("-");
  const text = `Nomor antrean ${p}, ${pad(+n).split("").map(x => WORD[+x]).join(", ")}. Silakan menuju loket ${LOKET[t.counter!]}.`;
  const job: Job = { id: "JOB-" + String(d.jobs.length + 1).padStart(3, "0"), text, state: "QUEUED" };
  d.jobs.unshift(job); d.callPulse++;
  ev(d, `TICKET_CALLED ${t.no} @loket ${t.counter} → queue_event + announcement_job ${job.id}`, "a");
  return job;
}
function setJob(id: string, st: JobState) { set(d => { const j = d.jobs.find(x => x.id === id); if (j) j.state = st; }); }
async function runJob(id: string) {
  const v = state.voice;
  if (!v.enabled) { setJob(id, "MUTED"); return; }
  const job = state.jobs.find(j => j.id === id); if (!job) return;
  setJob(id, "PLAYING");
  await announce(job.text, { voiceURI: v.voiceURI, rate: v.rate, volume: v.volume, chime: v.chime });
  setJob(id, "ACK");
}
export function callNext(cid: number): boolean {
  const c = COUNTERS.find(x => x.id === cid)!, act = state.cur[cid];
  if (act && (act.state === "CALLED" || act.state === "SERVING")) { toast("409 · Loket masih memiliki tiket aktif."); return false; }
  const idx = state.tickets.findIndex(t => t.state === "WAITING" && t.svc === c.svc);
  if (idx < 0) { toast("Tidak ada antrean menunggu untuk layanan loket ini."); return false; }
  let id = "";
  set(d => { const t = d.tickets[idx]; t.state = "CALLED"; t.counter = cid; d.cur[cid] = t; id = makeCall(d, t).id; });
  void runJob(id); return true;
}
export function recall(cid: number) {
  const t = state.cur[cid];
  if (!t || t.state !== "CALLED") { toast("409 · Tidak ada tiket berstatus CALLED."); return; }
  let id = ""; set(d => { id = makeCall(d, d.cur[cid]!).id; }); void runJob(id);
}
export function transition(cid: number, from: TState, to: TState, label: string): boolean {
  const t = state.cur[cid];
  if (!t || t.state !== from) { toast(`409 · Transisi tidak sah (diperlukan status ${from}).`); return false; }
  set(d => {
    const x = d.cur[cid]!; x.state = to;
    if (to === "DONE" || to === "NO_SHOW") d.cur[cid] = null;
    ev(d, `${label} ${x.no}`);
  });
  return true;
}

/* ---------- pengaturan suara ---------- */
export async function initVoices() {
  if (state.voice.loaded) return;
  const voices = await loadVoices();
  const id = voices.find(isIndonesian);
  set(d => {
    d.voice.voices = voices; d.voice.loaded = true; d.voice.hasId = !!id;
    if (!d.voice.voiceURI) d.voice.voiceURI = (id ?? voices[0])?.uri ?? "";
  });
}
export function enableVoice() { unlockAudio(); set(d => { d.voice.enabled = true; ev(d, "ANNOUNCER_ENABLED suara diaktifkan di perangkat ini"); }); void initVoices(); }
export function disableVoice() { set(d => { d.voice.enabled = false; ev(d, "ANNOUNCER_DISABLED suara dimatikan"); }); if (typeof window !== "undefined") window.speechSynthesis?.cancel(); }
export function setVoice(p: Partial<Pick<VoiceState, "voiceURI" | "rate" | "volume" | "chime">>) { set(d => { Object.assign(d.voice, p); }); }
export function testVoice() {
  if (!state.voice.enabled) enableVoice();
  const v = state.voice;
  void announce("Nomor antrean A, nol, nol, satu. Silakan menuju loket satu.", { voiceURI: v.voiceURI, rate: v.rate, volume: v.volume, chime: v.chime });
}
