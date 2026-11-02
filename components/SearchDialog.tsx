"use client";

import Link from "next/link";
import { BookOpen, MessageCircleQuestion, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SearchHit } from "@/lib/search";

export function useSearch(query: string) {
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => setHits(d.hits ?? []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);
  return { hits, loading };
}

export function hitHref(h: SearchHit) {
  if (h.kind === "glossary") return "/glossary";
  return `/rooms/${h.roomSlug}${h.sectionId ? `#${h.sectionId}` : ""}`;
}

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { hits, loading } = useSearch(q);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[10vh] backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="ค้นหาเนื้อหา">
        <div className="flex items-center gap-3 border-b border-line-soft px-4">
          <Search className="h-5 w-5 text-accent" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="เช่น อัตราภาษีเบียร์, Tax Point, เงินเพิ่ม"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-ink-mute"
          />
          <button onClick={onClose} className="text-ink-mute hover:text-ink" aria-label="ปิด">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {q.trim().length < 2 && <p className="px-3 py-6 text-center text-sm text-ink-mute">พิมพ์อย่างน้อย 2 ตัวอักษร</p>}
          {q.trim().length >= 2 && !loading && hits.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-ink-mute">
              ไม่พบเนื้อหาที่ตรงกัน
              <Link href={`/ask?q=${encodeURIComponent(q)}`} onClick={onClose} className="mt-3 flex items-center justify-center gap-2 font-semibold text-accent">
                <MessageCircleQuestion className="h-4 w-4" /> ส่งคำถามนี้ให้ Expert
              </Link>
            </div>
          )}
          {hits.map((h) => (
            <Link key={h.id} href={hitHref(h)} onClick={onClose} className="block rounded-xl px-3 py-3 hover:bg-surface-2">
              <div className="flex items-center gap-2 text-xs text-ink-mute">
                <BookOpen className="h-3.5 w-3.5" />
                {h.kind === "glossary" ? "คำศัพท์" : h.kind === "faq" ? `FAQ · ${h.roomTitle}` : h.roomTitle}
              </div>
              <div className="font-semibold">{h.title}</div>
              <div className="line-clamp-2 text-sm text-ink-soft">{h.snippet}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
