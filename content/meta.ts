import type { Category, ExpertId } from "./types";

export const AS_OF = "มี.ค. 2569";

export const SOURCES = {
  role: {
    short: "บทบาทและภารกิจกรมสรรพสามิต",
    full: "บทบาทและภารกิจกรมสรรพสามิต — สำนักแผนภาษี (หลักสูตรต้นกล้าข้าราชการ 25 มี.ค. 2569)",
  },
  act: {
    short: "พ.ร.บ.ภาษีสรรพสามิต พ.ศ. 2560",
    full: "พระราชบัญญัติภาษีสรรพสามิต พ.ศ. 2560 — สำนักกฎหมาย ส่วนกฎหมายและระเบียบ",
  },
} as const;

export const CATEGORIES: Category[] = [
  {
    id: "foundation",
    title: "พื้นฐาน",
    en: "FOUNDATION",
    description: "รู้จักกรม รู้จักภาษีสรรพสามิต และบทบาทของเรา",
    icon: "landmark",
  },
  {
    id: "law",
    title: "กฎหมาย พ.ร.บ. 2560",
    en: "THE LAW",
    description: "โครงสร้างภาษีตาม พ.ร.บ.ภาษีสรรพสามิต ตั้งแต่ผู้เสียภาษีถึงข้อพิพาท",
    icon: "scale",
  },
  {
    id: "product",
    title: "สินค้า",
    en: "PRODUCTS",
    description: "พิกัดตอนที่ 1–16 นิยาม โครงสร้าง และอัตราภาษีรายสินค้า",
    icon: "package",
  },
  {
    id: "service",
    title: "บริการ",
    en: "SERVICES",
    description: "พิกัดตอนที่ 17–21 กิจการบันเทิง เสี่ยงโชค สนามกอล์ฟ และอื่น ๆ",
    icon: "ticket",
  },
  {
    id: "policy",
    title: "นโยบายและอนาคต",
    en: "POLICY & FUTURE",
    description: "ภาษีคาร์บอน ภาษีความหวาน ยานยนต์ไฟฟ้า และทิศทางข้างหน้า",
    icon: "compass",
  },
];

export type Expert = {
  id: ExpertId;
  name: string;
  role: string;
  icon: string;
  rooms: string[]; // slug ของห้องที่ดูแล
  unit: string; // หน่วยงานที่รับคำถามต่อ (กรมเติมชื่อผู้เชี่ยวชาญเองภายหลัง)
  starters: string[];
};

export const EXPERTS: Expert[] = [
  {
    id: "oil",
    name: "Expert น้ำมันและคาร์บอน",
    role: "น้ำมันและผลิตภัณฑ์น้ำมัน · ภาษีคาร์บอน",
    icon: "fuel",
    rooms: ["oil", "carbon-tax"],
    unit: "สำนักมาตรฐานและพัฒนาการจัดเก็บภาษี / สำนักแผนภาษี",
    starters: [
      "ทำไมดีเซล B20 เสียภาษีน้อยกว่า B7",
      "ราคาคาร์บอน 200 บาทต่อตันคิดอย่างไร",
      "น้ำมันชีวภาพสังเคราะห์ (RD) เสียภาษีเท่าไร",
    ],
  },
  {
    id: "beverage",
    name: "Expert เครื่องดื่ม",
    role: "เครื่องดื่ม · ภาษีความหวาน · Functional Drink",
    icon: "cup-soda",
    rooms: ["beverage", "sweet-to-salt"],
    unit: "สำนักมาตรฐานและพัฒนาการจัดเก็บภาษี",
    starters: [
      "น้ำตาล 9 กรัม/100 มล. ตอนนี้เสียภาษีความหวานเท่าไร",
      "นมเปรี้ยวต้องเสียภาษีเครื่องดื่มไหม",
      "Functional Drink ต่างจากผลิตภัณฑ์เสริมอาหารอย่างไร",
    ],
  },
  {
    id: "vehicle",
    name: "Expert ยานยนต์",
    role: "รถยนต์ · จักรยานยนต์ · แบตเตอรี่ · EV",
    icon: "car",
    rooms: ["car", "motorcycle", "battery", "ev-transition"],
    unit: "สำนักมาตรฐานและพัฒนาการจัดเก็บภาษี / สำนักแผนภาษี",
    starters: [
      "รถ HEV ปล่อย CO2 110 g/km ปี 2569 เสียกี่เปอร์เซ็นต์",
      "EV3 กับ EV3.5 ต่างกันอย่างไร",
      "ADAS ที่ต้องติดตั้งมีระบบอะไรบ้าง",
    ],
  },
  {
    id: "liquor",
    name: "Expert สุรา",
    role: "สุราแช่ · สุรากลั่น · ใบอนุญาตสุรา",
    icon: "wine",
    rooms: ["liquor", "license"],
    unit: "สำนักมาตรฐานและพัฒนาการจัดเก็บภาษี",
    starters: [
      "เบียร์ 5% กระป๋อง 320 มล. ภาษีตามปริมาณเท่าไร",
      "สุราแช่กับสุรากลั่นแบ่งกันที่กี่ดีกรี",
      "ขายสุราต้องขอใบอนุญาตตามมาตราไหน",
    ],
  },
  {
    id: "tobacco",
    name: "Expert ยาสูบและไพ่",
    role: "บุหรี่ · ยาเส้น · ไพ่",
    icon: "cigarette",
    rooms: ["tobacco", "cards"],
    unit: "สำนักมาตรฐานและพัฒนาการจัดเก็บภาษี",
    starters: [
      "บุหรี่ราคา 72 บาทกับ 73 บาท ภาษีต่างกันอย่างไร",
      "ยาเส้นที่ผลิตไม่เกิน 12,000 กก. เสียภาษีเท่าไร",
      "ไพ่ป๊อกเสียภาษีสำรับละเท่าไร",
    ],
  },
  {
    id: "service",
    name: "Expert บริการ",
    role: "สถานบันเทิง · สนามม้า · สนามกอล์ฟ",
    icon: "ticket",
    rooms: ["entertainment", "gambling", "golf", "telecom"],
    unit: "สำนักมาตรฐานและพัฒนาการจัดเก็บภาษี",
    starters: [
      "ไนต์คลับลดภาษีเหลือ 5% ถึงเมื่อไร",
      "ร้านนวดในโรงพยาบาลต้องเสียภาษีไหม",
      "สนามกอล์ฟเสียภาษีจากรายรับส่วนไหน",
    ],
  },
  {
    id: "law",
    name: "Expert กฎหมาย",
    role: "พ.ร.บ.ภาษีสรรพสามิต พ.ศ. 2560",
    icon: "scale",
    rooms: [
      "act-overview",
      "taxpayer",
      "tax-base",
      "tax-point",
      "incentives",
      "sanctions",
      "earmark",
      "license",
    ],
    unit: "สำนักกฎหมาย (ส่วนกฎหมายและระเบียบ · ส่วนคดี · ส่วนอุทธรณ์)",
    starters: [
      "ยื่นแบบช้าเสียเบี้ยปรับและเงินเพิ่มเท่าไร",
      "อุทธรณ์การประเมินภาษีต้องทำภายในกี่วัน",
      "Tax Point ของสินค้านำเข้าเกิดเมื่อไร",
    ],
  },
  {
    id: "general",
    name: "Expert ทั่วไป",
    role: "ภาพรวมกรม · บทบาท · สินค้าอื่น ๆ",
    icon: "sparkles",
    rooms: [
      "about-excise",
      "what-is-excise",
      "six-roles",
      "perfume",
      "other-goods",
      "future-policy",
    ],
    unit: "สำนักแผนภาษี",
    starters: [
      "กรมสรรพสามิตเก็บรายได้เป็นอันดับเท่าไรของประเทศ",
      "สินค้าอะไรบ้างที่อัตราภาษีเป็น 0%",
      "ทำไมต้องเก็บภาษีสรรพสามิต",
    ],
  },
];

export const LATEST_UPDATES = [
  {
    date: "2568",
    title: "กฎกระทรวงพิกัดฯ ฉบับที่ 41–42: อัตราภาษีน้ำมันรวมกลไกราคาคาร์บอน",
    text: "อัตราภาษีน้ำมันยังเท่าเดิม แต่ระบุว่าได้รวมราคาคาร์บอน 200 บาท/tCO2eq ไว้แล้ว",
    slug: "carbon-tax",
  },
  {
    date: "1 ม.ค. – 31 ธ.ค. 69",
    title: "ไนต์คลับ ดิสโกเธค ผับ บาร์ ลดอัตราภาษีจาก 10% เหลือ 5% (ระยะที่ 3)",
    text: "มาตรการสนับสนุนการท่องเที่ยว ต่ออายุอีก 1 ปี",
    slug: "entertainment",
  },
  {
    date: "1 ม.ค. 69",
    title: "โครงสร้างภาษีรถยนต์ใหม่ ปรับอัตราตาม CO2 แบบขั้นบันไดทุก 2 ปี",
    text: "แยก HEV PHEV BEV ชัดเจน และนำมาตรฐานความปลอดภัย ADAS มาเป็นเงื่อนไข",
    slug: "car",
  },
  {
    date: "1 เม.ย. 68",
    title: "ภาษีความหวานเข้าสู่ระยะที่ 4 (ระยะสุดท้าย)",
    text: "น้ำตาลเกิน 10 กรัม/100 มล. เสียภาษีตามปริมาณสูงสุด 5 บาท/ลิตร",
    slug: "beverage",
  },
];

export const LINKS = {
  excise: "https://www.excise.go.th",
  lawelcs: "https://lawelcs.excise.go.th",
};
