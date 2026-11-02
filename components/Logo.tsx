import Link from "next/link";

export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const text = size === "lg" ? "text-2xl" : "text-lg";
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Excise Academy หน้าแรก">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-ink shadow-[0_0_24px_-4px_var(--accent)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 9.5 12 5l9 4.5-9 4.5L3 9.5Z" />
          <path d="M7 11.5V16c0 1.1 2.2 2.5 5 2.5s5-1.4 5-2.5v-4.5" />
        </svg>
      </span>
      <span className={`font-display ${text} font-bold tracking-tight leading-none`}>
        Excise<span className="text-accent">Academy</span>
        <span className="text-accent">.</span>
      </span>
    </Link>
  );
}
