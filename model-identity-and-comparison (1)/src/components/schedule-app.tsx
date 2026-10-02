"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CloudOff, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PAIRS } from "@/lib/schedule";
import { SEED_GROUP, SEED_LESSONS } from "@/lib/seed-data";
import {
  addDays,
  getWeekInfo,
  mondayOf,
  type LessonParity,
  type LessonT,
  type LessonType,
  type SettingsT,
  type WeekParity,
} from "@/lib/schedule";
import { buildDemoLessons } from "@/lib/demo";
import BellsView from "./bells-view";
import BottomNav, { type TabId } from "./bottom-nav";
import MoreView from "./more-view";
import ScheduleView from "./schedule-view";

interface ApiLesson {
  id: number;
  dayOfWeek: number;
  weekParity: string;
  pairNumber: number;
  subject: string;
  teacher: string;
  room: string;
  type: string;
  startTime: string;
  endTime: string;
}

function mapLesson(r: ApiLesson): LessonT {
  return {
    ...r,
    type: r.type as LessonType,
    weekParity: r.weekParity as LessonParity,
  };
}

// Stable SSR value prevents a hydration mismatch before the live clock starts.
const INITIAL_NOW = new Date("2025-09-01T09:00:00");

export default function ScheduleApp() {
  // Render the bundled demo immediately. The API can enhance it later, but
  // the first paint must never depend on a database or a network request.
  const [lessons, setLessons] = useState<LessonT[]>(() =>
    SEED_LESSONS.map((lesson, id) => {
      const pair = PAIRS.find((p) => p.n === lesson.pairNumber) ?? PAIRS[0];
      return { ...lesson, id: id + 1, startTime: pair.start, endTime: pair.end };
    }),
  );
  const [settings, setSettings] = useState<SettingsT>({
    group: SEED_GROUP,
    semesterStart: "2025-09-01",
  });
  const [loadError, setLoadError] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(INITIAL_NOW);

  const [tab, setTab] = useState<TabId>("schedule");
  const [parity, setParity] = useState<WeekParity>("odd");
  const [day, setDay] = useState<number>(0);
  const initialized = useRef(false);

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [demoAnchor, setDemoAnchor] = useState<Date | null>(null);

  /* ------------------------------ theme ------------------------------ */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bpi_theme");
      const sysDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const t =
        stored === "light" || stored === "dark"
          ? stored
          : sysDark
            ? "dark"
            : "light";
      // Theme hydration intentionally updates React state after localStorage is read.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(t);
      document.documentElement.classList.toggle("dark", t === "dark");
    } catch {
      /* noop */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("bpi_theme", next);
      } catch {
        /* noop */
      }
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  /* ------------------------------ clock ------------------------------ */
  useEffect(() => {
    // Start the client clock after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ------------------------------ data ------------------------------- */
  const load = useCallback(async () => {
    try {
      setLoadError(null);
      const r = await fetch("/api/schedule", { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Ошибка загрузки");
      setLessons((j.lessons as ApiLesson[]).map(mapLesson));
      setSettings(j.settings as SettingsT);
    } catch {
      setLoadError("Не удалось подключиться к серверу");
    }
  }, []);

  useEffect(() => {
    // Fetching is the effect's external synchronization; it sets loading state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  /* ---------------------- derived time context ----------------------- */
  const weekInfo = useMemo(
    () => (now ? getWeekInfo(now, settings.semesterStart) : null),
    [now, settings.semesterStart],
  );
  const todayDow = now ? (now.getDay() + 6) % 7 : 0;
  const weekDates = useMemo(() => {
    if (!now) return [] as Date[];
    const mon = mondayOf(now);
    return Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  }, [now]);

  useEffect(() => {
    if (now && weekInfo && lessons !== null && !initialized.current) {
      initialized.current = true;
      setParity(weekInfo.parity);
      setDay(todayDow);
    }
  }, [now, weekInfo, lessons, todayDow]);

  const demoLessons = useMemo(
    () => (demoAnchor ? buildDemoLessons(demoAnchor, todayDow) : null),
    [demoAnchor, todayDow],
  );

  const toggleDemo = useCallback(() => {
    setDemoAnchor((a) => {
      if (a) return null;
      setTab("schedule");
      setDay(todayDow);
      if (weekInfo) setParity(weekInfo.parity);
      return new Date();
    });
  }, [todayDow, weekInfo]);

  const ready = lessons !== null && now !== null && weekInfo !== null;

  /* ------------------------------ render ----------------------------- */
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-ink">
      {/* aurora backdrop */}
      <div className="bg-layer">
        <div className="aurora-curtain c1" />
        <div className="aurora-curtain c2" />
        <div className="aurora-curtain c3" />
      </div>
      <div className="noise-overlay" />
      <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
        <span className="select-none font-display text-[11vw] font-bold leading-none text-snow/[0.05]">
          ПАРЫ
        </span>
      </div>

      {/* phone shell */}
      <div className="relative z-10 w-full max-w-[430px] md:px-0">
        <div className="relative flex h-dvh flex-col overflow-hidden md:h-[min(900px,calc(100dvh-2.5rem))] md:rounded-[46px] md:border md:border-stroke md:bg-ink/45 md:shadow-[0_60px_140px_-30px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] md:backdrop-blur-3xl">
          {!ready ? (
            loadError ? (
              <ErrorState msg={loadError} onRetry={load} />
            ) : (
              <Skeleton />
            )
          ) : (
            <>
              <main className="relative flex-1 overflow-y-auto no-scrollbar">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    {tab === "schedule" && (
                      <ScheduleView
                        group={settings.group}
                        weekNo={weekInfo.weekNo}
                        parity={parity}
                        autoParity={weekInfo.parity}
                        day={day}
                        todayDow={todayDow}
                        weekDates={weekDates}
                        now={now}
                        lessons={demoLessons ?? lessons}
                        theme={theme}
                        demo={demoAnchor !== null}
                        onExitDemo={toggleDemo}
                        onParityChange={setParity}
                        onDayChange={setDay}
                        onToggleTheme={toggleTheme}
                      />
                    )}
                    {tab === "bells" && <BellsView now={now} />}
                    {tab === "more" && (
                      <MoreView
                        lessons={lessons}
                        group={settings.group}
                        weekNo={weekInfo.weekNo}
                        autoParity={weekInfo.parity}
                        theme={theme}
                        demo={demoAnchor !== null}
                        onToggleTheme={toggleTheme}
                        onToggleDemo={toggleDemo}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </main>

              {/* bottom nav */}
              <div className="nav-fade pointer-events-none absolute inset-x-0 bottom-0 z-30 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-12">
                <div className="pointer-events-auto">
                  <BottomNav tab={tab} onChange={setTab} />
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ skeleton ------------------------------ */

function Skeleton() {
  return (
    <div className="animate-pulse px-5 pt-8">
      <div className="mb-2 h-6 w-28 rounded-full bg-soft2" />
      <div className="h-9 w-44 rounded-2xl bg-soft2" />
      <div className="mt-3 h-4 w-40 rounded-full bg-soft" />
      <div className="mt-6 h-11 rounded-full bg-soft" />
      <div className="mt-5 flex justify-between px-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="size-11 rounded-full bg-soft" />
        ))}
      </div>
      <div className="mt-6 h-28 rounded-[30px] bg-soft" />
      <div className="mt-4 space-y-3">
        <div className="h-24 rounded-[28px] bg-soft" />
        <div className="h-24 rounded-[28px] bg-soft" />
        <div className="h-24 rounded-[28px] bg-soft" />
      </div>
    </div>
  );
}

function ErrorState({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-3xl bg-rose/10 text-rose">
        <CloudOff className="size-7" strokeWidth={2} />
      </span>
      <p className="mt-5 font-display text-[17px] font-bold text-snow">
        Что-то пошло не так
      </p>
      <p className="mt-2 text-[13px] font-semibold text-fog">{msg}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 flex items-center gap-2 rounded-full bg-snow px-6 py-3 text-[13.5px] font-extrabold text-ink"
      >
        <RefreshCw className="size-4" strokeWidth={2.5} />
        Повторить
      </button>
    </div>
  );
}
