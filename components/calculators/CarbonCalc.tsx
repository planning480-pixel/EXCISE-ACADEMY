"use client";

import { Leaf } from "lucide-react";
import { useMemo, useState } from "react";
import { CARBON_PRICE, EMISSION_FACTORS } from "@/content/rates";
import { baht, carbonTax } from "@/lib/calc";
import { CalcShell, Field, NumberInput, Row, Select } from "./ui";

export default function CarbonCalc() {
  const [fuel, setFuel] = useState("diesel");
  const [price, setPrice] = useState(CARBON_PRICE);
  const [qty, setQty] = useState(1000);
  const f = EMISSION_FACTORS.find((e) => e.id === fuel)!;

  const r = useMemo(() => {
    const perUnit = carbonTax(f.factor, price);
    return { perUnit, total: perUnit * qty, share: (perUnit / f.exciseRate) * 100, tco2: f.factor * qty };
  }, [f, price, qty]);

  return (
    <CalcShell
      title="เครื่องคำนวณภาษีคาร์บอน"
      icon={<Leaf className="h-4 w-4" />}
      note="ภาษีคาร์บอน = ราคาคาร์บอน × Emission Factor · ราคาที่ประกาศใช้คือ 200 บาท/tCO2eq ลองเลื่อนเพื่อดูผลของราคาอื่น"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <Field label="เชื้อเพลิง">
            <Select value={fuel} onChange={setFuel} options={EMISSION_FACTORS.map((e) => ({ value: e.id, label: `${e.name} (${e.factor} tCO2eq/${e.unit})` }))} />
          </Field>
          <Field label={`ราคาคาร์บอน: ${baht(price, 0)} บาท/tCO2eq`} hint="ญี่ปุ่น ~US$3 · สิงคโปร์ ~US$20 · สวีเดน ~US$127">
            <input type="range" min={0} max={4000} step={50} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-[var(--accent)]" aria-label="ราคาคาร์บอน" />
          </Field>
          <Field label={`ปริมาณ (${f.unit})`}>
            <NumberInput value={qty} onChange={setQty} suffix={f.unit} />
          </Field>
        </div>
        <div className="rounded-2xl bg-bg-soft p-4">
          <Row label={`ภาษีคาร์บอนต่อ${f.unit}`} value={`${baht(r.perUnit, 3)} ฿`} strong />
          <Row label={`อัตราภาษีสรรพสามิตปัจจุบัน`} value={`${f.exciseRate} ฿/${f.unit}`} />
          <Row label="สัดส่วนคาร์บอนในอัตราปัจจุบัน" value={`${baht(r.share, 1)}%`} />
          <div className="my-2 border-t border-line-soft" />
          <Row label={`ปล่อย CO2 จาก ${baht(qty, 0)} ${f.unit}`} value={`${baht(r.tco2, 2)} tCO2eq`} />
          <Row label="ภาษีคาร์บอนรวม" value={`${baht(r.total)} ฿`} />
          {r.share > 100 && <p className="mt-2 text-xs text-warn">ราคานี้ทำให้ภาษีคาร์บอนสูงกว่าอัตราภาษีสรรพสามิตปัจจุบัน</p>}
        </div>
      </div>
    </CalcShell>
  );
}
