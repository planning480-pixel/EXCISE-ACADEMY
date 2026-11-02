import type { Metadata } from "next";
import Link from "next/link";
import { getRoom } from "@/content";
import { EXPERTS } from "@/content/meta";
import type { ExpertId } from "@/content/types";
import AskPanel from "@/components/AskPanel";
import Icon from "@/components/Icon";
import { aiEnabled } from "@/lib/ai";

export const metadata: Metadata = { title: "ถาม Expert" };
export const dynamic = "force-dynamic";

export default async function AskPage({ searchParams }: { searchParams: Promise<{ q?: string; expert?: string }> }) {
  const { q, expert } = await searchParams;
  const expertId = EXPERTS.find((e) => e.id === expert)?.id as ExpertId | undefined;
  const ai = aiEnabled();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <div className="chip mb-3">{EXPERTS.length} ด้าน</div>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          ถาม <span className="mark">Expert</span>
        </h1>
        <p className="mt-4 text-ink-soft">
          พิมพ์คำถาม ระบบจะหาเนื้อหาในห้องเรียนที่ตอบได้ให้ก่อน
          {ai ? " ผู้ช่วย AI สรุปคำตอบให้ได้" : ""} ถ้ายังไม่ชัด ส่งต่อให้ผู้เชี่ยวชาญของกรมตอบได้ คำตอบที่ดีจะขึ้นเป็น FAQ ในห้องเรียน
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_1fr]">
        <div className="card p-5 sm:p-6">
          <AskPanel aiEnabled={ai} initialQuestion={q ?? ""} expertId={expertId} />
        </div>
        <aside className="space-y-3">
          <div className="text-xs font-semibold tracking-wider text-ink-mute">EXPERT แต่ละด้าน</div>
          {EXPERTS.map((e) => (
            <div key={e.id} className="card p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon name={e.icon} className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-semibold">{e.name}</div>
                  <div className="text-xs text-ink-mute">{e.unit}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {e.rooms.map((s) => {
                  const r = getRoom(s);
                  return r ? (
                    <Link key={s} href={`/rooms/${s}`} className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-ink-soft hover:text-accent">
                      {r.title}
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
