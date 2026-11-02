import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Room } from "@/content/types";
import { getCategory } from "@/content";
import Icon from "./Icon";

const CAT_GRADIENT: Record<string, string> = {
  foundation: "from-sky-400/25 via-sky-500/5",
  law: "from-indigo-400/25 via-indigo-500/5",
  product: "from-cyan-400/25 via-cyan-500/5",
  service: "from-blue-400/25 via-blue-500/5",
  policy: "from-teal-400/25 via-teal-500/5",
};

export default function RoomCard({ room, size = "md" }: { room: Room; size?: "md" | "sm" }) {
  const cat = getCategory(room.category);
  return (
    <Link href={`/rooms/${room.slug}`} className="card card-hover group relative flex h-full flex-col overflow-hidden">
      <div className={`relative h-28 bg-gradient-to-br ${CAT_GRADIENT[room.category]} to-transparent ${size === "sm" ? "h-20" : ""}`}>
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(var(--grid-line)_1px,transparent_1px)] [background-size:14px_14px]" />
        <span className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-2xl bg-surface/90 text-accent shadow-lg ring-1 ring-line-soft transition group-hover:scale-105">
          <Icon name={room.icon} className="h-6 w-6" />
        </span>
        {room.tariff && <span className="absolute right-4 top-4 rounded-full bg-bg/70 px-2.5 py-0.5 text-[11px] font-semibold text-ink-soft">{room.tariff}</span>}
        <ArrowUpRight className="absolute bottom-3 right-4 h-5 w-5 text-ink-mute transition group-hover:text-accent" />
      </div>
      <div className="flex flex-1 flex-col p-5 pt-4">
        <div className="text-[11px] font-semibold tracking-[0.14em] text-ink-mute">{cat.en}</div>
        <h3 className="font-display mt-1 text-lg font-semibold leading-snug">{room.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{room.tagline}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {room.highlights.slice(0, 3).map((h) => (
            <span key={h} className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-ink-soft">
              {h}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
