import type { Metadata } from "next";
import CalculatorBlock from "@/components/calculators";

export const metadata: Metadata = { title: "เครื่องคำนวณภาษี" };

const TOOLS = [
  { id: "general" as const, anchor: "general", title: "ภาษีทั่วไป (ระบบผสม + Earmark)", desc: "สุรา ยาสูบ แบตเตอรี่ น้ำหอม น้ำมัน หรือกำหนดเอง" },
  { id: "sweetness" as const, anchor: "sweetness", title: "ภาษีเครื่องดื่มและความหวาน", desc: "ปรับปริมาณน้ำตาลแล้วดูภาษีแต่ละระยะ" },
  { id: "car" as const, anchor: "car", title: "อัตราภาษีรถยนต์", desc: "ตามประเภทรถ CO2 และช่วงเวลา 2569–2573" },
  { id: "carbon" as const, anchor: "carbon", title: "ภาษีคาร์บอน", desc: "Emission Factor × ราคาคาร์บอน" },
  { id: "breakdown" as const, anchor: "breakdown", title: "แยกส่วนราคาสินค้า", desc: "ราคาหนึ่งชิ้นมีภาษีอยู่เท่าไร" },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="chip mb-3">ลองเอง</div>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">เครื่องคำนวณภาษี</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          ตัวเลขอัตราภาษีดึงจากแหล่งเดียวกับห้องเรียน ผลลัพธ์ใช้เพื่อการเรียนรู้ เวลาคำนวณภาษีจริงให้ใช้ระบบและประกาศของกรม
        </p>
      </div>
      <div className="mb-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {TOOLS.map((t) => (
          <a key={t.id} href={`#${t.anchor}`} className="card card-hover p-4">
            <div className="font-semibold leading-snug">{t.title}</div>
            <div className="mt-1 text-xs text-ink-mute">{t.desc}</div>
          </a>
        ))}
      </div>
      <div className="space-y-10">
        {TOOLS.map((t) => (
          <div key={t.id} id={t.anchor} className="scroll-mt-24">
            <CalculatorBlock id={t.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
