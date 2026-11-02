import Link from "next/link";
import { ArrowRight, BookOpenCheck, Calculator, MessageCircleQuestion, Sparkles } from "lucide-react";
import { ROOMS, roomsByCategory, getCategory } from "@/content";
import { CATEGORIES, LATEST_UPDATES, EXPERTS } from "@/content/meta";
import RoomCard from "@/components/RoomCard";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import PriceBreakdown from "@/components/calculators/PriceBreakdown";

export default function Home() {
  const featured = ROOMS.filter((r) => r.featured).map((r) => ({
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    icon: r.icon,
    category: getCategory(r.category).title,
    highlights: r.highlights,
    tariff: r.tariff,
  }));
  const quizCount = ROOMS.reduce((n, r) => n + r.quiz.length, 0);

  return (
    <>
      {/* HERO */}
      <section className="hero-glow relative overflow-hidden border-b border-line-soft">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-20 lg:pt-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1 text-sm text-ink-soft backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
              แหล่งเรียนรู้กลาง กรมสรรพสามิต
            </div>
            <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Excise<span className="text-accent">Academy</span>
              <span className="text-accent">.</span>
            </h1>
            <p className="font-display mt-5 text-2xl font-semibold leading-snug sm:text-3xl">
              เรียนภาษีสรรพสามิต มาตรฐานเดียว
              <br />
              <span className="mark">ถาม Expert ได้ทุกห้อง</span>
            </p>
            <p className="mt-5 max-w-xl text-ink-soft">
              ทุกเรื่องตั้งแต่บทบาทของกรม พ.ร.บ.ภาษีสรรพสามิต 2560 ไปจนถึงอัตราภาษีรายสินค้า อยู่ในที่เดียว ทุกตัวเลขบอกที่มา ลองคำนวณเองได้ และถ้ายังไม่เข้าใจก็ถามผู้เชี่ยวชาญได้ทันที
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/rooms" className="btn btn-primary">
                เริ่มเรียน <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/ask" className="btn btn-ghost">
                <MessageCircleQuestion className="h-4 w-4" /> ถาม Expert
              </Link>
            </div>
          </div>
          <FeaturedCarousel items={featured} />
        </div>
        {/* แถบชิปห้องเรียน */}
        <div className="border-t border-line-soft bg-bg/40">
          <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6">
            {ROOMS.filter((r) => r.category === "product" || r.featured).map((r) => (
              <Link
                key={r.slug}
                href={`/rooms/${r.slug}`}
                className="flex shrink-0 items-center gap-2.5 rounded-2xl border border-line-soft bg-surface/70 py-2 pl-2 pr-4 text-sm hover:border-accent"
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon name={r.icon} className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[10px] uppercase tracking-wider text-ink-mute">{getCategory(r.category).title}</span>
                  <span className="block font-medium leading-tight">{r.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <div className="chip mb-3">ทำไมต้องมีแหล่งเดียว</div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              เข้าใจตรงกัน <span className="text-accent">ทั้งกรม</span>
            </h2>
            <p className="mt-3 text-ink-soft">
              ทุกห้องสรุปจากเอกสารทางการของสำนักแผนภาษีและสำนักกฎหมาย ตัวเลขอัตราภาษีเก็บไว้ที่เดียว ตารางและเครื่องคำนวณทุกหน้าจึงตรงกันเสมอ
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { v: "537,540", l: "ล้านบาท รายได้ปีงบ 68" },
              { v: "#2", l: "แหล่งรายได้ของรัฐ" },
              { v: String(ROOMS.length), l: "ห้องเรียน" },
              { v: String(quizCount), l: "ข้อทดสอบ" },
            ].map((s) => (
              <div key={s.l} className="card p-5">
                <div className="font-display text-3xl font-bold text-accent tabular-nums">{s.v}</div>
                <div className="mt-1 text-xs text-ink-mute">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="chip mb-3">
              <Sparkles className="h-3.5 w-3.5" /> อัปเดตล่าสุด
            </div>
            <h2 className="font-display text-3xl font-bold">เรื่องใหม่ที่ควรรู้</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {LATEST_UPDATES.map((u) => (
            <Link key={u.title} href={`/rooms/${u.slug}`} className="card card-hover group flex gap-4 p-5">
              <div className="w-24 shrink-0">
                <div className="text-xs font-semibold text-accent">{u.date}</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold leading-snug group-hover:text-accent">{u.title}</div>
                <div className="mt-1 text-sm text-ink-soft">{u.text}</div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 self-center text-ink-mute transition group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </section>

      {/* ROOMS BY CATEGORY */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="mb-6">
          <div className="chip mb-3">ทุกห้อง แยกตามหมวด</div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">วันนี้อยากเรียนเรื่องไหน</h2>
        </div>
        <Tabs
          tabs={CATEGORIES.map((c) => ({ id: c.id, title: c.title, count: roomsByCategory(c.id).length, icon: c.icon }))}
          panels={CATEGORIES.map((c) => (
            <div key={c.id}>
              <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-xs font-semibold tracking-[0.18em] text-accent">{c.en}</span>
                <span className="text-ink-soft">{c.description}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {roomsByCategory(c.id).map((r) => (
                  <RoomCard key={r.slug} room={r} />
                ))}
              </div>
            </div>
          ))}
        />
      </section>

      {/* WHAT YOU CAN DO */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <div className="chip mb-3">ไม่ใช่แค่อ่านแล้วจำ</div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">ในห้องทำอะไรได้บ้าง</h2>
          <p className="mt-3 text-ink-soft">ทุกห้องมีครบทั้งอ่าน ลองคำนวณ ทดสอบ และถาม ลองของจริงข้างล่างนี้ได้เลย</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className="card p-6">
            <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-accent">
              <Calculator className="h-4 w-4" /> ลองเลย: แยกส่วนราคา
            </div>
            <h3 className="font-display mb-4 text-xl font-bold">ของหนึ่งชิ้น มีภาษีอยู่เท่าไร</h3>
            <PriceBreakdown />
          </div>
          <div className="grid gap-5">
            <Link href="/rooms/tax-base" className="card card-hover group p-6">
              <BookOpenCheck className="h-7 w-7 text-accent" />
              <h3 className="font-display mt-3 text-xl font-bold">อ่านสรุป + แบบทดสอบ</h3>
              <p className="mt-1 text-sm text-ink-soft">ทุกห้องสรุปสั้น มีตาราง ตัวอย่างคำนวณ และแบบทดสอบท้ายห้องพร้อมเฉลย</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                ลองห้องฐานภาษี <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
            <Link href="/ask" className="card card-hover group p-6">
              <MessageCircleQuestion className="h-7 w-7 text-accent" />
              <h3 className="font-display mt-3 text-xl font-bold">ถาม Expert {EXPERTS.length} ด้าน</h3>
              <p className="mt-1 text-sm text-ink-soft">พิมพ์คำถาม ระบบหาเนื้อหาที่ตอบได้ให้ก่อน ถ้ายังไม่ชัด ส่งต่อผู้เชี่ยวชาญของกรมได้เลย</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {EXPERTS.slice(0, 6).map((e) => (
                  <span key={e.id} className="grid h-8 w-8 place-items-center rounded-lg bg-accent-soft text-accent" title={e.name}>
                    <Icon name={e.icon} className="h-4 w-4" />
                  </span>
                ))}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent-deep to-[#0b3a7a] p-8 text-white sm:p-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <h2 className="font-display relative text-3xl font-bold sm:text-4xl">อ่านแล้วยังสงสัย? ถามได้เลย</h2>
          <p className="relative mt-3 max-w-xl text-white/80">ผู้เชี่ยวชาญแต่ละสินค้าพร้อมช่วย คำตอบที่ดีจะขึ้นเป็น FAQ ให้ทุกคนได้ประโยชน์</p>
          <Link href="/ask" className="btn relative mt-6 bg-white text-[#0b2a5c] hover:bg-sky-100">
            ไปที่ถาม Expert <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
