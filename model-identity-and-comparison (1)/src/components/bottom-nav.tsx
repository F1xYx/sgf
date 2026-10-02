"use client";

import { BellRing, CalendarDays, SlidersHorizontal } from "lucide-react";
import { cn } from "./ui-bits";

export type TabId = "schedule" | "bells" | "more";

const TABS = [
  { id: "schedule" as const, label: "Расписание", icon: CalendarDays },
  { id: "bells" as const, label: "Звонки", icon: BellRing },
  { id: "more" as const, label: "Ещё", icon: SlidersHorizontal },
];

/** Compact, predictable Material-style navigation bar. */
export default function BottomNav({
  tab,
  onChange,
}: {
  tab: TabId;
  onChange: (t: TabId) => void;
}) {
  return (
    <nav
      aria-label="Основная навигация"
      className="grid min-h-[72px] grid-cols-3 gap-1 rounded-[26px] border border-stroke bg-coal/95 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = id === tab;
        return (
          <button
            key={id}
            type="button"
            aria-current={active ? "page" : undefined}
            aria-label={label}
            onClick={() => onChange(id)}
            className={cn(
              "flex min-h-[60px] min-w-0 touch-manipulation flex-col items-center justify-center gap-1 rounded-[21px] px-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
              active
                ? "bg-lime/20 text-lime"
                : "text-fog hover:bg-soft2 hover:text-snow active:bg-soft2",
            )}
          >
            <Icon className="size-[21px]" strokeWidth={active ? 2.7 : 2.1} />
            <span className="truncate text-[11px] font-bold leading-none">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
