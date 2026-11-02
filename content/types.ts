// โครงสร้างข้อมูลเนื้อหาของ Excise Academy
// เนื้อหาทุกห้องเขียนเป็นข้อมูลแบบมีโครงสร้าง เพื่อให้ทั้งหน้าเว็บ ระบบค้นหา และผู้ช่วย AI ใช้ข้อมูลชุดเดียวกัน

export type CategoryId = "foundation" | "law" | "product" | "service" | "policy";

export type ExpertId =
  | "oil"
  | "beverage"
  | "vehicle"
  | "liquor"
  | "tobacco"
  | "service"
  | "law"
  | "general";

export type CalculatorId = "general" | "sweetness" | "car" | "carbon" | "breakdown";

/** ตารางที่ดึงตัวเลขจาก content/rates.ts โดยตรง */
export type DataTableId =
  | "oil"
  | "beverage"
  | "sweetness"
  | "liquor"
  | "tobacco"
  | "car"
  | "car-electric"
  | "motorcycle"
  | "carbon";

/** doc: role = สไลด์บทบาทและภารกิจกรมสรรพสามิต, act = สไลด์ พ.ร.บ.ภาษีสรรพสามิต 2560 */
export type SourceRef = { doc: "role" | "act"; pages: string };

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | {
      type: "table";
      caption?: string;
      head: string[];
      rows: (string | number)[][];
      note?: string;
    }
  | { type: "callout"; tone: "info" | "tip" | "warn" | "review"; title?: string; text: string }
  | { type: "formula"; label?: string; lines: string[] }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "cards"; items: { title: string; text: string; icon?: string }[] }
  | { type: "calculator"; id: CalculatorId }
  | { type: "dataTable"; id: DataTableId }
  | { type: "links"; items: { slug: string; label?: string }[] };

export type Section = {
  id: string;
  title: string;
  blocks: Block[];
  sources?: SourceRef[];
};

export type QuizQuestion = {
  q: string;
  choices: string[];
  answer: number; // index ของตัวเลือกที่ถูก
  explain: string;
};

export type Room = {
  slug: string;
  title: string;
  en: string;
  category: CategoryId;
  tariff?: string; // เช่น "ตอนที่ 13"
  icon: string; // ชื่อไอคอนใน components/Icon.tsx
  tagline: string;
  summary: string;
  highlights: string[]; // จุดเด่นสั้น ๆ แสดงบนการ์ด
  expertId: ExpertId;
  asOf: string;
  sections: Section[];
  quiz: QuizQuestion[];
  review?: string[]; // ประเด็นที่รอผู้เชี่ยวชาญของกรมตรวจ
  featured?: boolean;
};

export type Category = {
  id: CategoryId;
  title: string;
  en: string;
  description: string;
  icon: string;
};
