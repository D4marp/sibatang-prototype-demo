"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { VoiceToggle } from "@/components/Shell";
import { Button, Note, PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function Tv() {
  const { hist, callPulse, voice } = useStore();
  const [clock, setClock] = useState("");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = () => setClock(new Date().toLocaleTimeString("id-ID") + " WIB");
    f(); const t = setInterval(f, 1000); return () => clearInterval(t);
  }, []);
  const last = hist[0];
  return (
    <>
      <PageHeader title="Layar TV Ruang Tunggu" lead="Tampilan publik: hanya nomor dan loket. Tanpa nama, NIK, atau data pribadi lain." />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <VoiceToggle />
        <Button tone="sec" size="sm" onClick={() => box.current?.requestFullscreen?.()}><Icon name="maximize" className="h-4 w-4" /> Layar penuh</Button>
        <span className="text-[13px] text-mute">{voice.enabled ? "Panggilan akan dibacakan otomatis." : "Aktifkan suara agar panggilan dibacakan."}</span>
      </div>
      <div ref={box} className="grid aspect-video min-h-[360px] grid-cols-[1.5fr_1fr] grid-rows-[1fr_auto] gap-4 rounded-2xl border-[10px] border-[#151d33] bg-[#050a18] p-5 text-white shadow-xl max-sm:aspect-auto max-sm:grid-cols-1">
        <div key={callPulse} className={`flex flex-col items-center justify-center rounded-2xl border-2 border-gold bg-gradient-to-br from-[#0f3a7a] to-navy text-center ${callPulse ? "ring-call" : ""}`}>
          {last ? (
            <>
              <div className="text-[clamp(14px,2.2vw,30px)] tracking-[0.2em] text-[#dce6ff]">NOMOR ANTREAN</div>
              <div className="text-[clamp(54px,9vw,130px)] font-black leading-none text-gold2">{last.no}</div>
              <div className="text-[clamp(16px,2.6vw,34px)] tracking-[0.2em] text-[#dce6ff]">LOKET {last.c}</div>
            </>
          ) : <div className="text-[clamp(16px,2.6vw,34px)] tracking-[0.2em] text-[#8fa6d6]">MENUNGGU PANGGILAN</div>}
        </div>
        <div>
          <h4 className="mb-2.5 text-[clamp(12px,1.5vw,20px)] font-bold uppercase tracking-[0.15em] text-gold2">Panggilan terakhir</h4>
          {hist.slice(1, 5).map((h, i) => (
            <div key={i} className="mb-2 flex justify-between rounded-xl bg-[#0f1a36] px-4 py-2.5 text-[clamp(14px,1.9vw,24px)]"><b>{h.no}</b><span>Loket {h.c}</span></div>
          ))}
          {hist.length < 2 && <div className="rounded-xl bg-[#0f1a36] px-4 py-2.5 text-[#667]">—</div>}
        </div>
        <div className="col-span-full flex justify-between border-t border-[#1d2a4d] pt-2 text-[clamp(10px,1.2vw,15px)] text-[#7f92bd]">
          <span>POLRES BATANG · SIBATANG</span><span>{clock}</span>
        </div>
      </div>
      <Note><b>Resilien:</b> layar menyegarkan diri dari snapshot saat koneksi SSE terputus, tidak bergantung pada event yang terlewat.</Note>
    </>
  );
}
