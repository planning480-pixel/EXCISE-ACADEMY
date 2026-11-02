"use client";

import { useState, type ReactNode } from "react";
import Icon from "./Icon";

export default function Tabs({
  tabs,
  panels,
  initial = 0,
}: {
  tabs: { id: string; title: string; count?: number; icon?: string }[];
  panels: ReactNode[];
  initial?: number;
}) {
  const [i, setI] = useState(initial);
  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2" role="tablist">
        {tabs.map((t, k) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              k === i ? "border-accent bg-accent text-accent-ink" : "border-line text-ink-soft hover:border-accent hover:text-ink"
            }`}
          >
            {t.icon && <Icon name={t.icon} className="h-4 w-4" />}
            {t.title}
            {t.count !== undefined && (
              <span className={`rounded-full px-1.5 text-xs ${k === i ? "bg-accent-ink/15" : "bg-surface-2"}`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-6" role="tabpanel">
        {panels[i]}
      </div>
    </div>
  );
}
