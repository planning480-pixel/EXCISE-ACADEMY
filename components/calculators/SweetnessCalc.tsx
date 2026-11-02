"use client";

import { CupSoda } from "lucide-react";
import { useMemo, useState } from "react";
import { BEVERAGE_TYPES, SWEETNESS_BANDS, SWEETNESS_PHASES } from "@/content/rates";
import { adValoremTax, baht, sugarBandIndex, sugarRate } from "@/lib/calc";
import { CalcShell, Field, NumberInput, Row, Segmented, Select } from "./ui";

export default function SweetnessCalc() {
  const [type, setType] = useState("soft");
  const [sugar, setSugar] = useState(9);
  const [volume, setVolume] = useState(325);
  const [srp, setSrp] = useState(15);
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(4);

  const bev = BEVERAGE_TYPES.find((b) => b.id === type)!;
  const r = useMemo(() => {
    const perL = bev.sugarTax ? sugarRate(sugar, phase) : 0;
    const sugarTax = perL * (volume / 1000);
    const advTax = adValoremTax(srp, bev.adValorem);
    return { perL, sugarTax, advTax, total: sugarTax + advTax, band: sugarBandIndex(sugar) };
  }, [bev, sugar, volume, srp, phase]);

  return (
    <CalcShell
      title="เครื่องคำนวณภาษีเครื่องดื่มและภาษีความหวาน"
      icon={<CupSoda className="h-4 w-4" />}
      note="ภาษีความหวานคิดตามปริมาตร (ลิตร) × อัตราตามช่วงน้ำตาล · ยังไม่รวมภาษีเพื่อมหาดไทย 10%"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <Field label="ประเภทเครื่องดื่ม">
            <Select value={type} onChange={setType} options={BEVERAGE_TYPES.map((b) => ({ value: b.id, label: `${b.name} (${b.adValorem}%)` }))} />
          </Field>
          <Field label={`ปริมาณน้ำตาล: ${sugar} กรัม/100 มล.`} hint={SWEETNESS_BANDS[r.band].label}>
            <input
              type="range"
              min={0}
              max={25}
              step={0.5}
              value={sugar}
              onChange={(e) => setSugar(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
              aria-label="ปริมาณน้ำตาล"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ปริมาตรต่อภาชนะ">
              <NumberInput value={volume} onChange={setVolume} suffix="มล." />
            </Field>
            <Field label="ราคาขายปลีกแนะนำ">
              <NumberInput value={srp} onChange={setSrp} suffix="บาท" />
            </Field>
          </div>
          <Field label="ระยะการจัดเก็บ">
            <Segmented value={phase} onChange={setPhase} options={SWEETNESS_PHASES.map((p) => ({ value: p.id, label: p.label.replace("ระยะที่ ", "ระยะ ") }))} />
          </Field>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-bg-soft p-4">
            <Row label="อัตราภาษีความหวาน" value={bev.sugarTax ? `${baht(r.perL)} บาท/ลิตร` : "ไม่เสีย"} />
            <Row label="ภาษีความหวานต่อภาชนะ" value={`${baht(r.sugarTax)} ฿`} />
            <Row label={`ภาษีตามมูลค่า ${bev.adValorem}%`} value={`${baht(r.advTax)} ฿`} />
            <div className="my-2 border-t border-line-soft" />
            <Row label="ภาษีสรรพสามิตต่อภาชนะ" value={`${baht(r.total)} ฿`} strong />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-ink-mute">อัตราภาษีความหวานของน้ำตาลระดับนี้ในแต่ละระยะ</p>
            <div className="flex h-24 items-end gap-2">
              {SWEETNESS_PHASES.map((p) => {
                const v = bev.sugarTax ? sugarRate(sugar, p.id) : 0;
                return (
                  <div key={p.id} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs tabular-nums text-ink-soft">{v}</span>
                    <div
                      className={`w-full rounded-t-lg ${p.id === phase ? "bg-accent" : "bg-surface-2"}`}
                      style={{ height: `${Math.max(4, (v / 5) * 64)}px` }}
                    />
                    <span className="text-[11px] text-ink-mute">{p.label.replace("ระยะที่ ", "ระยะ ")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </CalcShell>
  );
}
