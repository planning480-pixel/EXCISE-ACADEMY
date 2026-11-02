// ฟังก์ชันคำนวณภาษี ใช้ร่วมกันทั้งเครื่องคำนวณและแบบทดสอบ
import {
  CAR_CO2_BANDS,
  CAR_ELECTRIC,
  CAR_OVER_3000CC,
  EARMARK,
  SWEETNESS_BANDS,
  VAT_RATE,
} from "@/content/rates";

/** ฐานภาษีตามมูลค่า: ตัด VAT ออกจากราคาขายปลีกแนะนำ */
export function exVat(priceInclVat: number): number {
  return (priceInclVat * 100) / (100 + VAT_RATE * 100);
}

/** ภาษีตามมูลค่า จาก SRP (รวม VAT) และอัตราร้อยละ */
export function adValoremTax(srpInclVat: number, ratePct: number): number {
  return exVat(srpInclVat) * (ratePct / 100);
}

/** ภาษีตามปริมาณ */
export function specificTax(quantity: number, ratePerUnit: number): number {
  return quantity * ratePerUnit;
}

/** ลิตรแห่งแอลกอฮอล์บริสุทธิ์ */
export function pureAlcoholLitres(volumeMl: number, abvPct: number): number {
  return (volumeMl / 1000) * (abvPct / 100);
}

export type EarmarkKind = "liquor-tobacco" | "other";

export function earmarkBreakdown(exciseTax: number, kind: EarmarkKind) {
  const interior = exciseTax * EARMARK.interior;
  if (kind === "other") return { interior, thaiHealth: 0, sport: 0, elderly: 0, thaiPbs: 0, total: interior };
  const thaiHealth = exciseTax * EARMARK.thaiHealth;
  const sport = exciseTax * EARMARK.sport;
  const elderly = exciseTax * EARMARK.elderly;
  const thaiPbs = exciseTax * EARMARK.thaiPbs;
  return { interior, thaiHealth, sport, elderly, thaiPbs, total: interior + thaiHealth + sport + elderly + thaiPbs };
}

/** อัตราภาษีความหวาน (บาท/ลิตร) ตามน้ำตาล กรัม/100 มล. และระยะ (1–4) */
export function sugarRate(sugarPer100ml: number, phase: 1 | 2 | 3 | 4): number {
  const band = SWEETNESS_BANDS.find((b) => sugarPer100ml <= b.maxSugar) ?? SWEETNESS_BANDS[SWEETNESS_BANDS.length - 1];
  return band.rates[phase - 1];
}

export function sugarBandIndex(sugarPer100ml: number): number {
  const i = SWEETNESS_BANDS.findIndex((b) => sugarPer100ml <= b.maxSugar);
  return i === -1 ? SWEETNESS_BANDS.length - 1 : i;
}

export type CarType = "ice" | "hev" | "phev" | "bev" | "fcev";

/** อัตราภาษีรถยนต์นั่ง (ร้อยละ) โครงสร้าง E+S ตั้งแต่ปี 2569 */
export function carRate(opts: {
  type: CarType;
  co2: number;
  period: 0 | 1 | 2;
  over3000cc?: boolean;
  phevLongRange?: boolean;
}): { rate: number; reason: string } {
  const { type, co2, period, over3000cc, phevLongRange } = opts;
  if (type === "bev") return { rate: CAR_ELECTRIC.bev, reason: "รถยนต์ไฟฟ้าแบตเตอรี่ (BEV)" };
  if (type === "fcev") return { rate: CAR_ELECTRIC.fcev, reason: "รถยนต์เซลล์เชื้อเพลิง (FCEV)" };
  if (type === "phev") {
    if (over3000cc) return { rate: CAR_OVER_3000CC.phev, reason: "PHEV เกิน 3,000 cc" };
    return phevLongRange
      ? { rate: CAR_ELECTRIC.phevLongRange, reason: "PHEV ระยะวิ่งไฟฟ้า ≥ 80 กม. และถังน้ำมัน ≤ 45 ลิตร" }
      : { rate: CAR_ELECTRIC.phevOther, reason: "PHEV ระยะวิ่งไฟฟ้า < 80 กม. หรือถังน้ำมัน > 45 ลิตร" };
  }
  if (over3000cc) {
    return type === "hev"
      ? { rate: CAR_OVER_3000CC.hev, reason: "HEV เกิน 3,000 cc" }
      : { rate: CAR_OVER_3000CC.ice, reason: "ICE เกิน 3,000 cc" };
  }
  const band = CAR_CO2_BANDS.find((b) => co2 <= b.max) ?? CAR_CO2_BANDS[CAR_CO2_BANDS.length - 1];
  const rate = type === "hev" ? band.hev[period] : band.ice[period];
  return { rate, reason: `${type === "hev" ? "HEV" : "ICE"} CO2 ${band.label}` };
}

/** ภาษีคาร์บอน = Emission Factor × ราคาคาร์บอน */
export function carbonTax(emissionFactor: number, carbonPrice: number): number {
  return emissionFactor * carbonPrice;
}

/** ปัดทศนิยมสำหรับแสดงผล */
export function round(n: number, d = 2): number {
  const p = 10 ** d;
  return Math.round((n + Number.EPSILON) * p) / p;
}

export function baht(n: number, d = 2): string {
  return n.toLocaleString("th-TH", { minimumFractionDigits: d, maximumFractionDigits: d });
}
