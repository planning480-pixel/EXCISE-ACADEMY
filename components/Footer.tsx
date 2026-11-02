import Link from "next/link";
import Logo from "./Logo";
import { CATEGORIES, LINKS, SOURCES, AS_OF } from "@/content/meta";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line-soft bg-bg-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-md text-sm text-ink-soft">
            แหล่งเรียนรู้กลางของกรมสรรพสามิต เนื้อหาสรุปจากเอกสารทางการเพื่อการเรียนรู้ เวลาใช้อ้างอิงทางกฎหมายให้ยึดตัวบทใน LawELCS
          </p>
          <p className="text-xs text-ink-mute">
            ข้อมูล ณ {AS_OF} · ที่มา: {SOURCES.role.short} และ {SOURCES.act.short}
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">ห้องเรียน</h3>
          <ul className="space-y-2 text-sm text-ink-soft">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/rooms?cat=${c.id}`} className="hover:text-accent">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">ลิงก์ที่เกี่ยวข้อง</h3>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li>
              <a href={LINKS.excise} target="_blank" rel="noreferrer" className="hover:text-accent">
                excise.go.th
              </a>
            </li>
            <li>
              <a href={LINKS.lawelcs} target="_blank" rel="noreferrer" className="hover:text-accent">
                LawELCS ค้นกฎหมาย
              </a>
            </li>
            <li>
              <Link href="/experts" className="hover:text-accent">
                สำหรับผู้เชี่ยวชาญ
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
