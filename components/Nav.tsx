"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import SearchDialog from "./SearchDialog";

const LINKS = [
  { href: "/rooms", label: "ห้องเรียน" },
  { href: "/tools", label: "เครื่องคำนวณ" },
  { href: "/ask", label: "ถาม Expert" },
  { href: "/glossary", label: "คำศัพท์" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="เมนูหลัก">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  active ? "bg-accent-soft text-accent" : "text-ink-soft hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-ink-mute hover:border-accent sm:flex"
          >
            <Search className="h-4 w-4" />
            ค้นหาเนื้อหา
            <kbd className="rounded bg-surface-2 px-1.5 text-[10px] text-ink-mute">Ctrl K</kbd>
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft sm:hidden"
            aria-label="ค้นหา"
          >
            <Search className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <Link href="/ask" className="btn btn-primary hidden text-sm lg:inline-flex">
            ถาม Expert
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line md:hidden"
            aria-label="เมนู"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line-soft px-4 pb-4 md:hidden" aria-label="เมนูมือถือ">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="block rounded-xl px-3 py-3 font-medium hover:bg-surface">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
