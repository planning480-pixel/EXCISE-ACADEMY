"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { login } from "./actions";

export default function LoginForm({ seeded }: { seeded: boolean }) {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="card mx-auto max-w-md space-y-4 p-6">
      <div>
        <h1 className="font-display text-2xl font-bold">สำหรับผู้เชี่ยวชาญ</h1>
        <p className="mt-1 text-sm text-ink-soft">เข้าสู่ระบบเพื่อตอบคำถามที่ส่งต่อมาจากผู้เรียน</p>
      </div>
      {!seeded && (
        <p className="rounded-xl border border-warn/40 bg-warn/10 p-3 text-sm text-ink-soft">
          ยังไม่มีบัญชีผู้เชี่ยวชาญ ให้ผู้ดูแลระบบตั้งค่า <code>EXPERT_DEFAULT_PASSWORD</code> ในไฟล์ .env.local แล้วเปิดเว็บใหม่
        </p>
      )}
      <input name="username" required autoComplete="username" placeholder="ชื่อผู้ใช้ เช่น expert-liquor" className="input" />
      <input name="password" type="password" required autoComplete="current-password" placeholder="รหัสผ่าน" className="input" />
      {state?.error && <p className="text-sm text-bad">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full justify-center">
        <LogIn className="h-4 w-4" /> {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
