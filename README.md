# SIBATANG — Prototipe Interaktif (Next.js + Tailwind, statis)

Prototipe presentasi sistem booking & antrean terpadu **Polres Batang** di bawah pengawasan **Polda Jawa Tengah**.

- Next.js (App Router, TypeScript) + Tailwind CSS v4, diekspor **statis** (`output: "export"`), tanpa backend.
- **Seluruh data sintetis.** State hanya di memori browser (refresh = reset). Bukan sistem produksi.

## Fitur
- **Demo otomatis**: satu klik menjalankan alur lengkap (booking → check-in → panggil → TV → dashboard Polda).
- Layar: Booking warga, Kiosk, Operator, Layar TV, Announcer, Dashboard Polda, Admin, Keamanan, Roadmap.
- **Announcer suara**: TTS browser (id-ID) + bunyi "ding-dong". Klik **Aktifkan suara** di header (browser mewajibkan interaksi pengguna). Demo otomatis menyalakannya sendiri. Bila suara bahasa Indonesia belum terpasang di OS, tambahkan *Bahasa Indonesia* di pengaturan bahasa Windows.
- Panel **Event stream** (kanan bawah) memperlihatkan event/audit yang dihasilkan.

## Menjalankan
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # hasil statis di ./out
```

## Deploy ke Vercel
Import repo ini di vercel.com/new. Framework terdeteksi otomatis sebagai **Next.js**; tidak perlu pengaturan tambahan. `vercel.json` menambahkan header keamanan dan `noindex`.
