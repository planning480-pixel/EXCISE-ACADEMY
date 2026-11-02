import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GLOSSARY } from "@/content/glossary";
import { getRoom } from "@/content";

export const metadata: Metadata = { title: "คำศัพท์" };

export default function GlossaryPage() {
  const terms = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "th"));
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="chip mb-3">{terms.length} คำ</div>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">คำศัพท์ภาษีสรรพสามิต</h1>
        <p className="mt-3 text-ink-soft">ความหมายสั้น ๆ ของคำที่เจอบ่อย กดเพื่อไปเรียนต่อในห้องที่เกี่ยวข้อง</p>
      </div>
      <dl className="grid gap-3 md:grid-cols-2">
        {terms.map((t) => {
          const r = t.slug ? getRoom(t.slug) : undefined;
          return (
            <div key={t.term} id={encodeURIComponent(t.term)} className="card p-5">
              <dt className="font-display text-lg font-semibold">
                {t.term}
                {t.en && <span className="ml-2 text-sm font-normal text-ink-mute">{t.en}</span>}
              </dt>
              <dd className="mt-1.5 text-sm leading-7 text-ink-soft">{t.def}</dd>
              {r && (
                <Link href={`/rooms/${r.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  {r.title} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          );
        })}
      </dl>
    </div>
  );
}
