import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getRoom, roomPlainText } from "@/content";
import { EXPERTS } from "@/content/meta";
import { aiEnabled } from "@/lib/ai";

// ผู้ช่วย AI: ตอบจากเนื้อหาในห้องเรียนที่ Expert คนนั้นดูแลเท่านั้น
// เปิดใช้เมื่อตั้งค่า ANTHROPIC_API_KEY ใน .env.local

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";

const RULES = `คุณคือผู้ช่วยตอบคำถามของ Excise Academy แหล่งเรียนรู้กลางของกรมสรรพสามิต ผู้ถามเป็นเจ้าหน้าที่ของกรม
กติกา:
- ตอบจาก "เนื้อหาอ้างอิง" ด้านล่างเท่านั้น ห้ามเดาตัวเลข อัตราภาษี หรือมาตราที่ไม่มีในเนื้อหา
- ถ้าเนื้อหาไม่พอจะตอบ ให้บอกตรง ๆ ว่ายังไม่มีในห้องเรียน และแนะนำให้กดปุ่ม "ส่งต่อผู้เชี่ยวชาญ"
- ตอบเป็นภาษาไทย กระชับ เป็นกันเอง ถ้าต้องคำนวณให้แสดงวิธีคิดทีละบรรทัด
- ท้ายคำตอบให้บอกแหล่งที่ใช้ในรูปแบบ "อ้างอิง: ชื่อห้อง > ชื่อหัวข้อ"
- ถ้าประเด็นนั้นอยู่ในรายการ "รอผู้เชี่ยวชาญตรวจ" ให้เตือนผู้ถามด้วย
- ใช้ **ตัวหนา** ได้ แต่ไม่ต้องใช้หัวข้อหรือตาราง markdown`;

function expertContext(expertId: string) {
  const expert = EXPERTS.find((e) => e.id === expertId) ?? EXPERTS.find((e) => e.id === "general")!;
  const rooms = expert.rooms.map(getRoom).filter((r) => r !== undefined);
  return {
    expert,
    text: `คุณรับบทเป็น ${expert.name} (${expert.role}) หน่วยงานที่รับคำถามต่อ: ${expert.unit}\n\n# เนื้อหาอ้างอิง\n\n${rooms.map(roomPlainText).join("\n\n---\n\n")}`,
  };
}

export async function POST(req: Request) {
  if (!aiEnabled()) {
    return NextResponse.json({ error: "ยังไม่ได้เปิดใช้ผู้ช่วย AI กรุณาส่งต่อผู้เชี่ยวชาญแทน" }, { status: 503 });
  }

  let body: { expertId?: string; question?: string; roomSlug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }
  const question = (body.question ?? "").trim().slice(0, 2000);
  if (question.length < 3) return NextResponse.json({ error: "คำถามสั้นเกินไป" }, { status: 400 });

  const { text: context } = expertContext(body.expertId ?? "general");
  const room = body.roomSlug ? getRoom(body.roomSlug) : undefined;
  const userText = room ? `(ผู้ถามกำลังอ่านห้อง "${room.title}")\n\n${question}` : question;

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const ms = client.beta.messages.stream({
          model: MODEL,
          max_tokens: 4000,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          output_config: { effort: "low" },
          // ส่วนกติกาและเนื้อหาของ Expert คงที่ จึงแคชไว้ คำถามที่เปลี่ยนทุกครั้งอยู่หลังจุดแคช
          system: [
            { type: "text", text: RULES },
            { type: "text", text: context, cache_control: { type: "ephemeral" } },
          ],
          messages: [{ role: "user", content: userText }],
        } as Parameters<typeof client.beta.messages.stream>[0]);

        for await (const event of ms) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await ms.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nขออภัย คำถามนี้ผู้ช่วย AI ตอบไม่ได้ กรุณาส่งต่อผู้เชี่ยวชาญ"));
        } else if (final.stop_reason === "max_tokens") {
          controller.enqueue(encoder.encode("\n\n(คำตอบยาวเกินกำหนด ถูกตัดไว้ตรงนี้)"));
        }
      } catch (err) {
        let msg = "ผู้ช่วย AI ขัดข้อง กรุณาลองใหม่หรือส่งต่อผู้เชี่ยวชาญ";
        if (err instanceof Anthropic.AuthenticationError) msg = "API key ของ Claude ไม่ถูกต้อง กรุณาแจ้งผู้ดูแลระบบ";
        else if (err instanceof Anthropic.RateLimitError) msg = "มีผู้ใช้งานพร้อมกันมาก กรุณาลองใหม่ในอีกสักครู่";
        else if (err instanceof Anthropic.APIError) console.error("Claude API error", err.status, err.message);
        else console.error(err);
        controller.enqueue(encoder.encode(`\n\n${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
