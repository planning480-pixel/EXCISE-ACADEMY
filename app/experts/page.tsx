import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, sql } from "drizzle-orm";
import { CheckCircle2, Eye, EyeOff, LogOut } from "lucide-react";
import { db, experts, questions } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getRoom } from "@/content";
import { EXPERTS } from "@/content/meta";
import LoginForm from "./LoginForm";
import { answerQuestion, logout, togglePublish } from "./actions";

export const metadata: Metadata = { title: "แดชบอร์ดผู้เชี่ยวชาญ" };
export const dynamic = "force-dynamic";

function fmt(ts: number | null) {
  return ts ? new Date(ts).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" }) : "";
}

export default async function ExpertsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await getSession();
  if (!session) {
    const seeded = (db().select({ n: sql<number>`count(*)` }).from(experts).get()?.n ?? 0) > 0;
    return (
      <div className="px-4 py-16">
        <LoginForm seeded={seeded} />
      </div>
    );
  }

  const { tab } = await searchParams;
  const status = tab === "answered" ? "answered" : "pending";
  const scope = session.topic === "all" ? undefined : eq(questions.topic, session.topic);
  const rows = db()
    .select()
    .from(questions)
    .where(scope ? and(scope, eq(questions.status, status)) : eq(questions.status, status))
    .orderBy(desc(questions.createdAt))
    .all();
  const pendingCount =
    db()
      .select({ n: sql<number>`count(*)` })
      .from(questions)
      .where(scope ? and(scope, eq(questions.status, "pending")) : eq(questions.status, "pending"))
      .get()?.n ?? 0;
  const topicName = session.topic === "all" ? "ทุกหัวข้อ" : EXPERTS.find((e) => e.id === session.topic)?.name;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold">คำถามจากผู้เรียน</h1>
          <p className="text-sm text-ink-soft">
            {session.name} · ดูแล: {topicName}
          </p>
        </div>
        <form action={logout}>
          <button className="btn btn-ghost text-sm">
            <LogOut className="h-4 w-4" /> ออกจากระบบ
          </button>
        </form>
      </div>

      <div className="mb-6 flex gap-2">
        <Link href="/experts" className={`rounded-full border px-4 py-2 text-sm font-medium ${status === "pending" ? "border-accent bg-accent text-accent-ink" : "border-line text-ink-soft"}`}>
          รอตอบ ({pendingCount})
        </Link>
        <Link href="/experts?tab=answered" className={`rounded-full border px-4 py-2 text-sm font-medium ${status === "answered" ? "border-accent bg-accent text-accent-ink" : "border-line text-ink-soft"}`}>
          ตอบแล้ว
        </Link>
      </div>

      {rows.length === 0 && (
        <div className="card p-10 text-center text-ink-soft">
          <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-good" />
          {status === "pending" ? "ไม่มีคำถามค้างตอบ" : "ยังไม่มีคำถามที่ตอบแล้ว"}
        </div>
      )}

      <div className="space-y-4">
        {rows.map((q) => {
          const room = q.roomSlug ? getRoom(q.roomSlug) : undefined;
          const expert = EXPERTS.find((e) => e.id === q.topic);
          return (
            <div key={q.id} className="card p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-ink-mute">
                <span className="chip">#{q.id}</span>
                <span>{expert?.name}</span>
                {room && (
                  <Link href={`/rooms/${room.slug}`} className="text-accent hover:underline">
                    ห้อง {room.title}
                  </Link>
                )}
                <span className="ml-auto">{fmt(q.createdAt)}</span>
              </div>
              <p className="font-medium leading-7">{q.question}</p>
              <p className="mt-1 text-xs text-ink-mute">
                ถามโดย {q.askerName} · {q.askerUnit}
                {q.askerContact ? ` · ติดต่อ: ${q.askerContact}` : ""}
              </p>

              {q.status === "pending" ? (
                <form action={answerQuestion} className="mt-4 space-y-3">
                  <input type="hidden" name="id" value={q.id} />
                  <textarea name="answer" required rows={4} className="input" placeholder="พิมพ์คำตอบ อ้างอิงมาตราหรือประกาศได้" />
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="publish" defaultChecked className="accent-[var(--accent)]" />
                      เผยแพร่เป็น FAQ ในห้องเรียน
                    </label>
                    <button className="btn btn-primary ml-auto text-sm">บันทึกคำตอบ</button>
                  </div>
                </form>
              ) : (
                <div className="mt-4 rounded-xl bg-bg-soft p-4">
                  <p className="whitespace-pre-line text-sm leading-7">{q.answer}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-mute">
                    <span>
                      ตอบโดย {q.answeredBy} · {fmt(q.answeredAt)}
                    </span>
                    <form action={togglePublish} className="ml-auto">
                      <input type="hidden" name="id" value={q.id} />
                      <button className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-ink-soft hover:border-accent">
                        {q.published ? <Eye className="h-3.5 w-3.5 text-good" /> : <EyeOff className="h-3.5 w-3.5" />}
                        {q.published ? "เผยแพร่เป็น FAQ อยู่" : "ไม่เผยแพร่"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
