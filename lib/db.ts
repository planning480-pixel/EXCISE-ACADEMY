import "server-only";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { EXPERTS } from "@/content/meta";

export const experts = sqliteTable("experts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  unit: text("unit").notNull(),
  topic: text("topic").notNull(), // ExpertId หรือ "all"
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  topic: text("topic").notNull(),
  roomSlug: text("room_slug"),
  askerName: text("asker_name").notNull(),
  askerUnit: text("asker_unit").notNull(),
  askerContact: text("asker_contact"),
  question: text("question").notNull(),
  status: text("status").notNull().default("pending"), // pending | answered
  answer: text("answer"),
  answeredBy: text("answered_by"),
  answeredAt: integer("answered_at"),
  published: integer("published").notNull().default(0),
  createdAt: integer("created_at").notNull(),
});

export type QuestionRow = typeof questions.$inferSelect;
export type ExpertRow = typeof experts.$inferSelect;

const BOOTSTRAP = `
CREATE TABLE IF NOT EXISTS experts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  topic TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic TEXT NOT NULL,
  room_slug TEXT,
  asker_name TEXT NOT NULL,
  asker_unit TEXT NOT NULL,
  asker_contact TEXT,
  question TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  answer TEXT,
  answered_by TEXT,
  answered_at INTEGER,
  published INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic, status);
CREATE INDEX IF NOT EXISTS idx_questions_room ON questions(room_slug, published);
`;

function open() {
  const file = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "academy.db");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const sqlite = new Database(file);
  sqlite.pragma("journal_mode = WAL");
  sqlite.exec(BOOTSTRAP);
  seedExperts(sqlite);
  return drizzle(sqlite);
}

/** สร้างบัญชีผู้เชี่ยวชาญครั้งแรก ถ้ายังไม่มีบัญชีและตั้งรหัสผ่านเริ่มต้นไว้ใน .env.local */
function seedExperts(sqlite: Database.Database) {
  const pw = process.env.EXPERT_DEFAULT_PASSWORD;
  if (!pw) return;
  const n = sqlite.prepare("SELECT COUNT(*) AS n FROM experts").get() as { n: number };
  if (n.n > 0) return;
  const hash = bcrypt.hashSync(pw, 10);
  const insert = sqlite.prepare(
    "INSERT INTO experts (username, name, unit, topic, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  );
  const now = Date.now();
  insert.run("admin", "ผู้ดูแลระบบ", "สำนักแผนภาษี", "all", hash, now);
  for (const e of EXPERTS) insert.run(`expert-${e.id}`, e.name, e.unit, e.id, hash, now);
}

const g = globalThis as unknown as { __eaDb?: ReturnType<typeof open> };
export function db() {
  if (!g.__eaDb) g.__eaDb = open();
  return g.__eaDb;
}
