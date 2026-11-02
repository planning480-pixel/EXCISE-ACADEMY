import type { Block, CategoryId, DataTableId, Room } from "./types";
import * as R from "./rates";
import { foundationRooms } from "./rooms/foundation";
import { lawRooms } from "./rooms/law";
import { productRooms } from "./rooms/products";
import { serviceRooms } from "./rooms/services";
import { policyRooms } from "./rooms/policy";
import { CATEGORIES } from "./meta";

export const ROOMS: Room[] = [
  ...foundationRooms,
  ...lawRooms,
  ...productRooms,
  ...serviceRooms,
  ...policyRooms,
];

export function getRoom(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug);
}

export function roomsByCategory(id: CategoryId): Room[] {
  return ROOMS.filter((r) => r.category === id);
}

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)!;
}

export function neighbors(slug: string) {
  const i = ROOMS.findIndex((r) => r.slug === slug);
  return { prev: i > 0 ? ROOMS[i - 1] : undefined, next: i < ROOMS.length - 1 ? ROOMS[i + 1] : undefined };
}

/** ข้อความล้วนของบล็อก ใช้ทำดัชนีค้นหาและส่งให้ผู้ช่วย AI */
export function blockText(b: Block): string {
  const strip = (s: string) => s.replace(/\*\*/g, "");
  switch (b.type) {
    case "p":
      return strip(b.text);
    case "list":
      return b.items.map(strip).join("\n");
    case "table":
      return [b.caption, b.head.join(" | "), ...b.rows.map((r) => r.join(" | ")), b.note]
        .filter(Boolean)
        .map((s) => strip(String(s)))
        .join("\n");
    case "callout":
      return strip([b.title, b.text].filter(Boolean).join(": "));
    case "formula":
      return [b.label, ...b.lines].filter(Boolean).join("\n");
    case "stats":
      return b.items.map((i) => `${i.value} ${i.label}`).join("\n");
    case "steps":
    case "cards":
      return b.items.map((i) => `${i.title}: ${strip(i.text)}`).join("\n");
    case "dataTable":
      return dataTableText(b.id);
    default:
      return "";
  }
}

/** ข้อความของตารางที่ดึงจาก rates.ts ให้ระบบค้นหาและผู้ช่วย AI เห็นตัวเลขชุดเดียวกับหน้าเว็บ */
export function dataTableText(id: DataTableId): string {
  switch (id) {
    case "oil":
      return "อัตราภาษีน้ำมัน (ตามปริมาณ)\n" + R.OIL_RATES.map((o) => `${o.code} ${o.name}: ${o.rate} ${o.unit}${o.note ? ` (${o.note})` : ""}`).join("\n");
    case "beverage":
      return "อัตราตามมูลค่าเครื่องดื่ม\n" + R.BEVERAGE_TYPES.map((b) => `${b.name}: ${b.adValorem}% ภาษีความหวาน: ${b.sugarTax ? "เสีย" : "ไม่เสีย"}`).join("\n");
    case "sweetness":
      return (
        "ภาษีความหวาน บาท/ลิตร ตามน้ำตาล กรัม/100 มล. (" + R.SWEETNESS_PHASES.map((p) => `${p.label} ${p.period}`).join(", ") + ")\n" +
        R.SWEETNESS_BANDS.map((b) => `${b.label}: ${b.rates.join(" / ")}`).join("\n")
      );
    case "liquor":
      return "อัตราภาษีสุรา (ตามมูลค่า % + ตามปริมาณ บาท/ลิตรแห่งแอลกอฮอล์บริสุทธิ์)\n" + R.LIQUOR_RATES.map((l) => `${l.name}: ${l.adValorem}% + ${l.specific} บาท`).join("\n");
    case "tobacco":
      return "อัตราภาษียาสูบ\n" + R.TOBACCO_RATES.map((t) => `${t.name}: ${t.adValorem}% + ${t.specific}`).join("\n");
    case "car":
      return (
        "อัตราภาษีรถยนต์นั่ง ICE/HEV ตาม CO2 (" + R.CAR_PERIODS.map((p) => p.label).join(" / ") + ")\n" +
        R.CAR_CO2_BANDS.map((b) => `${b.label}: ICE ${b.ice.join("/")}% · HEV ${b.hev.join("/")}%`).join("\n") +
        `\nเกิน 3,000 cc: ICE ${R.CAR_OVER_3000CC.ice}% HEV ${R.CAR_OVER_3000CC.hev}%`
      );
    case "car-electric":
      return `รถยนต์ไฟฟ้าตั้งแต่ 2569: PHEV ระยะไฟฟ้า ≥ 80 กม. และถัง ≤ 45 ลิตร ${R.CAR_ELECTRIC.phevLongRange}% · PHEV อื่น ${R.CAR_ELECTRIC.phevOther}% · PHEV เกิน 3,000 cc ${R.CAR_OVER_3000CC.phev}% · BEV ${R.CAR_ELECTRIC.bev}% · FCEV ${R.CAR_ELECTRIC.fcev}%`;
    case "motorcycle":
      return "อัตราภาษีจักรยานยนต์ (" + R.MOTORCYCLE_RATES.periods.join(" / ") + ")\n" + R.MOTORCYCLE_RATES.rows.map((r) => `${r.name}: ${r.rates.join("/")}%`).join("\n");
    case "carbon":
      return `ราคาคาร์บอน ${R.CARBON_PRICE} บาท/tCO2eq\n` + R.EMISSION_FACTORS.map((e) => `${e.name}: Emission Factor ${e.factor} tCO2eq/${e.unit} อัตราสรรพสามิตปัจจุบัน ${e.exciseRate} บาท/${e.unit}`).join("\n");
  }
}

export type SearchDoc = {
  id: string;
  kind: "section" | "glossary" | "faq";
  roomSlug?: string;
  roomTitle?: string;
  sectionId?: string;
  title: string;
  text: string;
};

export function buildSearchDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const r of ROOMS) {
    docs.push({
      id: `${r.slug}#intro`,
      kind: "section",
      roomSlug: r.slug,
      roomTitle: r.title,
      title: r.title,
      text: `${r.tagline}\n${r.summary}\n${r.highlights.join(" ")}`,
    });
    for (const s of r.sections) {
      docs.push({
        id: `${r.slug}#${s.id}`,
        kind: "section",
        roomSlug: r.slug,
        roomTitle: r.title,
        sectionId: s.id,
        title: s.title,
        text: s.blocks.map(blockText).filter(Boolean).join("\n"),
      });
    }
  }
  return docs;
}

/** เนื้อหาเต็มของห้อง แบบข้อความล้วน สำหรับ system prompt ของผู้ช่วย AI */
export function roomPlainText(r: Room): string {
  const parts = [`# ห้อง: ${r.title} (${r.slug})${r.tariff ? ` · ${r.tariff}` : ""}`, r.summary];
  for (const s of r.sections) {
    parts.push(`## ${s.title} [${r.slug}#${s.id}]`);
    parts.push(s.blocks.map(blockText).filter(Boolean).join("\n"));
  }
  if (r.review?.length) parts.push(`## ประเด็นที่รอผู้เชี่ยวชาญตรวจ\n${r.review.join("\n")}`);
  return parts.join("\n\n");
}
