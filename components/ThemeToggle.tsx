"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "light") setTheme("light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("ea-theme", next);
    } catch {
      /* เบราว์เซอร์ไม่อนุญาตให้เก็บค่า ใช้ธีมได้แค่ในหน้านี้ */
    }
  }

  return (
    <button
      onClick={toggle}
      className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft hover:border-accent hover:text-accent transition"
      aria-label={theme === "dark" ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
      title={theme === "dark" ? "โหมดสว่าง" : "โหมดมืด"}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
