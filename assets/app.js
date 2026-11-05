"use strict";
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pad = n => String(n).padStart(3, "0");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- icons ---------- */
const IC = {
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  kiosk: '<rect x="4" y="2" width="16" height="12" rx="2"/><path d="M8 14v4h8v-4"/><line x1="6" y1="22" x2="18" y2="22"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  tv: '<rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>',
  chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  play: '<polygon points="5 3 19 12 5 21 5 3"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>'
};
const icon = n => `<svg class="i" viewBox="0 0 24 24">${IC[n]}</svg>`;
$("#logo").innerHTML = icon("shield");

/* ---------- navigation ---------- */
const VIEWS = [
  { g: "Ringkasan", id: "home", t: "Gambaran Sistem", i: "home" },
  { g: "Alur Pelayanan", id: "warga", t: "Warga · Booking", i: "phone", n: "1" },
  { id: "kiosk", t: "Kiosk Check-in", i: "kiosk", n: "2" },
  { id: "operator", t: "Operator Loket", i: "users", n: "3" },
  { id: "display", t: "Layar TV", i: "tv", n: "4" },
  { id: "announcer", t: "Announcer Suara", i: "volume", n: "5" },
  { g: "Pengawasan & Admin", id: "polda", t: "Dashboard Polda", i: "chart" },
  { id: "admin", t: "Admin Polres", i: "sliders" },
  { g: "Tata Kelola", id: "security", t: "Keamanan & Privasi", i: "lock" },
  { id: "roadmap", t: "Roadmap", i: "flag" }
];
$("#nav").innerHTML = VIEWS.map(v => (v.g ? `<div class="nav-h">${v.g}</div>` : "") +
  `<button data-v="${v.id}">${icon(v.i)}<span>${v.t}</span>${v.n ? `<span class="n">${v.n}</span>` : ""}</button>`).join("");
function go(id) {
  $$("#nav button").forEach(b => b.classList.toggle("on", b.dataset.v === id));
  $$(".view").forEach(v => v.classList.toggle("on", v.id === "v-" + id));
  $("#crumb").textContent = VIEWS.find(v => v.id === id).t;
  render(); scrollTo(0, 0);
}
$("#nav").addEventListener("click", e => { const b = e.target.closest("button[data-v]"); if (b) { stopTour(); go(b.dataset.v); } });
document.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) go(b.dataset.go); });

/* ---------- domain state (in memory, synthetic) ---------- */
const SERVICES = {
  SPKT: { n: "SPKT + SKCK", p: "A", on: true },
  SATPAS: { n: "SATPAS / SIM", p: "B", on: false },
  SAMSAT: { n: "SAMSAT / STNK+BPKB", p: "C", on: false }
};
const COUNTERS = [{ id: 1, svc: "SPKT" }, { id: 2, svc: "SPKT" }];
const WORD = ["nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"];
const BASE = { book: 34, arrived: 26, done: 21, noshow: 2, week: [22, 31, 28, 35, 30, 18] };
const S = { bookings: {}, tickets: [], seq: { A: 0, B: 0, C: 0 }, jobs: [], hist: [], cur: { 1: null, 2: null }, events: [] };
S.bookings["BTG-DEMO1"] = { code: "BTG-DEMO1", svc: "SPKT", slot: "09:00", ticket: null };

function emit(msg, cls = "") {
  S.events.unshift({ t: new Date().toLocaleTimeString("id-ID"), msg, cls });
  S.events = S.events.slice(0, 80); renderLogs();
}
function renderLogs() {
  const h = S.events.map(e => `<div class="${e.cls}"><span>${e.t}</span> ${esc(e.msg)}</div>`).join("") || `<div><span>—</span> belum ada event</div>`;
  $("#log-kiosk").innerHTML = h; $("#log-feed").innerHTML = h;
}
function toast(m) { const t = document.createElement("div"); t.className = "toast"; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 3200); }

function metrics() {
  const live = Object.keys(S.bookings).length;
  const done = S.tickets.filter(t => t.state === "DONE").length;
  const noshow = S.tickets.filter(t => t.state === "NO_SHOW").length;
  const waiting = S.tickets.filter(t => t.state === "WAITING").length;
  return { book: BASE.book + live, arrived: BASE.arrived + S.tickets.length, done: BASE.done + done, noshow: BASE.noshow + noshow, waiting, avg: 11 + Math.min(S.tickets.length, 9) };
}

/* ---------- Warga booking wizard ---------- */
const W = { step: 0, svc: null, slot: null, name: "", nik: "", code: null };
const SLOTS = [["08:00", 5], ["08:30", 5], ["09:00", 2], ["09:30", 0], ["10:00", 5], ["10:30", 4], ["11:00", 5], ["13:00", 5]];
function qrCanvas(code) {
  const c = document.createElement("canvas"); c.width = c.height = 156; const g = c.getContext("2d");
  g.fillStyle = "#fff"; g.fillRect(0, 0, 156, 156); g.fillStyle = "#0a1f44";
  let h = 7; for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const n = 25, s = 156 / n;
  const finder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (finder(x, y)) {
      const lx = x < 7 ? x : x - (n - 7), ly = y < 7 ? y : y - (n - 7);
      const edge = lx === 0 || lx === 6 || ly === 0 || ly === 6, core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
      if (edge || core) g.fillRect(x * s, y * s, s + .5, s + .5);
    } else { h = (h * 1103515245 + 12345) >>> 0; if ((h >>> 16) & 1) g.fillRect(x * s, y * s, s + .5, s + .5); }
  }
  return c;
}
function renderPhone() {
  const bars = `<div class="steps">${[0, 1, 2, 3].map(i => `<span class="${i <= W.step ? "on" : ""}"></span>`).join("")}</div>`;
  let h = bars;
  if (W.step === 0) h += `<h3>Pilih layanan</h3>` + Object.entries(SERVICES).map(([k, v]) =>
    `<div class="opt ${v.on ? "" : "dis"} ${W.svc === k ? "sel" : ""}" data-svc="${k}"><b>${v.n}</b>${v.on ? "" : '<span class="pill" style="margin-left:auto">segera</span>'}</div>`).join("") +
    `<button class="btn full" data-act="next" ${W.svc ? "" : "disabled"}>Lanjut</button>`;
  if (W.step === 1) h += `<h3>Pilih slot · besok</h3><div class="slots">${SLOTS.map(([t, q]) =>
    `<div class="slot ${q === 0 ? "full" : ""} ${W.slot === t ? "sel" : ""}" data-slot="${t}" data-q="${q}">${t}<small>sisa ${q}</small></div>`).join("")}</div>` +
    `<button class="btn full" data-act="next" ${W.slot ? "" : "disabled"}>Lanjut</button>`;
  if (W.step === 2) h += `<h3>Data pemohon</h3><label>Nama lengkap</label><input id="w-name" value="${esc(W.name)}" placeholder="Nama (fiktif)">` +
    `<label>NIK (16 digit)</label><input id="w-nik" value="${esc(W.nik)}" inputmode="numeric" maxlength="16" placeholder="Gunakan angka fiktif">` +
    `<p class="sub">NIK disimpan terenkripsi dan tidak ditampilkan utuh.</p><button class="btn full" data-act="next">Konfirmasi booking</button>`;
  if (W.step === 3) {
    const d = (W.nik.replace(/\D/g, "") + "0000000000000000").slice(0, 16);
    h += `<div style="text-align:center"><span class="pill ok">Booking terkonfirmasi</span><div class="qrwrap" id="qrbox"></div>` +
      `<div style="font:800 21px ui-monospace,Consolas,monospace;color:var(--navy)">${W.code}</div>` +
      `<p class="sub" style="margin:6px 0">${SERVICES[W.svc].n}<br>Besok · ${W.slot} WIB<br>NIK ${d.slice(0, 4)}••••••••${d.slice(-2)}</p>` +
      `<div class="note" style="text-align:left"><b>Ini bukan nomor antrean.</b> Nomor diterbitkan saat Anda check-in di kiosk.</div>` +
      `<button class="btn sec full" style="margin-top:12px" data-act="reset">Booking lagi</button></div>`;
  }
  $("#phone").innerHTML = h;
  if (W.step === 3) $("#qrbox").appendChild(qrCanvas(W.code));
}
function finishBooking() {
  W.code = "BTG-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  S.bookings[W.code] = { code: W.code, svc: W.svc, slot: W.slot, ticket: null };
  emit(`BOOKING_CONFIRMED ${W.code} slot ${W.slot} (kuota dikunci atomik; belum ada nomor antrean)`);
  W.step = 3; renderCodes(); renderPhone();
}
function renderCodes() {
  const open = Object.values(S.bookings).filter(b => !b.ticket).map(b => b.code);
  $("#my-codes").innerHTML = open.length ? open.join("<br>") : '<span class="sub">Semua booking sudah check-in.</span>';
}
$("#phone").addEventListener("click", e => {
  const o = e.target.closest("[data-svc]"), s = e.target.closest(".slot"), a = e.target.closest("[data-act]");
  if (o && SERVICES[o.dataset.svc].on) { W.svc = o.dataset.svc; renderPhone(); }
  if (s && +s.dataset.q > 0) { W.slot = s.dataset.slot; renderPhone(); }
  if (a && !a.disabled) {
    if (a.dataset.act === "reset") { Object.assign(W, { step: 0, svc: null, slot: null, name: "", nik: "", code: null }); renderPhone(); }
    else if (W.step === 2) { if (!W.name.trim()) return toast("Isi nama (gunakan data fiktif)."); finishBooking(); }
    else { W.step++; renderPhone(); }
  }
});
$("#phone").addEventListener("input", e => { if (e.target.id === "w-name") W.name = e.target.value; if (e.target.id === "w-nik") W.nik = e.target.value; });

/* ---------- Kiosk ---------- */
function checkin(raw) {
  const code = raw.trim().toUpperCase(), b = S.bookings[code];
  if (!b) return { err: "Kode booking tidak ditemukan." };
  if (b.ticket) { emit(`CHECKIN_RETRY ${code} → tiket ${b.ticket.no} (idempoten, tidak menerbitkan tiket baru)`, "a"); return { t: b.ticket, again: true }; }
  const p = SERVICES[b.svc].p; S.seq[p]++;
  const t = { no: p + "-" + pad(S.seq[p]), svc: b.svc, state: "WAITING", counter: null, code };
  b.ticket = t; S.tickets.push(t);
  emit(`CHECKIN ${code} → TICKET_ISSUED ${t.no} (audit + event dalam satu transaksi)`);
  return { t };
}
function paper(t, again) {
  return `<div class="paper"><b>POLRES BATANG</b><br>${SERVICES[t.svc].n}<hr style="border:0;border-top:1px dashed #999"><div class="no">${t.no}</div>Mohon menunggu panggilan<br><small>${new Date().toLocaleString("id-ID")}</small></div>` +
    (again ? `<span class="pill warn">Tiket sudah pernah diterbitkan · nomor tetap sama</span>` : `<span class="pill ok">Tiket diterbitkan</span>`);
}
function doKioskCheckin() {
  const r = checkin($("#k-code").value);
  $("#k-out").innerHTML = r.err ? `<p><span class="pill bad">${r.err}</span></p>` : paper(r.t, r.again);
  renderCodes(); render(); return r;
}
$("#k-go").onclick = doKioskCheckin;
$("#k-code").addEventListener("keydown", e => { if (e.key === "Enter") doKioskCheckin(); });
$("#k-quick").onclick = () => { const b = Object.values(S.bookings).find(x => !x.ticket) || S.bookings["BTG-DEMO1"]; $("#k-code").value = b.code; };

/* ---------- Operator ---------- */
$("#o-counter").innerHTML = COUNTERS.map(c => `<option value="${c.id}">Loket ${c.id} · ${SERVICES[c.svc].n}</option>`).join("");
const curCounter = () => +$("#o-counter").value;
function emitCall(t) {
  S.hist.unshift({ no: t.no, c: t.counter }); S.hist = S.hist.slice(0, 6);
  const [p, n] = t.no.split("-");
  const text = `Nomor antrean ${p}, ${pad(+n).split("").map(d => WORD[+d]).join(", ")}. Silakan menuju loket ${["", "satu", "dua"][t.counter]}.`;
  const job = { id: "JOB-" + String(S.jobs.length + 1).padStart(3, "0"), text, state: "QUEUED" };
  S.jobs.unshift(job);
  emit(`TICKET_CALLED ${t.no} @loket ${t.counter} → queue_event + announcement_job ${job.id}`, "a");
  render();
  const f = $("#tv-now"); f.classList.remove("flash"); void f.offsetWidth; f.classList.add("flash");
  setTimeout(() => speak(job), 350);
}
function speak(job) {
  const done = () => { job.state = "ACK"; render(); };
  job.state = "PLAYING"; render();
  if ($("#a-on").checked && "speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(job.text); u.lang = "id-ID"; u.onend = done; u.onerror = done; speechSynthesis.speak(u);
  } else setTimeout(done, 900);
}
function callNext(counterId = curCounter()) {
  const c = COUNTERS.find(x => x.id === counterId), act = S.cur[c.id];
  if (act && ["CALLED", "SERVING"].includes(act.state)) { toast("409 · Loket masih memiliki tiket aktif."); return false; }
  const t = S.tickets.find(x => x.state === "WAITING" && x.svc === c.svc);
  if (!t) { toast("Tidak ada antrean menunggu untuk layanan loket ini."); return false; }
  t.state = "CALLED"; t.counter = c.id; S.cur[c.id] = t; emitCall(t); return true;
}
function setState(from, to, label, counterId = curCounter()) {
  const t = S.cur[counterId];
  if (!t || t.state !== from) { toast(`409 · Transisi tidak sah (diperlukan status ${from}).`); return false; }
  t.state = to; if (["DONE", "NO_SHOW"].includes(to)) S.cur[counterId] = null;
  emit(`${label} ${t.no}`); render(); return true;
}
$("#o-call").onclick = () => callNext();
$("#o-recall").onclick = () => { const t = S.cur[curCounter()]; if (!t || t.state !== "CALLED") return toast("409 · Tidak ada tiket berstatus CALLED."); emitCall(t); };
$("#o-serve").onclick = () => setState("CALLED", "SERVING", "TICKET_SERVING");
$("#o-done").onclick = () => setState("SERVING", "DONE", "TICKET_DONE");
$("#o-noshow").onclick = () => setState("CALLED", "NO_SHOW", "TICKET_NO_SHOW");
$("#o-counter").onchange = render;
$("#o-seed").onclick = () => {
  const code = "BTG-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  S.bookings[code] = { code, svc: "SPKT", slot: "10:00", ticket: null }; checkin(code); renderCodes(); render();
};
$("#a-test").onclick = () => speak({ id: "TEST", text: "Nomor antrean A, nol, nol, satu. Silakan menuju loket satu.", state: "QUEUED" });

/* ---------- Render ---------- */
const stCls = s => ({ WAITING: "warn", CALLED: "blue", SERVING: "blue", DONE: "ok", NO_SHOW: "bad" }[s] || "");
function render() {
  const m = metrics();
  $("#h-book").textContent = m.book; $("#h-wait").textContent = m.waiting; $("#h-done").textContent = m.done;
  const c = S.cur[curCounter()];
  $("#o-cur").textContent = c ? c.no : "—";
  $("#o-svc").textContent = c ? `${SERVICES[c.svc].n} · ${c.state}` : "Loket siap melayani";
  $("#o-status").innerHTML = `<span class="pill ok">Shift aktif</span> <span class="pill ${c ? "blue" : "ok"}">${c ? "SEDANG BERTUGAS" : "READY"}</span>`;
  $("#o-queue").innerHTML = S.tickets.filter(t => t.state !== "DONE").map(t =>
    `<tr><td><b>${t.no}</b></td><td>${SERVICES[t.svc].n}</td><td><span class="pill ${stCls(t.state)}">${t.state}${t.counter ? " · L" + t.counter : ""}</span></td></tr>`).join("") ||
    `<tr><td colspan="3" class="sub">Belum ada tiket. Lakukan check-in di tab Kiosk.</td></tr>`;
  const last = S.hist[0];
  $("#tv-now").innerHTML = last ? `<div class="c">NOMOR ANTREAN</div><div class="n">${last.no}</div><div class="c">LOKET ${last.c}</div>` : `<div class="c">MENUNGGU PANGGILAN</div><div class="n">—</div>`;
  $("#tv-hist").innerHTML = S.hist.slice(1, 5).map(h => `<div class="it"><b>${h.no}</b><span>Loket ${h.c}</span></div>`).join("") || `<div class="it" style="color:#667">—</div>`;
  $("#tv-clock").textContent = new Date().toLocaleTimeString("id-ID") + " WIB";
  $("#a-jobs").innerHTML = S.jobs.slice(0, 6).map(j =>
    `<tr><td>${j.id}</td><td style="font-size:12px">${esc(j.text)}</td><td><span class="pill ${j.state === "ACK" ? "ok" : j.state === "PLAYING" ? "blue" : "warn"}">${j.state}</span></td></tr>`).join("") ||
    `<tr><td colspan="3" class="sub">Belum ada job. Panggil tiket di tab Operator.</td></tr>`;
  $("#p-tot").textContent = m.book; $("#p-wait").textContent = m.waiting; $("#p-avg").textContent = m.avg;
  $("#p-asof").textContent = new Date().toLocaleString("id-ID") + " WIB";
  $("#p-svc").innerHTML = `<tr><td>${SERVICES.SPKT.n}</td><td>${m.book}</td><td>${m.arrived}</td><td>${m.done}</td><td>${m.noshow}</td></tr>` +
    `<tr><td class="sub">SATPAS / SAMSAT</td><td colspan="4" class="sub">Belum aktif (menunggu approval)</td></tr>`;
  const pct = Math.round(m.done / m.book * 100);
  $("#p-prog").style.width = pct + "%"; $("#p-progl").textContent = `${m.done} dari ${m.book} booking selesai (${pct}%)`;
  const days = ["H-6", "H-5", "H-4", "H-3", "H-2", "H-1", "Hari ini"], vals = [...BASE.week, m.book], mx = Math.max(...vals);
  $("#p-bars").innerHTML = vals.map((v, i) => `<div class="b ${i === 6 ? "today" : ""}"><em>${v}</em><i style="height:${Math.round(v / mx * 100)}%"></i><span>${days[i]}</span></div>`).join("");
}
setInterval(() => { if ($("#v-display").classList.contains("on")) $("#tv-clock").textContent = new Date().toLocaleTimeString("id-ID") + " WIB"; }, 1000);

/* ---------- Event feed ---------- */
$("#feedbtn").innerHTML = icon("list") + " Event stream";
$("#feedbtn").onclick = () => $("#feed").classList.toggle("on");

/* ---------- Guided demo (otomatis) ---------- */
let tourToken = 0;
const tourLabel = icon("play") + " Jalankan demo otomatis";
$("#tour-btn").innerHTML = tourLabel; $("#tour-btn2").innerHTML = tourLabel;
$("#tour-btn").onclick = $("#tour-btn2").onclick = runTour;
$("#db-stop").onclick = stopTour;
function stopTour() { tourToken++; $("#demobar").classList.remove("on"); }
function bar(i, n, title, sub) { $("#demobar").classList.add("on"); $("#db-title").textContent = `Langkah ${i}/${n} · ${title}`; $("#db-sub").textContent = sub; }
async function runTour() {
  const my = ++tourToken, ok = () => my === tourToken, N = 7;
  Object.assign(W, { step: 0, svc: null, slot: null, name: "", nik: "", code: null }); renderPhone();
  bar(1, N, "Warga memilih layanan", "SPKT + SKCK"); go("warga"); await sleep(1300); if (!ok()) return;
  W.svc = "SPKT"; renderPhone(); await sleep(900); if (!ok()) return;
  W.step = 1; renderPhone(); bar(2, N, "Warga memilih slot", "Kuota dikunci atomik"); await sleep(900); if (!ok()) return;
  W.slot = "10:00"; renderPhone(); await sleep(900); if (!ok()) return;
  W.step = 2; W.name = "Warga Demo"; W.nik = "3325000000000001"; renderPhone(); await sleep(1300); if (!ok()) return;
  finishBooking(); bar(3, N, "Booking terkonfirmasi", "Kode + QR, belum ada nomor antrean"); await sleep(2200); if (!ok()) return;
  go("kiosk"); bar(4, N, "Check-in di kiosk", "Tiket diterbitkan satu kali"); $("#k-code").value = W.code; await sleep(1200); if (!ok()) return;
  doKioskCheckin(); await sleep(1800); if (!ok()) return;
  $("#k-code").value = W.code; doKioskCheckin(); bar(4, N, "Scan ulang tidak membuat tiket baru", "Idempoten: nomor tetap sama"); await sleep(2200); if (!ok()) return;
  go("operator"); $("#o-counter").value = "1"; render(); bar(5, N, "Operator memanggil", "Status CALLED + event + job suara"); await sleep(1200); if (!ok()) return;
  const waiting = S.tickets.some(t => t.state === "WAITING" && t.svc === "SPKT");
  if (S.cur[1]) { setState("CALLED", "SERVING", "TICKET_SERVING", 1); setState("SERVING", "DONE", "TICKET_DONE", 1); }
  if (waiting) callNext(1); await sleep(1800); if (!ok()) return;
  go("display"); bar(6, N, "Layar TV menampilkan panggilan", "Hanya nomor dan loket, tanpa nama"); await sleep(3200); if (!ok()) return;
  go("operator"); bar(6, N, "Layanan diselesaikan", "CALLED → SERVING → DONE"); setState("CALLED", "SERVING", "TICKET_SERVING", 1); await sleep(1400); if (!ok()) return;
  setState("SERVING", "DONE", "TICKET_DONE", 1); await sleep(1400); if (!ok()) return;
  go("polda"); bar(7, N, "Dashboard Polda ter-update", "Agregat saja, tanpa data warga"); await sleep(4200); if (!ok()) return;
  stopTour(); toast("Demo otomatis selesai. Anda bisa mengulang atau menjelajah manual.");
}

/* ---------- init ---------- */
renderPhone(); renderCodes(); renderLogs(); $("#k-quick").click(); go("home");
emit("SYSTEM_READY prototipe dimuat (data sintetis, state di memori browser)");
