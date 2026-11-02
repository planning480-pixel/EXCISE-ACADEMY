import type { DataTableId } from "@/content/types";
import {
  BEVERAGE_TYPES,
  CAR_CO2_BANDS,
  CAR_ELECTRIC,
  CAR_OVER_3000CC,
  CAR_PERIODS,
  CARBON_PRICE,
  EMISSION_FACTORS,
  LIQUOR_RATES,
  MOTORCYCLE_RATES,
  OIL_RATES,
  SWEETNESS_BANDS,
  SWEETNESS_PHASES,
  TOBACCO_RATES,
} from "@/content/rates";
import { baht, carbonTax } from "@/lib/calc";

function Table({ caption, head, rows, note }: { caption?: string; head: string[]; rows: (string | number)[][]; note?: string }) {
  return (
    <figure className="prose-room">
      {caption && <figcaption className="mb-2 text-sm font-semibold text-ink-soft">{caption}</figcaption>}
      <div className="overflow-x-auto rounded-2xl border border-line-soft">
        <table>
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h}>
                  {h.split("\n").map((line, i) => (
                    <span key={i} className={i > 0 ? "block text-xs font-normal text-ink-mute" : "block"}>
                      {line}
                    </span>
                  ))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className={j > 0 ? "tabular-nums" : ""}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="mt-2 text-xs text-ink-mute">{note}</p>}
    </figure>
  );
}

export default function DataTable({ id }: { id: DataTableId }) {
  switch (id) {
    case "oil":
      return (
        <Table
          caption="อัตราภาษีน้ำมันและผลิตภัณฑ์น้ำมัน (ตามปริมาณ)"
          head={["ประเภท", "สินค้า", "อัตรา", "หน่วย"]}
          rows={OIL_RATES.map((o) => [o.code, o.note ? `${o.name} *` : o.name, o.rate.toString(), o.unit])}
          note="* มีหมายเหตุรอตรวจ ดูท้ายห้อง"
        />
      );
    case "beverage":
      return (
        <Table
          caption="อัตราตามมูลค่า แยกตามประเภทเครื่องดื่ม"
          head={["ประเภทเครื่องดื่ม", "ตามมูลค่า", "ภาษีความหวาน"]}
          rows={BEVERAGE_TYPES.map((b) => [b.name, `${b.adValorem}%`, b.sugarTax ? "เสีย" : "ไม่เสีย"])}
        />
      );
    case "sweetness":
      return (
        <Table
          caption="ภาษีความหวาน (บาท/ลิตร) ตามปริมาณน้ำตาล กรัม/100 มล."
          head={["ปริมาณน้ำตาล", ...SWEETNESS_PHASES.map((p) => `${p.label}\n${p.period}`)]}
          rows={SWEETNESS_BANDS.map((b) => [b.label, ...b.rates.map((r) => r.toFixed(2))])}
          note="ผลิตภัณฑ์เครื่องดื่มชนิดผง เกล็ด หรือเข้มข้น ใช้ตารางความหวานเดียวกัน"
        />
      );
    case "liquor":
      return (
        <Table
          caption="อัตราภาษีสุรา"
          head={["ชนิดสุรา", "ตามมูลค่า", "ตามปริมาณ (บาท/ลิตร 100 ดีกรี)"]}
          rows={LIQUOR_RATES.map((l) => [l.name, `${l.adValorem}%`, baht(l.specific, 0)])}
        />
      );
    case "tobacco":
      return (
        <Table
          caption="อัตราภาษียาสูบ"
          head={["ประเภท", "ตามมูลค่า", "ตามปริมาณ"]}
          rows={TOBACCO_RATES.map((t) => [t.name, `${t.adValorem}%`, t.specific])}
        />
      );
    case "car":
      return (
        <Table
          caption="รถยนต์สันดาปภายใน (ICE) / ไฮบริด (HEV) — อัตรา % ตามช่วงเวลา"
          head={["CO2", ...CAR_PERIODS.map((p) => `ICE ${p.label}`), ...CAR_PERIODS.map((p) => `HEV ${p.label}`)]}
          rows={[
            ...CAR_CO2_BANDS.map((b) => [b.label, ...b.ice.map((n) => `${n}%`), ...b.hev.map((n) => `${n}%`)]),
            ["เกิน 3,000 cc", `${CAR_OVER_3000CC.ice}%`, `${CAR_OVER_3000CC.ice}%`, `${CAR_OVER_3000CC.ice}%`, `${CAR_OVER_3000CC.hev}%`, `${CAR_OVER_3000CC.hev}%`, `${CAR_OVER_3000CC.hev}%`],
          ]}
          note="โครงสร้าง E+S (มาตรฐาน ADAS) ตามสไลด์หน้า 30 — รอยืนยัน"
        />
      );
    case "car-electric":
      return (
        <Table
          caption="รถยนต์ไฟฟ้า ตั้งแต่ 1 ม.ค. 2569"
          head={["ประเภท", "เงื่อนไข", "อัตรา"]}
          rows={[
            ["PHEV", "ระยะวิ่งไฟฟ้า ≥ 80 กม. และถังน้ำมัน ≤ 45 ลิตร", `${CAR_ELECTRIC.phevLongRange}%`],
            ["PHEV", "ระยะวิ่งไฟฟ้า < 80 กม. หรือถังน้ำมัน > 45 ลิตร", `${CAR_ELECTRIC.phevOther}%`],
            ["PHEV", "เกิน 3,000 cc", `${CAR_OVER_3000CC.phev}%`],
            ["BEV", "รถยนต์ไฟฟ้าแบตเตอรี่", `${CAR_ELECTRIC.bev}%`],
            ["FCEV", "รถยนต์เซลล์เชื้อเพลิง", `${CAR_ELECTRIC.fcev}%`],
          ]}
        />
      );
    case "motorcycle":
      return (
        <Table
          caption="อัตราภาษีจักรยานยนต์ (%)"
          head={["ประเภท", ...MOTORCYCLE_RATES.periods]}
          rows={MOTORCYCLE_RATES.rows.map((r) => [r.name, ...r.rates.map((x) => `${x}%`)])}
        />
      );
    case "carbon":
      return (
        <Table
          caption={`ราคาคาร์บอน ${CARBON_PRICE} บาท/tCO2eq × Emission Factor`}
          head={["สินค้า", "Emission Factor (tCO2eq)", "ภาษีคาร์บอน", "อัตราสรรพสามิตปัจจุบัน"]}
          rows={EMISSION_FACTORS.map((e) => [
            e.name,
            `${e.factor} /${e.unit}`,
            `${baht(carbonTax(e.factor, CARBON_PRICE))} บาท/${e.unit}`,
            `${e.exciseRate} บาท/${e.unit}`,
          ])}
        />
      );
  }
}

export { Table };
