import { describe, expect, it } from "vitest";
import {
  adValoremTax,
  carRate,
  carbonTax,
  earmarkBreakdown,
  pureAlcoholLitres,
  round,
  specificTax,
  sugarRate,
} from "./calc";

// ตัวอย่างทั้งหมดมาจากสไลด์ต้นทาง
describe("ตัวอย่างในสไลด์", () => {
  it("SRP 100 บาท อัตรา 10% → 9.345 บาท (บทบาท น.41)", () => {
    // สไลด์ปัดฐานภาษีเป็น 93.45 ก่อนคูณ จึงได้ 9.345 ส่วนการคำนวณเต็มได้ 9.3458
    expect(adValoremTax(100, 10)).toBeCloseTo(9.345, 2);
  });

  it("บุหรี่ 20 มวน × 1.25 = 25 บาท", () => {
    expect(specificTax(20, 1.25)).toBe(25);
  });

  it("สุรา 40 ดีกรี 330 มล. × 150 บาท = 19.8 บาท", () => {
    expect(round(specificTax(pureAlcoholLitres(330, 40), 150), 2)).toBe(19.8);
  });

  it("Earmark น้ำมัน 7 บาท → 0.7 บาท", () => {
    expect(round(earmarkBreakdown(7, "other").total, 2)).toBe(0.7);
  });

  // สไลด์ พ.ร.บ. น.71: ภาษี 100 บาท → สุรา/ยาสูบ 117.5 บาท (17.5%)
  // ส่วนสไลด์บทบาทฯ น.25 ใช้ 17% (เบียร์ 4.25, บุหรี่ 5.10) จึงติดป้ายรอตรวจไว้
  it("Earmark สุรา/ยาสูบ ภาษี 100 บาท → 17.5 บาท", () => {
    expect(round(earmarkBreakdown(100, "liquor-tobacco").total, 2)).toBe(17.5);
  });

  it("Earmark สินค้าอื่น ภาษี 100 บาท → 10 บาท", () => {
    expect(round(earmarkBreakdown(100, "other").total, 2)).toBe(10);
  });

  it("ภาษีคาร์บอนดีเซล 0.0027403 × 200 = 0.548 (สไลด์แสดง 0.52 — รอตรวจ)", () => {
    expect(round(carbonTax(0.0027403, 200), 3)).toBe(0.548);
  });

  it("ภาษีคาร์บอนน้ำมันเตา 0.0030879 × 200 = 0.62", () => {
    expect(round(carbonTax(0.0030879, 200), 2)).toBe(0.62);
  });

  it("ภาษีคาร์บอน LPG 0.003198787 × 200 = 0.64", () => {
    expect(round(carbonTax(0.003198787, 200), 2)).toBe(0.64);
  });
});

describe("ภาษีความหวาน", () => {
  it("ระยะ 4 น้ำตาล 9 กรัม → 3 บาท/ลิตร", () => {
    expect(sugarRate(9, 4)).toBe(3);
  });
  it("ไม่เกิน 6 กรัม → 0 ทุกระยะ", () => {
    expect([1, 2, 3, 4].map((p) => sugarRate(6, p as 1 | 2 | 3 | 4))).toEqual([0, 0, 0, 0]);
  });
  it("เกิน 18 กรัม ระยะ 1 → 1 บาท/ลิตร", () => {
    expect(sugarRate(20, 1)).toBe(1);
  });
});

describe("อัตรารถยนต์ E+S", () => {
  it("HEV CO2 110 ปี 2569 → 9% (ตรงกับมาตรการ HEV น.55)", () => {
    expect(carRate({ type: "hev", co2: 110, period: 0 }).rate).toBe(9);
  });
  it("HEV CO2 ≤ 100 ปี 2569 → 6%", () => {
    expect(carRate({ type: "hev", co2: 95, period: 0 }).rate).toBe(6);
  });
  it("ICE CO2 160 ปี 2573 → 33%", () => {
    expect(carRate({ type: "ice", co2: 160, period: 2 }).rate).toBe(33);
  });
  it("ICE เกิน 3,000 cc → 50%", () => {
    expect(carRate({ type: "ice", co2: 250, period: 0, over3000cc: true }).rate).toBe(50);
  });
  it("BEV → 2%", () => {
    expect(carRate({ type: "bev", co2: 0, period: 0 }).rate).toBe(2);
  });
});
