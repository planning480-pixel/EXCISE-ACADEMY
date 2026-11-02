import "server-only";

/** ผู้ช่วย AI เปิดใช้เมื่อมี ANTHROPIC_API_KEY เท่านั้น */
export function aiEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}
