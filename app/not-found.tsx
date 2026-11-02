import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="font-display text-7xl font-bold text-accent">404</div>
      <h1 className="font-display mt-4 text-2xl font-bold">ไม่พบหน้าที่ต้องการ</h1>
      <p className="mt-2 text-ink-soft">ห้องเรียนนี้อาจถูกย้ายหรือยังไม่มี ลองค้นหาด้วย Ctrl K หรือกลับไปดูห้องทั้งหมด</p>
      <Link href="/rooms" className="btn btn-primary mt-6">
        ไปที่ห้องเรียนทั้งหมด
      </Link>
    </div>
  );
}
