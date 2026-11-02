import Link from "next/link";
import { AlertTriangle, ArrowRight, ClipboardCheck, Info, Lightbulb } from "lucide-react";
import type { Block } from "@/content/types";
import { getRoom } from "@/content";
import Rich from "./Rich";
import Icon from "./Icon";
import DataTable from "./DataTable";
import CalculatorBlock from "./calculators";

const TONES = {
  info: { cls: "border-accent/40 bg-accent-soft", icon: Info, color: "text-accent" },
  tip: { cls: "border-good/40 bg-good/10", icon: Lightbulb, color: "text-good" },
  warn: { cls: "border-warn/40 bg-warn/10", icon: AlertTriangle, color: "text-warn" },
  review: { cls: "border-review/40 bg-review/10", icon: ClipboardCheck, color: "text-review" },
};

export function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case "p":
      return (
        <p className="text-[1.02rem] leading-8 text-ink-soft">
          <Rich text={b.text} />
        </p>
      );
    case "list": {
      const L = b.ordered ? "ol" : "ul";
      return (
        <L className={`space-y-2 pl-5 text-ink-soft ${b.ordered ? "list-decimal" : "list-disc marker:text-accent"}`}>
          {b.items.map((it, i) => (
            <li key={i} className="pl-1 leading-7">
              <Rich text={it} />
            </li>
          ))}
        </L>
      );
    }
    case "table":
      return (
        <figure className="prose-room">
          {b.caption && <figcaption className="mb-2 text-sm font-semibold text-ink-soft">{b.caption}</figcaption>}
          <div className="overflow-x-auto rounded-2xl border border-line-soft">
            <table>
              <thead>
                <tr>
                  {b.head.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j} className={j === 0 ? "font-medium text-ink" : "text-ink-soft"}>
                        <Rich text={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.note && <p className="mt-2 text-xs text-ink-mute">{b.note}</p>}
        </figure>
      );
    case "callout": {
      const t = TONES[b.tone];
      const I = t.icon;
      return (
        <div className={`flex gap-3 rounded-2xl border p-4 ${t.cls}`}>
          <I className={`mt-0.5 h-5 w-5 shrink-0 ${t.color}`} />
          <div className="text-sm leading-7">
            {b.title && <div className="font-semibold text-ink">{b.title}</div>}
            <div className="text-ink-soft">
              <Rich text={b.text} />
            </div>
          </div>
        </div>
      );
    }
    case "formula":
      return (
        <div className="rounded-2xl border border-line-soft bg-bg-soft p-4">
          {b.label && <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">{b.label}</div>}
          <div className="space-y-1 font-mono text-sm leading-7 text-ink">
            {b.lines.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </div>
      );
    case "stats":
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {b.items.map((s, i) => (
            <div key={i} className="rounded-2xl border border-line-soft bg-bg-soft p-4">
              <div className="font-display text-2xl font-bold text-accent tabular-nums">{s.value}</div>
              <div className="text-xs text-ink-mute">{s.label}</div>
            </div>
          ))}
        </div>
      );
    case "steps":
      return (
        <ol className="relative space-y-4 border-l-2 border-line pl-6">
          {b.items.map((s, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[33px] grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-accent-ink">{i + 1}</span>
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm leading-7 text-ink-soft">
                <Rich text={s.text} />
              </div>
            </li>
          ))}
        </ol>
      );
    case "cards":
      return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {b.items.map((c, i) => (
            <div key={i} className="rounded-2xl border border-line-soft bg-bg-soft p-4">
              {c.icon && (
                <span className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
              )}
              <div className="font-semibold">{c.title}</div>
              <div className="mt-1 text-sm leading-6 text-ink-soft">
                <Rich text={c.text} />
              </div>
            </div>
          ))}
        </div>
      );
    case "calculator":
      return <CalculatorBlock id={b.id} />;
    case "dataTable":
      return <DataTable id={b.id} />;
    case "links":
      return (
        <div className="flex flex-wrap gap-2">
          {b.items.map((l) => {
            const r = getRoom(l.slug);
            if (!r) return null;
            return (
              <Link key={l.slug} href={`/rooms/${r.slug}`} className="group inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm hover:border-accent hover:text-accent">
                <Icon name={r.icon} className="h-4 w-4 text-accent" />
                {l.label ?? r.title}
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      );
  }
}
