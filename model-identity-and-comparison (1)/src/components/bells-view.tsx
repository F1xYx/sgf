"use client";

import { motion } from "framer-motion";
import { BellRing, Coffee, Info } from "lucide-react";
import {
  PAIRS,
  fmtDayMonth,
  fmtWeekdayLong,
  gapLabel,
  nowMinutes,
  toMin,
} from "@/lib/schedule";
import { cn } from "./ui-bits";

export default function BellsView({ now }: { now: Date }) {
  const m = nowMinutes(now);

  return (
    <div className="px-5 pb-44 pt-[max(1.6rem,env(safe-area-inset-top))]">
      <div className="mb-1 mt-1 flex items-center gap-2 text-lime">
        <BellRing className="size-4" strokeWidth={2.5} />
        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em]">
          Перерывы и пары
        </span>
      </div>
      <h1 className="font-display text-[32px] font-bold leading-[1.06] text-snow">
        Звонки<span className="text-lime">.</span>
      </h1>
      <p className="mt-1.5 text-[13.5px] font-semibold text-fog">
        {fmtWeekdayLong(now)} · {fmtDayMonth(now)}
      </p>

      <div className="mt-6 overflow-hidden rounded-[28px] bg-card backdrop-blur-xl">
        {PAIRS.map((p, i) => {
          const s = toMin(p.start);
          const e = toMin(p.end);
          const active = m >= s && m < e;
          const nextP = PAIRS[i + 1];
          const gap = nextP ? toMin(nextP.start) - e : 0;
          return (
            <div key={p.n}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className={cn(
                  "flex items-center gap-4 px-4 py-4",
                  active && "bg-lime/[0.1]",
                )}
              >
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-bold",
                    active ? "bg-lime text-ink" : "bg-soft2 text-fog",
                  )}
                >
                  {p.n}
                </span>
                <div className="flex-1">
                  <p className="text-[15.5px] font-extrabold tracking-wide text-snow">
                    {p.start} <span className="text-dim">—</span> {p.end}
                  </p>
                  <p className="text-[11.5px] font-semibold text-dim">
                    {gapLabel(e - s)}
                    {p.n === 1 && " · утренняя"}
                    {p.n === PAIRS.length && " · последняя"}
                  </p>
                </div>
                {active && (
                  <span className="flex items-center gap-1.5 rounded-full bg-lime/20 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-lime">
                    <span className="size-1 animate-pulse-dot rounded-full bg-lime" />
                    сейчас
                  </span>
                )}
              </motion.div>
              {nextP && gap >= 5 && (
                <div className="flex items-center gap-2 px-4 py-2 pl-[76px]">
                  <Coffee className="size-3 text-dim" strokeWidth={2.4} />
                  <span className="text-[11px] font-bold text-dim">
                    перемена · {gapLabel(gap)}
                  </span>
                </div>
              )}
              {nextP && gap < 5 && <div className="mx-4 h-px bg-stroke" />}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-[24px] bg-soft p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-fog" strokeWidth={2.3} />
        <p className="text-[12.5px] font-semibold leading-relaxed text-fog">
          Время соответствует расписанию звонков ТГТУ. Обеденный перерыв — 40
          минут после второй пары.
        </p>
      </div>
    </div>
  );
}
