# SIBATANG — Prototipe Interaktif (Demo Statis)

Prototipe presentasi sistem booking & antrean terpadu **Polres Batang** di bawah pengawasan **Polda Jawa Tengah**.

- Statis penuh: `index.html` + `assets/` (tanpa build, tanpa backend, tanpa dependensi).
- **Seluruh data sintetis.** State hanya di memori browser (refresh = reset).
- Bukan sistem produksi dan tidak terhubung ke sistem apa pun.

## Fitur demo
- **Demo otomatis**: satu klik menjalankan alur lengkap (booking → check-in → panggil → layar TV → dashboard Polda).
- Layar interaktif: Booking warga, Kiosk, Operator, Layar TV, Announcer (suara browser id-ID, opsional), Dashboard Polda, Admin, Keamanan, Roadmap.
- Panel *Event stream* di pojok kanan bawah memperlihatkan event/audit yang dihasilkan.

## Menjalankan
Buka `index.html` di browser, atau:

```bash
npx serve .
```

## Deploy ke Vercel
Import repo ini di vercel.com/new. Framework Preset: **Other**, Build Command & Output Directory dikosongkan. `vercel.json` sudah menambahkan header keamanan dan `noindex`.
