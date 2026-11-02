"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Loader2, Send, Sparkles, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EXPERTS } from "@/content/meta";
import type { ExpertId } from "@/content/types";
import type { SearchHit } from "@/lib/search";
import { hitHref } from "./SearchDialog";
import Icon from "./Icon";
import Rich from "./Rich";

type Stage = "idle" | "searching" | "results" | "ai" | "escalate" | "sent";

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem("ea-profile") ?? "{}") as { name?: string; unit?: string; contact?: string };
  } catch {
    return {};
  }
}

export default function AskPanel({
  aiEnabled,
  expertId: fixedExpert,
  roomSlug,
  initialQuestion = "",
  compact = false,
}: {
  aiEnabled: boolean;
  expertId?: ExpertId;
  roomSlug?: string;
  initialQuestion?: string;
  compact?: boolean;
}) {
  const [expertId, setExpertId] = useState<ExpertId>(fixedExpert ?? "general");
  const [q, setQ] = useState(initialQuestion);
  const [stage, setStage] = useState<Stage>("idle");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [aiText, setAiText] = useState("");
  const [aiError, setAiError] = useState("");
  const [form, setForm] = useState({ name: "", unit: "", contact: "" });
  const [sendError, setSendError] = useState("");
  const [ticket, setTicket] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const expert = EXPERTS.find((e) => e.id === expertId)!;

  useEffect(() => {
    const p = loadProfile();
    setForm({ name: p.name ?? "", unit: p.unit ?? "", contact: p.contact ?? "" });
  }, []);

  useEffect(() => {
    if (fixedExpert) setExpertId(fixedExpert);
  }, [fixedExpert]);

  async function runSearch(question = q) {
    if (question.trim().length < 3) return;
    setStage("searching");
    setAiText("");
    setAiError("");
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(question)}&limit=5`);
      const d = await r.json();
      setHits(d.hits ?? []);
    } catch {
      setHits([]);
    }
    setStage("results");
  }

  async function askAi() {
    setStage("ai");
    setAiText("");
    setAiError("");
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expertId, question: q, roomSlug }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "ผู้ช่วย AI ไม่พร้อมใช้งานตอนนี้");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        setAiText((t) => t + dec.decode(value, { stream: true }));
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setAiError((e as Error).message);
    }
  }

  async function send() {
    setSendError("");
    try {
      localStorage.setItem("ea-profile", JSON.stringify(form));
    } catch {
      /* ไม่จำข้อมูลผู้ถามก็ได้ */
    }
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: expertId, question: q, roomSlug, askerName: form.name, askerUnit: form.unit, askerContact: form.contact }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) {
      setSendError(d.error ?? "ส่งไม่สำเร็จ ลองใหม่อีกครั้ง");
      return;
    }
    setTicket(d.id);
    setStage("sent");
  }

  function reset() {
    setQ("");
    setHits([]);
    setAiText("");
    setStage("idle");
  }

  return (
    <div className="space-y-4">
      {!fixedExpert && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {EXPERTS.map((e) => (
            <button
              key={e.id}
              onClick={() => setExpertId(e.id)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                e.id === expertId ? "border-accent bg-accent-soft text-accent" : "border-line-soft hover:border-accent"
              }`}
            >
              <Icon name={e.icon} className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{e.name.replace("Expert ", "")}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent text-accent-ink">
          <Icon name={expert.icon} className="h-5 w-5" />
        </span>
        <div>
          <div className="font-semibold">{expert.name}</div>
          <div className="text-xs text-ink-mute">{expert.role}</div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch();
        }}
        className="relative"
      >
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          rows={compact ? 2 : 3}
          placeholder="พิมพ์คำถาม เช่น เบียร์ 5% กระป๋อง 320 มล. เสียภาษีเท่าไร"
          className="input resize-none pr-14"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              runSearch();
            }
          }}
        />
        <button type="submit" disabled={q.trim().length < 3 || stage === "searching"} className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-ink disabled:opacity-40" aria-label="ถาม">
          {stage === "searching" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>

      {stage === "idle" && (
        <div className="flex flex-wrap gap-2">
          {expert.starters.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQ(s);
                runSearch(s);
              }}
              className="rounded-full border border-line-soft px-3 py-1 text-xs text-ink-soft hover:border-accent hover:text-accent"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {(stage === "results" || stage === "ai" || stage === "escalate") && (
        <div className="space-y-3">
          <div className="text-xs font-semibold tracking-wide text-ink-mute">เนื้อหาในห้องเรียนที่น่าจะตอบคำถามนี้</div>
          {hits.length === 0 && <p className="rounded-xl bg-bg-soft p-3 text-sm text-ink-soft">ยังไม่พบเนื้อหาที่ตรงกับคำถาม</p>}
          {hits.map((h) => (
            <Link key={h.id} href={hitHref(h)} className="group block rounded-xl border border-line-soft bg-bg-soft p-3 hover:border-accent">
              <div className="flex items-center gap-1.5 text-xs text-ink-mute">
                <BookOpen className="h-3.5 w-3.5" />
                {h.kind === "faq" ? `FAQ · ${h.roomTitle ?? ""}` : h.kind === "glossary" ? "คำศัพท์" : h.roomTitle}
              </div>
              <div className="font-medium group-hover:text-accent">{h.title}</div>
              <div className="line-clamp-2 text-sm text-ink-soft">{h.snippet}</div>
            </Link>
          ))}

          {stage === "ai" && (
            <div className="rounded-2xl border border-accent/40 bg-accent-soft p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-accent">
                <Sparkles className="h-4 w-4" /> คำตอบจากผู้ช่วย AI
              </div>
              {!aiText && !aiError && <Loader2 className="h-4 w-4 animate-spin text-accent" />}
              {aiError && <p className="text-sm text-bad">{aiError}</p>}
              <div className="space-y-2 text-sm leading-7 text-ink">
                {aiText.split(/\n{2,}/).map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    <Rich text={para} />
                  </p>
                ))}
              </div>
              {aiText && <p className="mt-3 text-xs text-ink-mute">AI ตอบจากเนื้อหาในห้องเรียนเท่านั้น และอาจผิดพลาดได้ ใช้อ้างอิงทางกฎหมายให้ตรวจกับตัวบทหรือถามผู้เชี่ยวชาญ</p>}
            </div>
          )}

          {stage !== "escalate" && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-sm text-ink-soft">ยังไม่ตอบโจทย์?</span>
              {aiEnabled && stage !== "ai" && (
                <button onClick={askAi} className="btn btn-primary text-sm">
                  <Sparkles className="h-4 w-4" /> ให้ AI สรุปคำตอบ
                </button>
              )}
              <button onClick={() => setStage("escalate")} className="btn btn-ghost text-sm">
                <UserRound className="h-4 w-4" /> ส่งต่อผู้เชี่ยวชาญ
              </button>
            </div>
          )}
        </div>
      )}

      {stage === "escalate" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="space-y-3 rounded-2xl border border-line-soft bg-bg-soft p-4"
        >
          <div className="text-sm font-semibold">ส่งคำถามให้ผู้เชี่ยวชาญ · {expert.unit}</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input" required placeholder="ชื่อ-นามสกุล" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" required placeholder="หน่วยงาน เช่น สรรพสามิตพื้นที่..." value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
          <input className="input" placeholder="ช่องทางติดต่อกลับ (ไม่บังคับ) เช่น อีเมลราชการหรือเบอร์ภายใน" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          {sendError && <p className="text-sm text-bad">{sendError}</p>}
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary text-sm">
              <Send className="h-4 w-4" /> ส่งคำถาม
            </button>
            <button type="button" onClick={() => setStage("results")} className="btn btn-ghost text-sm">
              ยกเลิก
            </button>
          </div>
        </form>
      )}

      {stage === "sent" && (
        <div className="flex items-start gap-3 rounded-2xl border border-good/40 bg-good/10 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-good" />
          <div className="text-sm">
            <div className="font-semibold">ส่งคำถามแล้ว (เลขที่ #{ticket})</div>
            <div className="text-ink-soft">ผู้เชี่ยวชาญจะตอบกลับ และคำตอบที่เป็นประโยชน์จะขึ้นเป็น FAQ ในห้องเรียน</div>
            <button onClick={reset} className="mt-2 inline-flex items-center gap-1 font-semibold text-accent">
              ถามคำถามใหม่ <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
