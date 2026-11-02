// อัตราภาษีที่ใช้ร่วมกันระหว่างตารางในห้องเรียนและเครื่องคำนวณ
// แก้ตัวเลขที่ไฟล์นี้ไฟล์เดียว แล้วทุกหน้าจะเปลี่ยนตาม
// ที่มา: สไลด์บทบาทและภารกิจกรมสรรพสามิต (มี.ค. 2569)

export const VAT_RATE = 0.07;

/** Earmark คิดเป็นสัดส่วนของภาษีสรรพสามิต (บทบาท น.24–25, พ.ร.บ. น.69–71) */
export const EARMARK = {
  interior: 0.1, // ภาษีเพื่อมหาดไทย (ม.150) ทุกสินค้าและบริการ
  thaiHealth: 0.02, // สสส. (สุรา ยาสูบ)
  sport: 0.02, // กองทุนพัฒนากีฬาแห่งชาติ (สุรา ยาสูบ)
  elderly: 0.02, // กองทุนผู้สูงอายุ (สุรา ยาสูบ)
  thaiPbs: 0.015, // Thai PBS (สุรา ยาสูบ) ไม่เกิน 2,000 ลบ./ปีงบประมาณ
  // เพดานรายปีของกองทุนอื่นยังรอตรวจ (สไลด์ระบุ 2,000 และ 4,000 ลบ. แต่จับคู่กับกองทุนไม่ชัด)
};

/** น้ำมัน: บาท/ลิตร (LPG และก๊าซบางชนิดเป็นบาท/กก.) — บทบาท น.27, 45 */
export const OIL_RATES: { code: string; name: string; rate: number; unit: string; note?: string }[] = [
  { code: "01.01", name: "น้ำมันเบนซิน (Gasoline/Benzene)", rate: 7.5, unit: "บาท/ลิตร" },
  { code: "01.01", name: "แก๊สโซฮอล์ E10 (95/91)", rate: 6.75, unit: "บาท/ลิตร" },
  { code: "01.01", name: "แก๊สโซฮอล์ E20", rate: 6.0, unit: "บาท/ลิตร" },
  { code: "01.01", name: "แก๊สโซฮอล์ E85", rate: 1.125, unit: "บาท/ลิตร" },
  { code: "01.05", name: "น้ำมันดีเซล (ไม่ผสมไบโอดีเซล)", rate: 7.44, unit: "บาท/ลิตร" },
  { code: "01.05", name: "ดีเซล B7", rate: 6.92, unit: "บาท/ลิตร" },
  { code: "01.05", name: "ดีเซล B10", rate: 6.7, unit: "บาท/ลิตร" },
  { code: "01.05", name: "ดีเซล B20", rate: 5.152, unit: "บาท/ลิตร" },
  { code: "01.02", name: "แนพทา", rate: 7, unit: "บาท/ลิตร" },
  { code: "01.03–01.04", name: "น้ำมันก๊าด / น้ำมันเชื้อเพลิงอากาศยาน", rate: 4.726, unit: "บาท/ลิตร", note: "หน้า 45 ระบุ JET A1 = 4.275 บาท/ลิตร (รอตรวจ)" },
  { code: "01.06", name: "ก๊าซธรรมชาติเหลว (NGL)", rate: 5.85, unit: "บาท/ลิตร" },
  { code: "01.07", name: "ก๊าซปิโตรเลียมเหลว (LPG)", rate: 2.17, unit: "บาท/กก." },
  { code: "01.08–01.10", name: "ก๊าซอีเทนเหลว / เอทิลีนเหลว / ก๊าซอีเทน / ก๊าซโพรเพน", rate: 2.17, unit: "บาท/กก." },
  { code: "01.12", name: "น้ำมันเตา (Fuel Oil)", rate: 0.64, unit: "บาท/ลิตร" },
  { code: "01.14", name: "สารละลายไฮโดรคาร์บอน (Solvent)", rate: 6.5, unit: "บาท/ลิตร" },
  { code: "01.90", name: "น้ำมันหล่อลื่น", rate: 5, unit: "บาท/ลิตร" },
  { code: "01.90", name: "น้ำมันชีวภาพสังเคราะห์ (Renewable Diesel: RD)", rate: 6.5, unit: "บาท/ลิตร", note: "หน้า 46 ระบุว่าปัจจุบันจัดเก็บในอัตราศูนย์ (รอตรวจ)" },
];

/** ภาษีความหวาน: บาท/ลิตร ตามช่วงน้ำตาล (กรัม/100 มล.) — บทบาท น.28 */
export const SWEETNESS_PHASES = [
  { id: 1, label: "ระยะที่ 1", period: "16 ก.ย. 60 – 30 ก.ย. 62" },
  { id: 2, label: "ระยะที่ 2", period: "1 ต.ค. 62 – 31 มี.ค. 66" },
  { id: 3, label: "ระยะที่ 3", period: "1 เม.ย. 66 – 31 มี.ค. 68" },
  { id: 4, label: "ระยะที่ 4", period: "ตั้งแต่ 1 เม.ย. 68" },
] as const;

export const SWEETNESS_BANDS: { label: string; maxSugar: number; rates: [number, number, number, number] }[] = [
  { label: "ไม่เกิน 6 กรัม", maxSugar: 6, rates: [0, 0, 0, 0] },
  { label: "เกิน 6 แต่ไม่เกิน 8 กรัม", maxSugar: 8, rates: [0.1, 0.1, 0.3, 1] },
  { label: "เกิน 8 แต่ไม่เกิน 10 กรัม", maxSugar: 10, rates: [0.3, 0.3, 1, 3] },
  { label: "เกิน 10 แต่ไม่เกิน 14 กรัม", maxSugar: 14, rates: [0.5, 1, 3, 5] },
  { label: "เกิน 14 แต่ไม่เกิน 18 กรัม", maxSugar: 18, rates: [1, 3, 5, 5] },
  { label: "เกิน 18 กรัม", maxSugar: Infinity, rates: [1, 5, 5, 5] },
];

export const BEVERAGE_TYPES: { id: string; name: string; adValorem: number; sugarTax: boolean }[] = [
  { id: "soda", name: "น้ำโซดา", adValorem: 14, sugarTax: false },
  { id: "soft", name: "น้ำอัดลม / เครื่องดื่มบำรุงกำลัง / เกลือแร่ / อื่น ๆ", adValorem: 14, sugarTax: true },
  { id: "juice", name: "น้ำผลไม้และน้ำพืชผักทั่วไป", adValorem: 10, sugarTax: true },
  { id: "juice-exempt", name: "น้ำผลไม้และน้ำพืชผัก (รายการที่ได้รับยกเว้น)", adValorem: 0, sugarTax: true },
  { id: "functional-water", name: "Functional Drink (Water-base)", adValorem: 10, sugarTax: true },
  { id: "functional-juice", name: "Functional Drink (Juice-base)", adValorem: 3, sugarTax: true },
];

/** สุรา: อัตราตามมูลค่า (%) + ตามปริมาณ (บาท/ลิตรแห่งแอลกอฮอล์บริสุทธิ์ หรือ บาท/ลิตร/100 ดีกรี) — บทบาท น.34 */
export const LIQUOR_RATES: { id: string; name: string; adValorem: number; specific: number }[] = [
  { id: "beer", name: "สุราแช่ชนิดเบียร์", adValorem: 22, specific: 430 },
  { id: "wine", name: "ไวน์และสปาร์กลิ้งไวน์ที่ทำจากองุ่น", adValorem: 5, specific: 1000 },
  { id: "fruit-wine", name: "สุราแช่ผลไม้ผสมองุ่น/ไวน์องุ่น เกิน 7 ดีกรี", adValorem: 0, specific: 900 },
  { id: "local", name: "อุ กระแช่ สาโท สุราแช่พื้นเมือง (ไม่เกิน 7 ดีกรี)", adValorem: 0, specific: 150 },
  { id: "mixed", name: "สุราแช่ผสมสุรากลั่น เกิน 7 ดีกรี", adValorem: 10, specific: 255 },
  { id: "other-fermented", name: "สุราแช่อื่น ๆ", adValorem: 10, specific: 150 },
  { id: "white", name: "สุรากลั่นชนิดสุราขาว", adValorem: 2, specific: 155 },
  { id: "spirit-other", name: "สุรากลั่นชนิดอื่น (เช่น วิสกี้ บรั่นดี)", adValorem: 20, specific: 255 },
];

/** ยาสูบ — บทบาท น.33 */
export const TOBACCO_RATES = [
  { name: "บุหรี่ซิกาแรต ราคาขายปลีกแนะนำไม่เกิน 72 บาท/ซอง", adValorem: 25, specific: "1.25 บาท/มวน" },
  { name: "บุหรี่ซิกาแรต ราคาขายปลีกแนะนำเกิน 72 บาท/ซอง", adValorem: 42, specific: "1.25 บาท/มวน" },
  { name: "บุหรี่ซิการ์", adValorem: 10, specific: "1.20 บาท/กรัม" },
  { name: "บุหรี่อื่น", adValorem: 0, specific: "0.50 บาท/มวน" },
  { name: "ยาเคี้ยว", adValorem: 0, specific: "0.10 บาท/กรัม" },
  { name: "ยาเส้นปรุง", adValorem: 10, specific: "1.20 บาท/กรัม" },
  { name: "ยาเส้นที่ขายเป็นวัตถุดิบให้ผู้ประกอบอุตสาหกรรมยาสูบ", adValorem: 0, specific: "0.00 บาท/กรัม" },
  { name: "ยาเส้นอื่น ปริมาณไม่เกิน 12,000 กก./ปี", adValorem: 0, specific: "0.025 บาท/กรัม" },
  { name: "ยาเส้นอื่น ๆ", adValorem: 0, specific: "0.10 บาท/กรัม" },
];

/** รถยนต์นั่ง/โดยสารไม่เกิน 10 ที่นั่ง โครงสร้างตั้งแต่ปี 2569 แบบ E+S (ADAS) — บทบาท น.30 */
export const CAR_PERIODS = [
  { id: 0, label: "1 ม.ค. 2569" },
  { id: 1, label: "1 ม.ค. 2571" },
  { id: 2, label: "1 ม.ค. 2573" },
] as const;

export const CAR_CO2_BANDS: { label: string; max: number; ice: [number, number, number]; hev: [number, number, number] }[] = [
  { label: "ไม่เกิน 100 g/km", max: 100, ice: [13, 14, 15], hev: [6, 8, 10] },
  { label: "101–120 g/km", max: 120, ice: [22, 24, 26], hev: [9, 11, 13] },
  { label: "121–150 g/km", max: 150, ice: [25, 27, 29], hev: [14, 16, 18] },
  { label: "151–200 g/km", max: 200, ice: [29, 31, 33], hev: [19, 21, 23] },
  { label: "เกิน 200 g/km", max: Infinity, ice: [34, 36, 38], hev: [24, 26, 28] },
];

export const CAR_OVER_3000CC = { ice: 50, hev: 40, phev: 30 };
export const CAR_ELECTRIC = {
  phevLongRange: 5, // Electric Range ≥ 80 km และถังน้ำมัน ≤ 45 ลิตร
  phevOther: 10,
  bev: 2,
  fcev: 1,
};

/** จักรยานยนต์ — บทบาท น.32 */
export const MOTORCYCLE_RATES = {
  periods: ["ปัจจุบัน – 31 ธ.ค. 68", "1 ม.ค. 69 – 31 ธ.ค. 72", "ตั้งแต่ 1 ม.ค. 73"],
  rows: [
    { name: "เชื้อเพลิง/ไฮบริด CO2 ≤ 50 g/km", rates: ["3", "4", "5"] },
    { name: "เชื้อเพลิง/ไฮบริด 50 < CO2 ≤ 90 g/km", rates: ["5", "6", "10"] },
    { name: "เชื้อเพลิง/ไฮบริด 90 < CO2 ≤ 130 g/km", rates: ["9", "10", "15"] },
    { name: "เชื้อเพลิง/ไฮบริด CO2 > 130 g/km", rates: ["18", "20", "25"] },
    { name: "ไฟฟ้า แรงดันต่ำกว่า 48 โวลต์", rates: ["0", "0", "0"] },
    { name: "ไฟฟ้า ≥ 48 โวลต์ (ตามเงื่อนไขที่อธิบดีประกาศ)", rates: ["1", "1", "1"] },
    { name: "ไฟฟ้า ≥ 48 โวลต์ (ทั่วไป)", rates: ["5", "10", "10"] },
    { name: "รถต้นแบบเพื่อวิจัย พัฒนา ทดสอบ", rates: ["0", "0", "0"] },
    { name: "อื่น ๆ", rates: ["20", "25", "30"] },
  ],
};

/** Emission Factor (tCO2eq ต่อหน่วย) — บทบาท น.95 */
export const CARBON_PRICE = 200; // บาท/tCO2eq ตามประกาศกรมฯ
export const EMISSION_FACTORS = [
  { id: "diesel", name: "ดีเซล", factor: 0.0027403, unit: "ลิตร", exciseRate: 6.92 },
  { id: "fueloil", name: "น้ำมันเตา", factor: 0.0030879, unit: "ลิตร", exciseRate: 0.64 },
  { id: "lpg", name: "LPG", factor: 0.003198787, unit: "กก.", exciseRate: 2.17 },
];
