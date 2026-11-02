// ค้นหาภาษาไทยแบบง่าย: ตัดคำด้วย Intl.Segmenter แล้วให้คะแนนตามจำนวนคำที่พบ
import type { SearchDoc } from "@/content";

const STOP = new Set([
  "คือ", "อะไร", "ไหม", "มั้ย", "หรือ", "และ", "ของ", "การ", "ที่", "ใน", "ได้", "ไม่", "เป็น", "มี", "จะ", "ให้",
  "กับ", "ว่า", "แล้ว", "อย่างไร", "ยังไง", "เท่าไร", "เท่าไหร่", "กี่", "ทำไม", "ต้อง", "บ้าง", "ครับ", "ค่ะ", "คะ",
  "นะ", "จาก", "เสีย", "คิด", "อยาก", "รู้", "เรื่อง", "โดย", "เมื่อ", "ถ้า", "แต่", "เพื่อ", "ซึ่ง", "นี้", "นั้น", "เรา", "ผม", "ฉัน", "หน่อย", "ช่วย",
  "the", "a", "an", "of", "is", "what", "how",
]);

let segmenter: Intl.Segmenter | null = null;
function seg() {
  if (!segmenter) segmenter = new Intl.Segmenter("th", { granularity: "word" });
  return segmenter;
}

export function tokenize(q: string): string[] {
  const out = new Set<string>();
  for (const s of seg().segment(q.toLowerCase())) {
    if (!s.isWordLike) continue;
    const w = s.segment.trim();
    if (!w || STOP.has(w)) continue;
    if (w.length < 2 && !/\d/.test(w)) continue;
    out.add(w);
  }
  return [...out];
}

function count(hay: string, needle: string, cap = 6): number {
  let n = 0;
  let i = hay.indexOf(needle);
  while (i !== -1 && n < cap) {
    n++;
    i = hay.indexOf(needle, i + needle.length);
  }
  return n;
}

export type SearchHit = SearchDoc & { score: number; snippet: string };

export function searchDocs(docs: SearchDoc[], query: string, limit = 6): SearchHit[] {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  const prepared = docs.map((d) => ({ d, title: `${d.title} ${d.roomTitle ?? ""}`.toLowerCase(), text: d.text.toLowerCase() }));
  // คำที่พบในเอกสารน้อย (เช่น "เบียร์") มีน้ำหนักมากกว่าคำที่พบทุกที่ (เช่น "ภาษี")
  const idf = new Map<string, number>();
  for (const t of tokens) {
    const df = prepared.filter((p) => p.title.includes(t) || p.text.includes(t)).length;
    idf.set(t, Math.log(1 + prepared.length / (1 + df)));
  }
  const hits: SearchHit[] = [];
  for (const { d, title, text } of prepared) {
    let score = 0;
    let matched = 0;
    let firstPos = -1;
    for (const t of tokens) {
      const inTitle = count(title, t);
      const inText = count(text, t);
      if (inTitle || inText) {
        matched++;
        score += (inTitle * 3 + Math.min(inText, 4)) * idf.get(t)!;
        if (firstPos === -1 && inText) firstPos = text.indexOf(t);
      }
    }
    if (!matched) continue;
    score *= matched / tokens.length + (matched === tokens.length ? 0.5 : 0);
    if (d.kind === "faq") score *= 1.3;
    const start = Math.max(0, firstPos - 50);
    const snippet = (start > 0 ? "…" : "") + d.text.slice(start, start + 180).replace(/\s+/g, " ") + "…";
    hits.push({ ...d, score, snippet });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
