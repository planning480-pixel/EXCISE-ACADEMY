"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Icon from "./Icon";

export type FeaturedItem = {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  category: string;
  highlights: string[];
  tariff?: string;
};

export default function FeaturedCarousel({ items }: { items: FeaturedItem[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [paused, items.length]);
  const it = items[i];

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="card relative overflow-hidden p-0 shadow-[var(--shadow)]">
        {/* ภาพประกอบ: วงโคจรของไอคอนรอบห้องเด่น */}
        <div className="relative h-64 overflow-hidden bg-[radial-gradient(circle_at_50%_55%,rgba(56,189,248,0.28),transparent_60%)] sm:h-72">
          <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(var(--grid-line)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20" />
          <div className="spin-slow absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/25">
            {items.map((x, k) => {
              const a = (k / items.length) * Math.PI * 2;
              return (
                <span
                  key={x.slug}
                  className={`absolute grid h-9 w-9 place-items-center rounded-xl border transition ${k === i ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface text-ink-soft"}`}
                  style={{ left: `calc(50% + ${Math.cos(a) * 160}px - 18px)`, top: `calc(50% + ${Math.sin(a) * 160}px - 18px)` }}
                >
                  <Icon name={x.icon} className="h-4 w-4" />
                </span>
              );
            })}
          </div>
          <div key={it.slug} className="floaty absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2rem] bg-gradient-to-br from-accent to-accent-deep text-accent-ink shadow-[0_0_60px_-10px_var(--accent)]">
            <Icon name={it.icon} className="h-12 w-12" strokeWidth={1.6} />
          </div>
          {it.tariff && <span className="absolute left-4 top-4 rounded-full bg-bg/70 px-3 py-1 text-xs font-semibold backdrop-blur">{it.tariff}</span>}
          <div className="absolute right-4 top-4 flex flex-col gap-1.5">
            {it.highlights.map((h) => (
              <span key={h} className="rounded-full bg-bg/70 px-3 py-1 text-xs font-medium text-ink-soft backdrop-blur">
                {h}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-line-soft p-5 sm:flex-row sm:items-end">
          <div className="flex-1">
            <div className="chip mb-2">ห้องแนะนำ · {it.category}</div>
            <h3 className="font-display text-2xl font-bold">{it.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{it.tagline}</p>
          </div>
          <Link href={`/rooms/${it.slug}`} className="btn btn-primary shrink-0">
            เข้าห้องนี้ <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          {items.map((x, k) => (
            <button key={x.slug} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-accent" : "w-1.5 bg-line"}`} aria-label={`ห้อง ${x.title}`} />
          ))}
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setI((i - 1 + items.length) % items.length)} className="grid h-8 w-8 place-items-center rounded-full border border-line hover:border-accent" aria-label="ก่อนหน้า">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setI((i + 1) % items.length)} className="grid h-8 w-8 place-items-center rounded-full border border-line hover:border-accent" aria-label="ถัดไป">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
