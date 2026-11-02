"use client";

import { CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { QuizQuestion } from "@/content/types";

function load(slug: string): number | null {
  try {
    const v = localStorage.getItem(`ea-quiz-${slug}`);
    return v === null ? null : Number(v);
  } catch {
    return null;
  }
}
function save(slug: string, score: number) {
  try {
    const prev = load(slug);
    if (prev === null || score > prev) localStorage.setItem(`ea-quiz-${slug}`, String(score));
  } catch {
    /* เก็บคะแนนไม่ได้ ไม่เป็นไร */
  }
}

export default function Quiz({ slug, questions }: { slug: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [best, setBest] = useState<number | null>(null);
  useEffect(() => setBest(load(slug)), [slug]);

  const done = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === questions[i].answer).length;

  useEffect(() => {
    if (done) {
      save(slug, score);
      setBest(load(slug));
    }
  }, [done, score, slug]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink-soft">
        <span>ตอบครบ {answers.filter((a) => a !== null).length}/{questions.length} ข้อ</span>
        {best !== null && <span className="chip">คะแนนดีที่สุด {best}/{questions.length}</span>}
      </div>
      {questions.map((q, i) => {
        const a = answers[i];
        return (
          <div key={i} className="rounded-2xl border border-line-soft bg-bg-soft p-4">
            <div className="mb-3 font-medium">
              <span className="mr-2 text-accent">{i + 1}.</span>
              {q.q}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.choices.map((c, j) => {
                const picked = a === j;
                const correct = j === q.answer;
                let cls = "border-line hover:border-accent";
                if (a !== null) {
                  if (correct) cls = "border-good bg-good/10";
                  else if (picked) cls = "border-bad bg-bad/10";
                  else cls = "border-line-soft opacity-60";
                }
                return (
                  <button
                    key={j}
                    disabled={a !== null}
                    onClick={() => setAnswers((prev) => prev.map((x, k) => (k === i ? j : x)))}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition ${cls}`}
                  >
                    {a !== null && correct && <CheckCircle2 className="h-4 w-4 shrink-0 text-good" />}
                    {a !== null && picked && !correct && <XCircle className="h-4 w-4 shrink-0 text-bad" />}
                    {c}
                  </button>
                );
              })}
            </div>
            {a !== null && (
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                <span className="font-semibold text-accent">เฉลย: </span>
                {q.explain}
              </p>
            )}
          </div>
        );
      })}
      {done && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-accent/40 bg-accent-soft p-5">
          <Trophy className="h-8 w-8 text-accent" />
          <div className="flex-1">
            <div className="font-display text-xl font-bold">
              ได้ {score}/{questions.length} คะแนน
            </div>
            <div className="text-sm text-ink-soft">{score === questions.length ? "เยี่ยมมาก เข้าใจห้องนี้ครบแล้ว" : "ทบทวนข้อที่พลาด แล้วลองใหม่ได้เลย"}</div>
          </div>
          <button onClick={() => setAnswers(questions.map(() => null))} className="btn btn-ghost text-sm">
            <RotateCcw className="h-4 w-4" /> ทำใหม่
          </button>
        </div>
      )}
    </div>
  );
}
