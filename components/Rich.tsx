import { Fragment } from "react";

/** แสดงข้อความที่มี **ตัวหนา** แบบง่าย */
export default function Rich({ text }: { text: string | number }) {
  const s = String(text);
  if (!s.includes("**")) return <>{s}</>;
  const parts = s.split("**");
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-ink">
            {p}
          </strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}
