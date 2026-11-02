"use client";

import type { ReactNode } from "react";

export function CalcShell({ title, icon, children, note }: { title: string; icon?: ReactNode; children: ReactNode; note?: string }) {
  return (
    <section className="card not-prose overflow-hidden">
      <header className="flex items-center gap-2.5 border-b border-line-soft bg-surface-2/60 px-5 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-soft text-accent">{icon}</span>
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <span className="chip ml-auto">ลองเอง</span>
      </header>
      <div className="p-5">{children}</div>
      {note && <p className="border-t border-line-soft px-5 py-3 text-xs text-ink-mute">{note}</p>}
    </section>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="block text-xs text-ink-mute">{hint}</span>}
    </label>
  );
}

export function NumberInput({
  value,
  onChange,
  step = 1,
  min = 0,
  suffix,
}: {
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        className="input pr-14 tabular-nums"
        value={Number.isFinite(value) ? value : ""}
        step={step}
        min={min}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
      {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-mute">{suffix}</span>}
    </div>
  );
}

export function Select<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <select className="input" value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Row({ label, value, strong, muted }: { label: ReactNode; value: ReactNode; strong?: boolean; muted?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 py-1.5 ${muted ? "text-ink-mute text-sm" : ""}`}>
      <span className={strong ? "font-semibold" : "text-ink-soft"}>{label}</span>
      <span className={`tabular-nums ${strong ? "font-display text-xl font-bold text-accent" : "font-medium"}`}>{value}</span>
    </div>
  );
}

export function Segmented<T extends string | number>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-2xl bg-bg-soft p-1">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-xl px-3 py-1.5 text-sm font-medium transition ${
            o.value === value ? "bg-accent text-accent-ink" : "text-ink-soft hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
