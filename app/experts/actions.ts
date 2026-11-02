"use server";

import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, experts, questions } from "@/lib/db";
import { createSession, destroySession, getSession } from "@/lib/session";

export async function login(_: unknown, form: FormData): Promise<{ error?: string }> {
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const row = db().select().from(experts).where(eq(experts.username, username)).get();
  if (!row || !bcrypt.compareSync(password, row.passwordHash)) {
    return { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
  }
  await createSession({ uid: row.id, username: row.username, name: row.name, topic: row.topic });
  redirect("/experts");
}

export async function logout() {
  await destroySession();
  redirect("/experts");
}

async function requireExpert() {
  const s = await getSession();
  if (!s) throw new Error("กรุณาเข้าสู่ระบบ");
  return s;
}

function canEdit(topic: string, s: { topic: string }) {
  return s.topic === "all" || s.topic === topic;
}

export async function answerQuestion(form: FormData) {
  const s = await requireExpert();
  const id = Number(form.get("id"));
  const answer = String(form.get("answer") ?? "").trim().slice(0, 5000);
  const publish = form.get("publish") === "on";
  const q = db().select().from(questions).where(eq(questions.id, id)).get();
  if (!q || !canEdit(q.topic, s) || answer.length < 2) return;
  db()
    .update(questions)
    .set({ answer, status: "answered", answeredBy: s.name, answeredAt: Date.now(), published: publish ? 1 : 0 })
    .where(eq(questions.id, id))
    .run();
  revalidatePath("/experts");
}

export async function togglePublish(form: FormData) {
  const s = await requireExpert();
  const id = Number(form.get("id"));
  const q = db().select().from(questions).where(and(eq(questions.id, id), eq(questions.status, "answered"))).get();
  if (!q || !canEdit(q.topic, s)) return;
  db().update(questions).set({ published: q.published ? 0 : 1 }).where(eq(questions.id, id)).run();
  revalidatePath("/experts");
}
