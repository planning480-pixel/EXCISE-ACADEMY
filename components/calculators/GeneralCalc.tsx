"use client";

import { Calculator } from "lucide-react";
import { useMemo, useState } from "react";
import { adValoremTax, baht, earmarkBreakdown, pureAlcoholLitres, type EarmarkKind } from "@/lib/calc";
import { CalcShell, Field, NumberInput, Row, Select } from "./ui";

type Mode = "none" | "unit" | "alcohol";

type Preset = {
  id: string;
  label: string;
  srp: number;
  adv: number;
  mode: Mode;
  qty?: number;
  rate?: number;
  unitLabel?: string;
  volume?: number;
  abv?: number;
  kind: EarmarkKind;
};

const PRESETS: Preset[] = [
  { id: "beer", label: "เบียร์ 5% กระป๋อง 320 มล.", srp: 45, adv: 22, mode: "alcohol", volume: 320, abv: 5, rate: 430, kind: "liquor-tobacco" },
  { id: "whisky", label: "สุรากลั่น 40 ดีกรี 700 มล.", srp: 450, adv: 20, mode: "alcohol", volume: 700, abv: 40, rate: 255, kind: "liquor-tobacco" },
  { id: "white", label: "สุราขาว 40 ดีกรี 625 มล.", srp: 120, adv: 2, mode: "alcohol", volume: 625, abv: 40, rate: 155, kind: "liquor-tobacco" },
  { id: "cig70", label: "บุหรี่ 20 มวน ราคา 70 บาท", srp: 70, adv: 25, mode: "unit", qty: 20, rate: 1.25, unitLabel: "มวน", kind: "liquor-tobacco" },
  { id: "cig75", label: "บุหรี่ 20 มวน ราคา 75 บาท", srp: 75, adv: 42, mode: "unit", qty: 20, rate: 1.25, unitLabel: "มวน", kind: "liquor-tobacco" },
  { id: "battery", label: "แบตเตอรี่ ราคา 1,070 บาท", srp: 1070, adv: 8, mode: "none", kind: "other" },
  { id: "perfume", label: "น้ำหอม ราคา 3,210 บาท", srp: 3210, adv: 8, mode: "none", kind: "other" },
  { id: "diesel", label: "ดีเซล B7 1,000 ลิตร", srp: 0, adv: 0, mode: "unit", qty: 1000, rate: 6.92, unitLabel: "ลิตร", kind: "other" },
  { id: "custom", label: "กำหนดเอง", srp: 100, adv: 10, mode: "none", kind: "other" },
];

export default function GeneralCalc() {
  const [presetId, setPresetId] = useState("beer");
  const [srp, setSrp] = useState(45);
  const [adv, setAdv] = useState(22);
  const [mode, setMode] = useState<Mode>("alcohol");
  const [qty, setQty] = useState(20);
  const [rate, setRate] = useState(430);
  const [unitLabel, setUnitLabel] = useState("หน่วย");
  const [volume, setVolume] = useState(320);
  const [abv, setAbv] = useState(5);
  const [kind, setKind] = useState<EarmarkKind>("liquor-tobacco");

  function applyPreset(id: string) {
    const p = PRESETS.find((x) => x.id === id)!;
    setPresetId(id);
    setSrp(p.srp);
    setAdv(p.adv);
    setMode(p.mode);
    setKind(p.kind);
    if (p.qty !== undefined) setQty(p.qty);
    if (p.rate !== undefined) setRate(p.rate);
    if (p.unitLabel) setUnitLabel(p.unitLabel);
    if (p.volume !== undefined) setVolume(p.volume);
    if (p.abv !== undefined) setAbv(p.abv);
  }

  const r = useMemo(() => {
    const advTax = adValoremTax(srp, adv);
    const lap = pureAlcoholLitres(volume, abv);
    const specTax = mode === "unit" ? qty * rate : mode === "alcohol" ? lap * rate : 0;
    const excise = advTax + specTax;
    const ear = earmarkBreakdown(excise, kind);
    return { advTax, specTax, excise, ear, lap, total: excise + ear.total };
  }, [srp, adv, mode, qty, rate, volume, abv, kind]);

  return (
    <CalcShell
      title="เครื่องคำนวณภาษีสรรพสามิต (ระบบผสม + Earmark)"
      icon={<Calculator className="h-4 w-4" />}
      note="ใช้เพื่อการเรียนรู้ ภาษีตามมูลค่าคิดจาก SRP ที่หัก VAT 7% แล้ว · Earmark สุรา/ยาสูบ 17.5% สินค้าอื่น 10% (ภาษีเพื่อมหาดไทย)"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <Field label="ตัวอย่างสินค้า">
            <Select value={presetId} onChange={applyPreset} options={PRESETS.map((p) => ({ value: p.id, label: p.label }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ราคาขายปลีกแนะนำ (รวม VAT)">
              <NumberInput value={srp} onChange={setSrp} suffix="บาท" />
            </Field>
            <Field label="อัตราตามมูลค่า">
              <NumberInput value={adv} onChange={setAdv} step={0.5} suffix="%" />
            </Field>
          </div>
          <Field label="อัตราตามปริมาณ">
            <Select
              value={mode}
              onChange={setMode}
              options={[
                { value: "none", label: "ไม่มี" },
                { value: "unit", label: "ต่อหน่วย (มวน ลิตร กรัม ...)" },
                { value: "alcohol", label: "ต่อลิตรแห่งแอลกอฮอล์บริสุทธิ์ (สุรา)" },
              ]}
            />
          </Field>
          {mode === "unit" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label={`จำนวน (${unitLabel})`}>
                <NumberInput value={qty} onChange={setQty} />
              </Field>
              <Field label={`อัตรา (บาท/${unitLabel})`}>
                <NumberInput value={rate} onChange={setRate} step={0.01} />
              </Field>
            </div>
          )}
          {mode === "alcohol" && (
            <div className="grid grid-cols-3 gap-3">
              <Field label="ปริมาตร">
                <NumberInput value={volume} onChange={setVolume} suffix="มล." />
              </Field>
              <Field label="ดีกรี">
                <NumberInput value={abv} onChange={setAbv} step={0.1} suffix="%" />
              </Field>
              <Field label="อัตรา">
                <NumberInput value={rate} onChange={setRate} suffix="บาท" />
              </Field>
            </div>
          )}
          <Field label="ประเภท Earmark">
            <Select
              value={kind}
              onChange={setKind}
              options={[
                { value: "liquor-tobacco", label: "สุรา / ยาสูบ (17.5%)" },
                { value: "other", label: "สินค้าและบริการอื่น (10%)" },
              ]}
            />
          </Field>
        </div>

        <div className="rounded-2xl bg-bg-soft p-4">
          <Row label="ภาษีตามมูลค่า" value={`${baht(r.advTax)} ฿`} />
          {srp > 0 && adv > 0 && (
            <p className="-mt-1 pb-1 text-xs text-ink-mute">
              ({baht(srp)} × 100/107) × {adv}%
            </p>
          )}
          <Row label="ภาษีตามปริมาณ" value={`${baht(r.specTax)} ฿`} />
          {mode === "alcohol" && (
            <p className="-mt-1 pb-1 text-xs text-ink-mute">
              {baht(r.lap, 4)} ลิตรแอลกอฮอล์บริสุทธิ์ × {rate} บาท
            </p>
          )}
          <div className="my-2 border-t border-line-soft" />
          <Row label="ภาษีสรรพสามิต" value={`${baht(r.excise)} ฿`} strong />
          <Row label="ภาษีเพื่อมหาดไทย 10%" value={baht(r.ear.interior)} muted />
          {kind === "liquor-tobacco" && (
            <>
              <Row label="สสส. 2%" value={baht(r.ear.thaiHealth)} muted />
              <Row label="กองทุนกีฬา 2%" value={baht(r.ear.sport)} muted />
              <Row label="กองทุนผู้สูงอายุ 2%" value={baht(r.ear.elderly)} muted />
              <Row label="Thai PBS 1.5%" value={baht(r.ear.thaiPbs)} muted />
            </>
          )}
          <div className="my-2 border-t border-line-soft" />
          <Row label="รวมภาระภาษีที่เกี่ยวข้อง" value={`${baht(r.total)} ฿`} />
          {srp > 0 && (
            <p className="mt-2 text-xs text-ink-mute">คิดเป็น {baht((r.total / srp) * 100, 1)}% ของราคาขายปลีกแนะนำ (ยังไม่รวม VAT)</p>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
