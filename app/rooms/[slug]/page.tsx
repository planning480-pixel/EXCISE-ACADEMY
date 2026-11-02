import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ClipboardCheck, FileText, GraduationCap, MessageCircleQuestion } from "lucide-react";
import { getCategory, getRoom, neighbors } from "@/content";
import { EXPERTS, SOURCES } from "@/content/meta";
import { BlockView } from "@/components/Blocks";
import Icon from "@/components/Icon";
import Quiz from "@/components/Quiz";
import AskPanel from "@/components/AskPanel";
import { publishedFaq } from "@/lib/faq";
import { aiEnabled } from "@/lib/ai";

export const dynamic = "force-dynamic"; // FAQ ดึงจากฐานข้อมูลทุกครั้ง

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getRoom(slug);
  return r ? { title: r.title, description: r.summary } : {};
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();
  const cat = getCategory(room.category);
  const expert = EXPERTS.find((e) => e.id === room.expertId)!;
  const faq = publishedFaq(room.slug);
  const { prev, next } = neighbors(room.slug);

  const toc = [
    ...room.sections.map((s) => ({ id: s.id, title: s.title })),
    ...(faq.length ? [{ id: "faq", title: "คำถามที่พบบ่อย" }] : []),
    { id: "quiz", title: "แบบทดสอบ" },
    { id: "ask", title: "ถาม Expert" },
  ];

  return (
    <div>
      {/* ส่วนหัวห้อง */}
      <header className="hero-glow border-b border-line-soft">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6">
          <nav className="mb-6 flex items-center gap-2 text-sm text-ink-mute" aria-label="breadcrumb">
            <Link href="/rooms" className="hover:text-accent">
              ห้องเรียน
            </Link>
            <span>/</span>
            <Link href={`/rooms?cat=${cat.id}`} className="hover:text-accent">
              {cat.title}
            </Link>
          </nav>
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-accent to-accent-deep text-accent-ink shadow-[0_0_50px_-12px_var(--accent)]">
              <Icon name={room.icon} className="h-10 w-10" strokeWidth={1.6} />
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold tracking-[0.18em] text-accent">{cat.en}</span>
                {room.tariff && <span className="chip">{room.tariff}</span>}
              </div>
              <h1 className="font-display mt-1 text-4xl font-bold sm:text-5xl">{room.title}</h1>
              <p className="mt-2 text-lg text-ink-soft">{room.tagline}</p>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-ink-soft">{room.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-ink-soft">
              <FileText className="h-3.5 w-3.5" /> ข้อมูล ณ {room.asOf}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-ink-soft">
              <GraduationCap className="h-3.5 w-3.5" /> {room.sections.length} หัวข้อ · แบบทดสอบ {room.quiz.length} ข้อ
            </span>
            {room.review?.length ? (
              <a href="#review" className="flex items-center gap-1.5 rounded-full border border-review/50 bg-review/10 px-3 py-1 text-review">
                <ClipboardCheck className="h-3.5 w-3.5" /> มี {room.review.length} ประเด็นรอตรวจ
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* สารบัญ */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1 text-sm" aria-label="สารบัญ">
            <div className="mb-3 text-xs font-semibold tracking-wider text-ink-mute">ในห้องนี้</div>
            {toc.map((t) => (
              <a key={t.id} href={`#${t.id}`} className="block rounded-lg px-3 py-1.5 text-ink-soft hover:bg-surface hover:text-accent">
                {t.title}
              </a>
            ))}
            <div className="pt-4">
              <a href="#ask" className="flex items-center gap-2 rounded-xl bg-accent-soft px-3 py-2.5 font-semibold text-accent">
                <MessageCircleQuestion className="h-4 w-4" /> ถาม {expert.name.replace("Expert ", "")}
              </a>
            </div>
          </nav>
        </aside>

        <article className="min-w-0 space-y-14">
          {room.sections.map((s, idx) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-display text-sm font-bold text-accent">{String(idx + 1).padStart(2, "0")}</span>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">{s.title}</h2>
              </div>
              <div className="space-y-5">
                {s.blocks.map((b, i) => (
                  <BlockView key={i} b={b} />
                ))}
              </div>
              {s.sources && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.sources.map((src, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] text-ink-mute" title={SOURCES[src.doc].full}>
                      <FileText className="h-3 w-3" /> ที่มา: {SOURCES[src.doc].short} หน้า {src.pages}
                    </span>
                  ))}
                </div>
              )}
            </section>
          ))}

          {room.review?.length ? (
            <section id="review" className="scroll-mt-24 rounded-2xl border border-review/40 bg-review/10 p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold text-review">
                <ClipboardCheck className="h-5 w-5" /> ประเด็นที่รอผู้เชี่ยวชาญของกรมตรวจ
              </div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">
                {room.review.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {faq.length > 0 && (
            <section id="faq" className="scroll-mt-24">
              <h2 className="font-display mb-5 text-2xl font-bold sm:text-3xl">คำถามที่พบบ่อย</h2>
              <div className="space-y-3">
                {faq.map((f) => (
                  <details key={f.id} className="card group p-4">
                    <summary className="cursor-pointer list-none font-semibold marker:hidden">
                      <span className="text-accent">ถาม: </span>
                      {f.question}
                    </summary>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink-soft">{f.answer}</p>
                    {f.answeredBy && <p className="mt-2 text-xs text-ink-mute">ตอบโดย {f.answeredBy}</p>}
                  </details>
                ))}
              </div>
            </section>
          )}

          <section id="quiz" className="scroll-mt-24">
            <h2 className="font-display mb-2 text-2xl font-bold sm:text-3xl">แบบทดสอบท้ายห้อง</h2>
            <p className="mb-5 text-ink-soft">ตอบทีละข้อ เฉลยขึ้นทันที คะแนนดีที่สุดเก็บไว้ในเครื่องนี้</p>
            <Quiz slug={room.slug} questions={room.quiz} />
          </section>

          <section id="ask" className="scroll-mt-24">
            <div className="card p-5 sm:p-6">
              <h2 className="font-display mb-1 text-2xl font-bold">ยังไม่เข้าใจ? ถาม Expert</h2>
              <p className="mb-5 text-sm text-ink-soft">ระบบจะหาเนื้อหาที่ตอบได้ก่อน ถ้ายังไม่ชัด ส่งต่อให้ {expert.unit} ได้เลย</p>
              <AskPanel aiEnabled={aiEnabled()} expertId={room.expertId} roomSlug={room.slug} compact />
            </div>
          </section>

          <nav className="grid gap-3 border-t border-line-soft pt-8 sm:grid-cols-2" aria-label="ห้องถัดไป">
            {prev ? (
              <Link href={`/rooms/${prev.slug}`} className="card card-hover p-4">
                <div className="flex items-center gap-1 text-xs text-ink-mute">
                  <ArrowLeft className="h-3.5 w-3.5" /> ห้องก่อนหน้า
                </div>
                <div className="mt-1 font-semibold">{prev.title}</div>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/rooms/${next.slug}`} className="card card-hover p-4 text-right">
                <div className="flex items-center justify-end gap-1 text-xs text-ink-mute">
                  ห้องถัดไป <ArrowRight className="h-3.5 w-3.5" />
                </div>
                <div className="mt-1 font-semibold">{next.title}</div>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}
