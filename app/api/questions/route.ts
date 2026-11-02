import { NextResponse } from "next/server";
import { db, questions } from "@/lib/db";
import { EXPERTS } from "@/content/meta";
import { getRoom } from "@/content";

const TOPICS = new Set(EXPERTS.map((e) => e.id));

/** ผู้เรียนส่งคำถามต่อให้ผู้เชี่ยวชาญ */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const topic = str(body.topic, 20);
  const question = str(body.question, 2000);
  const askerName = str(body.askerName, 100);
  const askerUnit = str(body.askerUnit, 150);
  const askerContact = str(body.askerContact, 150) || null;
  const roomSlug = str(body.roomSlug, 60) || null;

  if (!TOPICS.has(topic as never)) return NextResponse.json({ error: "กรุณาเลือกหัวข้อ Expert" }, { status: 400 });
  if (question.length < 8) return NextResponse.json({ error: "คำถามสั้นเกินไป" }, { status: 400 });
  if (!askerName || !askerUnit) return NextResponse.json({ error: "กรุณากรอกชื่อและหน่วยงาน" }, { status: 400 });
  if (roomSlug && !getRoom(roomSlug)) return NextResponse.json({ error: "ไม่พบห้องเรียน" }, { status: 400 });

  const row = db()
    .insert(questions)
    .values({ topic, question, askerName, askerUnit, askerContact, roomSlug, createdAt: Date.now() })
    .returning({ id: questions.id })
    .get();

  return NextResponse.json({ ok: true, id: row.id });
}
