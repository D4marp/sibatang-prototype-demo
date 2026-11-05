import type { ButtonHTMLAttributes, ReactNode } from "react";

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

export function PageHeader({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-[26px] font-bold tracking-tight text-navy">{title}</h1>
      <p className="mt-1 max-w-3xl text-mute">{lead}</p>
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 mt-8 text-[13px] font-bold uppercase tracking-[0.12em] text-navy">{children}</h2>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(10,31,68,.06),0_6px_20px_rgba(10,31,68,.06)]", className)}>
      {children}
    </div>
  );
}

export function Kpi({ value, label }: { value: ReactNode; label: string }) {
  return (
    <Card>
      <div className="text-3xl font-extrabold leading-tight text-navy tabular-nums">{value}</div>
      <div className="mt-1 text-[13px] text-mute">{label}</div>
    </Card>
  );
}

const pillTone = {
  neutral: "bg-slate-100 text-slate-600",
  ok: "bg-emerald-50 text-emerald-700",
  warn: "bg-amber-50 text-amber-700",
  bad: "bg-red-50 text-red-700",
  blue: "bg-blue-50 text-blue-700"
};
export function Pill({ tone = "neutral", children, className }: { tone?: keyof typeof pillTone; children: ReactNode; className?: string }) {
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold", pillTone[tone], className)}>{children}</span>;
}

export function Note({ children }: { children: ReactNode }) {
  return <div className="mt-3 rounded-r-xl border-l-[3px] border-gold bg-[#f7f4e8] px-3 py-2.5 text-[13px] text-slate-600">{children}</div>;
}

const btnTone = {
  navy: "bg-navy text-white hover:brightness-125",
  gold: "bg-gold text-[#1a1300] hover:brightness-110",
  ghost: "bg-white/10 text-white border border-white/30 hover:bg-white/20",
  sec: "bg-white text-navy border border-line hover:bg-slate-50",
  ok: "bg-ok text-white hover:brightness-110",
  bad: "bg-bad text-white hover:brightness-110"
};
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: keyof typeof btnTone; size?: "md" | "sm"; full?: boolean };
export function Button({ tone = "navy", size = "md", full, className, ...p }: BtnProps) {
  return (
    <button
      {...p}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
        size === "md" ? "px-4 py-2.5" : "px-3 py-1.5 text-[13px]",
        full && "w-full",
        btnTone[tone],
        className
      )}
    />
  );
}

export function Table({ head, children }: { head?: string[]; children: ReactNode }) {
  return (
    <table className="w-full text-left text-[13.5px]">
      {head && (
        <thead>
          <tr>{head.map(h => <th key={h} className="border-b border-line px-2 py-2 text-[11.5px] font-bold uppercase tracking-wider text-mute">{h}</th>)}</tr>
        </thead>
      )}
      <tbody className="[&_td]:border-b [&_td]:border-line [&_td]:px-2 [&_td]:py-2.5 [&_tr:last-child_td]:border-0">{children}</tbody>
    </table>
  );
}

export const inputCls = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-ink outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30";
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="mt-3 block text-xs font-semibold text-mute"><span className="mb-1.5 block">{label}</span>{children}</label>;
}
