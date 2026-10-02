"use client";

import { motion } from "framer-motion";
import { BellRing, CalendarDays, SlidersHorizontal } from "lucide-react";
import { cn } from "./ui-bits";

export type TabId = "schedule" | "bells" | "more";

const TABS: Array<{
  id: TabId;
  label: string;
  icon: typeof CalendarDays;
}> = [
  { id: "schedule", label: "Расписание", icon: CalendarDays },
  { id: "bells", label: "Звонки", icon: BellRing },
  { id: "more", label: "Ещё", icon: SlidersHorizontal },
];

/** Material You navigation bar: pill indicator + always-visible labels,
 *  плавающая «док-панель» в духе iOS. */
export default function BottomNav({
  tab,
  onChange,
}: {
  tab: TabId;
  onChange: (t: TabId) => void;
}) {
  return (
    <nav aria-label="Основная навигация" className="flex items-center gap-1 rounded-[28px] border border-stroke bg-coal/90 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      {TABS.map((t) => {
        const active = t.id === tab;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              if (!active) {
                try {
                  navigator.vibrate?.(6);
                } catch {
                  /* noop */
                }
                onChange(t.id);
              }
            }}
            aria-current={active ? "page" : undefined}
            aria-label={t.label}
            className="flex min-h-14 flex-1 flex-col items-center gap-1 rounded-2xl py-1 transition-transform active:scale-95"
          >
            <motion.span
              whileTap={{ scale: 0.88 }}
              className="relative flex h-8 w-16 items-center justify-center"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-lime/25"
                  transition={{ type: "spring", stiffness: 480, damping: 38 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 size-5",
                  active ? "text-lime" : "text-fog",
                )}
                strokeWidth={active ? 2.5 : 2.1}
              />
            </motion.span>
            <span
              className={cn(
                "text-[10.5px] font-bold tracking-wide",
                active ? "text-snow" : "text-fog",
              )}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
