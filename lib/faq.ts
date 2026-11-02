import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db, questions } from "./db";
import { getRoom, type SearchDoc } from "@/content";

export type Faq = { id: number; question: string; answer: string; roomSlug: string | null; answeredBy: string | null; answeredAt: number | null };

export function publishedFaq(roomSlug?: string): Faq[] {
  try {
    const where = roomSlug
      ? and(eq(questions.published, 1), eq(questions.roomSlug, roomSlug))
      : eq(questions.published, 1);
    return db()
      .select()
      .from(questions)
      .where(where)
      .orderBy(desc(questions.answeredAt))
      .all()
      .map((q) => ({
        id: q.id,
        question: q.question,
        answer: q.answer ?? "",
        roomSlug: q.roomSlug,
        answeredBy: q.answeredBy,
        answeredAt: q.answeredAt,
      }));
  } catch {
    return [];
  }
}

export function faqSearchDocs(): SearchDoc[] {
  return publishedFaq().map((f) => ({
    id: `faq-${f.id}`,
    kind: "faq" as const,
    roomSlug: f.roomSlug ?? undefined,
    roomTitle: f.roomSlug ? getRoom(f.roomSlug)?.title : "คำถามที่พบบ่อย",
    sectionId: "faq",
    title: f.question,
    text: f.answer,
  }));
}
