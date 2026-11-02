"use client";

import { useMemo, useState } from "react";
import { adValoremTax, baht, earmarkBreakdown, exVat, pureAlcoholLitres, sugarRate, type EarmarkKind } from "@/lib/calc";

type Product = {
  id: string;
  label: string;
  min: number;
  max: number;
  srp: number;
  adv: number;
  specific: () => number;
  kind: EarmarkKind;
  formula: string;
};

const PRODUCTS: Product[] = [
  { id: "beer", label: "เบียร์กระป๋อง", min: 30, max: 90, srp: 45, adv: 22, specific: () => pureAlcoholLitres(320, 5) * 430, kind: "liquor-tobacco", formula: "320 มล. 5% · 22% + 430 บาท/ลิตรแอลกอฮอล์" },
  { id: "cig", label: "บุหรี่ 1 ซอง", min: 50, max: 160, srp: 70, adv: 25, specific: () => 20 * 1.25, kind: "liquor-tobacco", formula: "20 มวน · 25% (≤72 บาท) หรือ 42% + 1.25 บาท/มวน" },
  { id: "soda", label: "น้ำอัดลมขวด", min: 10, max: 40, srp: 15, adv: 14, specific: () => sugarRate(9, 4) * 0.325, kind: "other", formula: "325 มล. น้ำตาล 9 ก./100 มล. · 14% + 3 บาท/ลิตร" },
  { id: "whisky", label: "สุรากลั่น 1 ขวด", min: 250, max: 1500, srp: 450, adv: 20, specific: () => pureAlcoholLitres(700, 40) * 255, kind: "liquor-tobacco", formula: "700 มล. 40 ดีกรี · 20% + 255 บาท/ลิตรแอลกอฮอล์" },
];

export default function PriceBreakdown({ compact = false }: { compact?: boolean }) {
  const [pid, setPid] = useState("beer");
  const p = PRODUCTS.find((x) => x.id === pid)!;
  const [srp, setSrp] = useState(p.srp);

  const r = useMemo(() => {
    const adv = p.id === "cig" && srp > 72 ? 42 : p.adv;
    const excise = adValoremTax(srp, adv) + p.specific();
    const ear = earmarkBreakdown(excise, p.kind).total;
    const vat = srp - exVat(srp);
    const rest = Math.max(0, srp - vat - excise - ear);
    return { excise, ear, vat, rest, adv };
  }, [p, srp]);

  const parts = [
    { label: "ภาษีสรรพสามิต", value: r.excise, cls: "bg-accent" },
    { label: "Earmark", value: r.ear, cls: "bg-accent-deep" },
    { label: "VAT", value: r.vat, cls: "bg-ink-mute" },
    { label: "ต้นทุน + กำไร", value: r.rest, cls: "bg-surface-2" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRODUCTS.map((x) => (
          <button
            key={x.id}
            onClick={() => {
              setPid(x.id);
              setSrp(x.srp);
            }}
            className={`rounded-full border px-3 py-1 text-sm transition ${x.id === pid ? "border-accent bg-accent-soft text-accent" : "border-line text-ink-soft hover:border-accent"}`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-sm text-ink-soft">ราคาขายปลีก</span>
          <span className="font-display text-2xl font-bold tabular-nums">{baht(srp, 0)} ฿</span>
        </div>
        <input type="range" min={p.min} max={p.max} value={srp} onChange={(e) => setSrp(Number(e.target.value))} className="w-full accent-[var(--accent)]" aria-label="ราคาขายปลีก" />
      </div>
      <div className="flex h-10 overflow-hidden rounded-xl border border-line-soft" role="img" aria-label="สัดส่วนราคา">
        {parts.map((x) => (
          <div key={x.label} className={`${x.cls} transition-all duration-300`} style={{ width: `${(x.value / srp) * 100}%` }} title={`${x.label} ${baht(x.value)} บาท`} />
        ))}
      </div>
      <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
        {parts.map((x) => (
          <div key={x.label} className="flex items-start gap-2">
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${x.cls} border border-line-soft`} />
            <div>
              <div className="text-xs text-ink-mute">{x.label}</div>
              <div className="font-semibold tabular-nums">
                {baht(x.value)} <span className="text-xs font-normal text-ink-mute">({baht((x.value / srp) * 100, 0)}%)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-ink-mute">
        {p.formula}
        {p.id === "cig" && srp > 72 && " · ตอนนี้ราคาเกิน 72 บาท จึงใช้อัตรา 42%"}
      </p>
    </div>
  );
}
