"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarOff,
  Coffee,
  FlaskConical,
  GraduationCap,
  Hourglass,
  MapPin,
  Moon,
  Sun,
  Timer,
  User,
  X,
} from "lucide-react";
import { useMemo, useRef } from "react";
import {
  DAY_FULL_ACC,
  DAY_SHORT,
  PARITY_LABEL,
  TYPE_META,
  fmtCountdown,
  fmtDayMonth,
  fmtWeekdayLong,
  gapLabel,
  lessonTimes,
  matchesParity,
  nowSeconds,
  plural,
  toMin,
  type LessonT,
  type WeekParity,
} from "@/lib/schedule";
import { Segmented, cn } from "./ui-bits";

interface Enriched {
  l: LessonT;
  s: number; // старт в секундах от начала суток
  e: number; // конец в секундах
}

type Status = "now" | "next" | "past" | "future";

export default function ScheduleView({
  group,
  weekNo,
  parity,
  autoParity,
  day,
  todayDow,
  weekDates,
  now,
  lessons,
  theme,
  demo,
  onParityChange,
  onDayChange,
  onToggleTheme,
  onExitDemo,
}: {
  group: string;
  weekNo: number;
  parity: WeekParity;
  autoParity: WeekParity;
  day: number;
  todayDow: number;
  weekDates: Date[];
  now: Date;
  lessons: LessonT[];
  theme: "light" | "dark";
  demo: boolean;
  onParityChange: (p: WeekParity) => void;
  onDayChange: (d: number) => void;
  onToggleTheme: () => void;
  onExitDemo: () => void;
}) {
  const isToday = day === todayDow && parity === autoParity;
  const sec = nowSeconds(now);
  const touchX = useRef<number | null>(null);

  const dayLessons: Enriched[] = useMemo(() => {
    return lessons
      .filter((l) => l.dayOfWeek === day && matchesParity(l.weekParity, parity))
      .map((l) => {
        const t = lessonTimes(l);
        return { l, s: toMin(t.start) * 60, e: toMin(t.end) * 60 };
      })
      .sort((a, b) => a.s - b.s);
  }, [lessons, day, parity]);

  const ongoing = isToday
    ? dayLessons.find((x) => sec >= x.s && sec < x.e)
    : undefined;
  const upcoming = isToday ? dayLessons.find((x) => x.s > sec) : undefined;

  const totalMins = dayLessons.reduce((acc, x) => acc + (x.e - x.s) / 60, 0);
  const hours = Math.round((totalMins / 60) * 10) / 10;
  const selDate = weekDates[day];

  const changeDay = (d: number) => {
    if (d === day) return;
    try {
      navigator.vibrate?.(6);
    } catch {
      /* noop */
    }
    onDayChange(d);
  };

  return (
    <div
      className="px-5 pb-44 pt-[max(1.6rem,env(safe-area-inset-top))]"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = touchX.current - e.changedTouches[0].clientX;
        touchX.current = null;
        if (Math.abs(dx) < 68) return;
        changeDay((day + (dx > 0 ? 1 : 6)) % 7);
      }}
    >
      {/* ---------- App bar ---------- */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 rounded-full bg-soft2 py-2 pl-3 pr-4">
          <GraduationCap className="size-4 text-lime" strokeWidth={2.4} />
          <span className="text-[13px] font-extrabold text-snow">{group}</span>
        </span>
        <motion.button
          type="button"
          whileTap={{ scale: 0.85, rotate: 24 }}
          onClick={onToggleTheme}
          aria-label="Сменить тему"
          className="flex size-10 items-center justify-center rounded-full bg-soft2 text-snow"
        >
          {theme === "dark" ? (
            <Sun className="size-[18px]" strokeWidth={2.2} />
          ) : (
            <Moon className="size-[18px]" strokeWidth={2.2} />
          )}
        </motion.button>
      </div>

      <h1 className="mt-5 font-display text-[32px] font-bold leading-[1.06] text-snow">
        {isToday ? "Сегодня" : DAY_FULL_ACC[day]}
        <span className="text-lime">.</span>
      </h1>
      <p className="mt-1.5 text-[13.5px] font-semibold text-fog">
        {isToday
          ? `${fmtWeekdayLong(now)} · ${fmtDayMonth(now)}`
          : fmtDayMonth(selDate)}
        {" · "}
        {weekNo}-я неделя
      </p>

      {/* ---------- Баннер демо-режима ---------- */}
      {demo && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-3 rounded-[22px] border border-amber/40 bg-amber/[0.12] px-4 py-3"
        >
          <FlaskConical className="size-4 shrink-0 text-amber" strokeWidth={2.4} />
          <p className="flex-1 text-[12px] font-bold leading-snug text-snow">
            Демо-режим: временные пары вокруг текущего времени
          </p>
          <button
            type="button"
            onClick={onExitDemo}
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber/25 text-amber"
            aria-label="Выключить демо-режим"
          >
            <X className="size-4" strokeWidth={2.6} />
          </button>
        </motion.div>
      )}

      {/* ---------- Чётность недели ---------- */}
      <div className="mt-5">
        <Segmented
          value={parity}
          onChange={(v) => {
            try {
              navigator.vibrate?.(6);
            } catch {
              /* noop */
            }
            onParityChange(v as WeekParity);
          }}
          options={[
            {
              value: "odd",
              label: "Нечётная",
              dot: autoParity === "odd" ? "currentColor" : undefined,
            },
            {
              value: "even",
              label: "Чётная",
              dot: autoParity === "even" ? "currentColor" : undefined,
            },
          ]}
        />
        <p className="mt-2 px-1 text-[11px] font-semibold text-dim">
          сейчас идёт {weekNo}-я неделя ·{" "}
          {PARITY_LABEL[autoParity].toLowerCase()}
        </p>
      </div>

      {/* ---------- Дни ---------- */}
      <div className="mt-4 flex justify-between">
        {DAY_SHORT.map((d, i) => {
          const selected = i === day;
          const isTodayStrip = i === todayDow;
          const dots = lessons
            .filter(
              (l) => l.dayOfWeek === i && matchesParity(l.weekParity, parity),
            )
            .slice(0, 3);
          return (
            <motion.button
              key={d}
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => changeDay(i)}
              className="flex w-11 flex-col items-center gap-1.5"
              aria-label={`${DAY_FULL_ACC[i]}, ${weekDates[i].getDate()}`}
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-dim">
                {d}
              </span>
              <span
                className={cn(
                  "flex size-11 items-center justify-center rounded-full font-display text-[15px] font-bold transition-colors",
                  selected ? "bg-lime text-ink" : "text-snow",
                  isTodayStrip && !selected && "ring-2 ring-lime/70",
                )}
              >
                {weekDates[i].getDate()}
              </span>
              <span className="flex h-1.5 items-center gap-[3px]">
                {dots.map((l) => (
                  <span
                    key={l.id}
                    className="size-1 rounded-full"
                    style={{
                      background: selected
                        ? "var(--snow)"
                        : TYPE_META[l.type].color,
                      opacity: selected ? 0.55 : 1,
                    }}
                  />
                ))}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ---------- ТАЙМЕРЫ ---------- */}
      <AnimatePresence mode="wait" initial={false}>
        {isToday && (ongoing || upcoming) && (
          <motion.div
            key={ongoing ? `on-${ongoing.l.id}` : `up-${upcoming!.l.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-5 space-y-2.5"
          >
            {ongoing && (
              <TimerCard
                variant="end"
                label="До конца пары"
                seconds={ongoing.e - sec}
                lesson={ongoing.l}
                progress={(sec - ongoing.s) / (ongoing.e - ongoing.s)}
              />
            )}
            {upcoming && (
              <TimerCard
                variant="start"
                label={ongoing ? "До следующей пары" : "До начала пары"}
                seconds={upcoming.s - sec}
                lesson={upcoming.l}
                progress={null}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Заголовок списка ---------- */}
      <div className="mb-3.5 mt-7 flex items-baseline justify-between px-1">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-dim">
          {DAY_FULL_ACC[day]}
          {isToday && <span className="text-lime"> · сегодня</span>}
        </p>
        <p className="text-[12px] font-bold text-fog">
          {dayLessons.length === 0
            ? "нет занятий"
            : `${dayLessons.length} ${plural(dayLessons.length, "пара", "пары", "пар")} · ${hours} ч`}
        </p>
      </div>

      {/* ---------- Панели пар ---------- */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${day}-${parity}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {dayLessons.length === 0 ? (
            <div className="flex flex-col items-center rounded-[30px] bg-soft px-6 py-12 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-soft2 text-fog">
                <CalendarOff className="size-6" strokeWidth={2} />
              </span>
              <p className="mt-4 font-display text-[16px] font-bold text-snow">
                Пар нет
              </p>
              <p className="mt-1 text-[13px] font-semibold text-fog">
                Свободный день — можно выдохнуть
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {dayLessons.map((x, i) => {
                const isNow = ongoing?.l.id === x.l.id;
                const isNext = !ongoing && upcoming?.l.id === x.l.id;
                const status: Status = isNow
                  ? "now"
                  : isNext
                    ? "next"
                    : isToday && x.e <= sec
                      ? "past"
                      : "future";
                const nextX = dayLessons[i + 1];
                const gapMin = nextX ? (nextX.s - x.e) / 60 : 0;
                return (
                  <div key={x.l.id} className="flex flex-col gap-3.5">
                    <LessonPanel
                      x={x}
                      status={status}
                      progress={isNow ? (sec - x.s) / (x.e - x.s) : null}
                      countdown={
                        isNow
                          ? { label: "до конца", sec: x.e - sec }
                          : isNext
                            ? { label: "до начала", sec: x.s - sec }
                            : null
                      }
                    />
                    {nextX && gapMin >= 20 && (
                      <div className="flex items-center gap-3 px-2">
                        <span className="h-px flex-1 bg-stroke" />
                        <span className="flex items-center gap-1.5 text-[11.5px] font-bold text-dim">
                          <Coffee className="size-3.5" strokeWidth={2.3} />
                          {gapMin >= 60 ? "окно" : "перерыв"} ·{" "}
                          {gapLabel(gapMin)}
                        </span>
                        <span className="h-px flex-1 bg-stroke" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------- Timer -------------------------------- */

function TimerCard({
  variant,
  label,
  seconds,
  lesson,
  progress,
}: {
  variant: "start" | "end";
  label: string;
  seconds: number;
  lesson: LessonT;
  progress: number | null;
}) {
  const meta = TYPE_META[lesson.type];
  const t = lessonTimes(lesson);
  const isEnd = variant === "end";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[30px] p-4",
        isEnd
          ? "bg-[linear-gradient(140deg,var(--hero-a),var(--hero-b))] text-white shadow-[0_22px_50px_-20px_rgba(0,71,171,0.6)]"
          : "bg-card backdrop-blur-xl",
      )}
    >
      {isEnd && (
        <div className="pointer-events-none absolute -right-12 -top-24 size-48 rounded-full bg-white/15 blur-2xl" />
      )}
      <div className="relative flex items-center gap-3.5">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-2xl",
            isEnd ? "bg-white/20 text-white" : "text-white",
          )}
          style={isEnd ? undefined : { background: meta.color }}
        >
          {isEnd ? (
            <Hourglass className="size-5" strokeWidth={2.3} />
          ) : (
            <Timer className="size-5" strokeWidth={2.3} />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em]",
              isEnd ? "text-white/85" : "text-dim",
            )}
          >
            {isEnd && (
              <span className="size-1.5 animate-pulse-dot rounded-full bg-white" />
            )}
            {label}
          </p>
          <p
            className={cn(
              "mt-0.5 truncate text-[15px] font-extrabold leading-snug",
              isEnd ? "text-white" : "text-snow",
            )}
          >
            {lesson.subject}
          </p>
          <p
            className={cn(
              "mt-0.5 flex items-center gap-2.5 text-[11.5px] font-semibold",
              isEnd ? "text-white/75" : "text-fog",
            )}
          >
            <span>
              {t.start}—{t.end}
            </span>
            {lesson.room && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" strokeWidth={2.4} />
                {lesson.room}
              </span>
            )}
          </p>
        </div>

        <p
          className={cn(
            "shrink-0 font-display text-[22px] font-bold leading-none tabular-nums",
            isEnd ? "text-white" : "text-snow",
          )}
        >
          {fmtCountdown(seconds)}
        </p>
      </div>

      {progress !== null && (
        <div className="relative mt-3.5 h-1.5 overflow-hidden rounded-full bg-black/25">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-1000 ease-linear"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Lesson panel ---------------------------- */

function LessonPanel({
  x,
  status,
  progress,
  countdown,
}: {
  x: Enriched;
  status: Status;
  progress: number | null;
  countdown: { label: string; sec: number } | null;
}) {
  const t = lessonTimes(x.l);
  const meta = TYPE_META[x.l.type];
  const isNow = status === "now";

  return (
    <div
      className={cn(
        "rounded-[28px] p-4 backdrop-blur-xl",
        status === "past" && "opacity-[0.38]",
      )}
      style={{
        background: `color-mix(in srgb, ${meta.color} ${isNow ? 24 : 12}%, var(--card))`,
        boxShadow: isNow ? `inset 0 0 0 2px ${meta.color}` : "none",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-bold text-white"
          style={{ background: meta.color }}
        >
          {x.l.pairNumber}
        </span>
        <div className="flex min-w-0 flex-col">
          <span
            className="text-[13px] font-extrabold tracking-wide"
            style={{ color: meta.color }}
          >
            {t.start} — {t.end}
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-dim">
            {meta.label}
          </span>
        </div>
        {countdown && (
          <span
            className={cn(
              "ml-auto flex shrink-0 flex-col items-end rounded-2xl px-2.5 py-1",
              isNow ? "text-white" : "bg-soft2 text-snow",
            )}
            style={isNow ? { background: meta.color } : undefined}
          >
            <span className="font-display text-[14px] font-bold leading-none tabular-nums">
              {fmtCountdown(countdown.sec)}
            </span>
            <span
              className={cn(
                "mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em]",
                isNow ? "text-white/80" : "text-dim",
              )}
            >
              {countdown.label}
            </span>
          </span>
        )}
      </div>

      <p className="mt-2.5 text-[17px] font-extrabold leading-snug text-snow">
        {x.l.subject}
      </p>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] font-semibold text-fog">
        {x.l.room && (
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" strokeWidth={2.3} />
            {x.l.room}
          </span>
        )}
        {x.l.teacher && (
          <span className="flex items-center gap-1.5">
            <User className="size-3.5" strokeWidth={2.3} />
            {x.l.teacher}
          </span>
        )}
      </div>

      {progress !== null && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-soft2">
          <div
            className="h-full rounded-full transition-[width] duration-1000 ease-linear"
            style={{
              background: meta.color,
              width: `${Math.min(100, progress * 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
