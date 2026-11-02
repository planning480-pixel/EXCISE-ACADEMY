"use client";

import { Car } from "lucide-react";
import { useMemo, useState } from "react";
import { CAR_PERIODS } from "@/content/rates";
import { adValoremTax, baht, carRate, type CarType } from "@/lib/calc";
import { CalcShell, Field, NumberInput, Row, Segmented } from "./ui";

export default function CarCalc() {
  const [type, setType] = useState<CarType>("hev");
  const [co2, setCo2] = useState(110);
  const [period, setPeriod] = useState<0 | 1 | 2>(0);
  const [over3000, setOver3000] = useState(false);
  const [longRange, setLongRange] = useState(true);
  const [srp, setSrp] = useState(1_200_000);

  const usesCo2 = type === "ice" || type === "hev";
  const r = useMemo(() => carRate({ type, co2, period, over3000cc: over3000, phevLongRange: longRange }), [type, co2, period, over3000, longRange]);
  const tax = adValoremTax(srp, r.rate);

  return (
    <CalcShell
      title="หาอัตราภาษีรถยนต์นั่ง (ตั้งแต่ปี 2569)"
      icon={<Car className="h-4 w-4" />}
      note="รถยนต์นั่งหรือรถโดยสารไม่เกิน 10 ที่นั่ง โครงสร้าง E+S ตามสไลด์หน้า 30 (รอยืนยัน) · ภาษีคิดจาก SRP ที่หัก VAT แล้ว"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <Field label="ประเภทรถ">
            <Segmented
              value={type}
              onChange={setType}
              options={[
                { value: "ice", label: "ICE" },
                { value: "hev", label: "HEV" },
                { value: "phev", label: "PHEV" },
                { value: "bev", label: "BEV" },
                { value: "fcev", label: "FCEV" },
              ]}
            />
          </Field>
          {usesCo2 && (
            <Field label={`การปล่อย CO2: ${co2} g/km`}>
              <input type="range" min={60} max={260} value={co2} onChange={(e) => setCo2(Number(e.target.value))} className="w-full accent-[var(--accent)]" aria-label="การปล่อย CO2" />
            </Field>
          )}
          {usesCo2 && (
            <Field label="ช่วงเวลา">
              <Segmented value={period} onChange={setPeriod} options={CAR_PERIODS.map((p) => ({ value: p.id, label: `ตั้งแต่ ${p.label.replace("1 ม.ค. ", "")}` }))} />
            </Field>
          )}
          {(type === "ice" || type === "hev" || type === "phev") && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={over3000} onChange={(e) => setOver3000(e.target.checked)} className="accent-[var(--accent)]" />
              เครื่องยนต์เกิน 3,000 cc
            </label>
          )}
          {type === "phev" && !over3000 && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={longRange} onChange={(e) => setLongRange(e.target.checked)} className="accent-[var(--accent)]" />
              วิ่งไฟฟ้าได้ ≥ 80 กม. และถังน้ำมัน ≤ 45 ลิตร
            </label>
          )}
          <Field label="ราคาขายปลีกแนะนำ (รวม VAT)">
            <NumberInput value={srp} onChange={setSrp} step={10000} suffix="บาท" />
          </Field>
        </div>
        <div className="rounded-2xl bg-bg-soft p-4">
          <div className="text-sm text-ink-soft">{r.reason}</div>
          <div className="font-display my-2 text-5xl font-bold text-accent">{r.rate}%</div>
          <Row label="ภาษีสรรพสามิต" value={`${baht(tax, 0)} ฿`} />
          <Row label="ภาษีเพื่อมหาดไทย 10%" value={`${baht(tax * 0.1, 0)} ฿`} muted />
          {usesCo2 && !over3000 && (
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {CAR_PERIODS.map((p) => {
                const v = carRate({ type, co2, period: p.id }).rate;
                return (
                  <div key={p.id} className={`rounded-xl px-2 py-2 ${p.id === period ? "bg-accent-soft text-accent" : "bg-surface"}`}>
                    <div className="text-[11px] text-ink-mute">{p.label}</div>
                    <div className="font-semibold tabular-nums">{v}%</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
