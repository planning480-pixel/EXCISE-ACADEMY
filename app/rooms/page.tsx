import type { Metadata } from "next";
import Link from "next/link";
import { ROOMS, roomsByCategory } from "@/content";
import { CATEGORIES } from "@/content/meta";
import type { CategoryId } from "@/content/types";
import RoomCard from "@/components/RoomCard";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "ห้องเรียนทั้งหมด" };

export default async function RoomsPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const active = CATEGORIES.find((c) => c.id === cat)?.id as CategoryId | undefined;
  const cats = active ? CATEGORIES.filter((c) => c.id === active) : CATEGORIES;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <div className="chip mb-3">{ROOMS.length} ห้องเรียน</div>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">ห้องเรียนทั้งหมด</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">เลือกตามหมวด หรือกด Ctrl K เพื่อค้นหาเนื้อหาในทุกห้อง</p>
      </div>
      <div className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4">
        <Link href="/rooms" className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${!active ? "border-accent bg-accent text-accent-ink" : "border-line text-ink-soft hover:border-accent"}`}>
          ทั้งหมด
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/rooms?cat=${c.id}`}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${active === c.id ? "border-accent bg-accent text-accent-ink" : "border-line text-ink-soft hover:border-accent"}`}
          >
            <Icon name={c.icon} className="h-4 w-4" />
            {c.title}
            <span className="text-xs opacity-70">{roomsByCategory(c.id).length}</span>
          </Link>
        ))}
      </div>
      <div className="space-y-14">
        {cats.map((c) => (
          <section key={c.id} id={c.id}>
            <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line-soft pb-3">
              <span className="text-xs font-semibold tracking-[0.18em] text-accent">{c.en}</span>
              <h2 className="font-display text-2xl font-bold">{c.title}</h2>
              <span className="text-sm text-ink-mute">{c.description}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {roomsByCategory(c.id).map((r) => (
                <RoomCard key={r.slug} room={r} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
