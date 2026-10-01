"use client";

import { motion } from "framer-motion";
import {
  Building2,
  CalendarRange,
  Clock3,
  FlaskConical,
  GraduationCap,
  Moon,
  Play,
  Square,
  Sun,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import {
  PARITY_LABEL,
  lessonTimes,
  matchesParity,
  plural,
  toMin,
  type LessonT,
  type WeekParity,
} from "@/lib/schedule";
import { Segmented, cn } from "./ui-bits";

const CARD_ACCENTS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"];

export default function MoreView({
  lessons,
  group,
  weekNo,
  autoParity,
  theme,
  demo,
  onToggleTheme,
  onToggleDemo,
}: {
  lessons: LessonT[];
  group: string;
  weekNo: number;
  autoParity: WeekParity;
  theme: "light" | "dark";
  demo: boolean;
  onToggleTheme: () => void;
  onToggleDemo: () => void;
}) {
  const stats = useMemo(() => {
    const weekLessons = lessons.filter((l) =>
      matchesParity(l.weekParity, autoParity),
    );
    const mins = weekLessons.reduce((acc, l) => {
      const t = lessonTimes(l);
      return acc + (toMin(t.end) - toMin(t.start));
    }, 0);
    const teachers = new Set(
      lessons.map((l) => l.teacher).filter((t) => t.trim().length > 0),
    );
    const rooms = new Set(
      lessons.map((l) => l.room).filter((r) => r.trim().length > 0),
    );
    return {
      pairs: weekLessons.length,
      hours: Math.round((mins / 60) * 10) / 10,
      teachers: teachers.size,
      rooms: rooms.size,
    };
  }, [lessons, autoParity]);

  const cards = [
    {
      icon: CalendarRange,
      value: String(stats.pairs),
      label: plural(stats.pairs, "пара", "пары", "пар") + " на неделе",
      accent: CARD_ACCENTS[0],
    },
    {
      icon: Clock3,
      value: String(stats.hours),
      label: "часов занятий",
      accent: CARD_ACCENTS[1],
    },
    {
      icon: Users,
      value: String(stats.teachers),
      label: plural(
        stats.teachers,
        "преподаватель",
        "преподавателя",
        "преподавателей",
      ),
      accent: CARD_ACCENTS[2],
    },
    {
      icon: Building2,
      value: String(stats.rooms),
      label: plural(stats.rooms, "аудитория", "аудитории", "аудиторий"),
      accent: CARD_ACCENTS[3],
    },
  ];

  return (
    <div className="px-5 pb-44 pt-[max(1.6rem,env(safe-area-inset-top))]">
      <h1 className="mt-1 font-display text-[32px] font-bold leading-[1.06] text-snow">
        Ещё<span className="text-lime">.</span>
      </h1>
      <p className="mt-1.5 text-[13.5px] font-semibold text-fog">
        {weekNo}-я неделя · {PARITY_LABEL[autoParity].toLowerCase()}
      </p>

      {/* group identity */}
      <div className="mt-6 flex items-center gap-3.5 rounded-[28px] bg-card p-4 backdrop-blur-xl">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-lime/15 text-lime">
          <GraduationCap className="size-5" strokeWidth={2.3} />
        </span>
        <div className="min-w-0">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-dim">
            Моя группа
          </p>
          <p className="truncate text-[17px] font-extrabold text-snow">
            {group} · ТГТУ
          </p>
        </div>
      </div>

      {/* stats */}
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-[28px] bg-card p-4 backdrop-blur-xl"
          >
            <span
              className="flex size-10 items-center justify-center rounded-2xl"
              style={{ background: `${c.accent}20`, color: c.accent }}
            >
              <c.icon className="size-[18px]" strokeWidth={2.3} />
            </span>
            <p className="mt-3 font-display text-[24px] font-bold leading-none text-snow">
              {c.value}
            </p>
            <p className="mt-1.5 text-[11.5px] font-semibold text-fog">
              {c.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* appearance */}
      <div className="mt-3 rounded-[28px] bg-card p-5 backdrop-blur-xl">
        <p className="mb-3.5 text-[15px] font-extrabold text-snow">
          Оформление
        </p>
        <Segmented
          value={theme}
          onChange={(v) => {
            if (v !== theme) onToggleTheme();
          }}
          options={[
            {
              value: "light",
              label: (
                <span className="flex items-center gap-1.5">
                  <Sun className="size-3.5" strokeWidth={2.5} />
                  Светлая
                </span>
              ),
            },
            {
              value: "dark",
              label: (
                <span className="flex items-center gap-1.5">
                  <Moon className="size-3.5" strokeWidth={2.5} />
                  Тёмная
                </span>
              ),
            },
          ]}
        />
      </div>

      {/* demo timers */}
      <div className="mt-3 rounded-[28px] bg-card p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber/15 text-amber">
            <FlaskConical className="size-[18px]" strokeWidth={2.3} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-extrabold text-snow">
              Демо-таймеры
            </p>
            <p className="mt-0.5 text-[11.5px] font-semibold leading-snug text-fog">
              Создаёт временные пары вокруг текущего времени, чтобы увидеть
              отсчёт до начала и до конца
            </p>
          </div>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onToggleDemo}
          className={cn(
            "mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[13.5px] font-extrabold transition-colors",
            demo ? "bg-soft2 text-snow" : "bg-amber text-ink",
          )}
        >
          {demo ? (
            <>
              <Square className="size-4" strokeWidth={2.6} />
              Выключить демо
            </>
          ) : (
            <>
              <Play className="size-4" strokeWidth={2.6} />
              Включить демо
            </>
          )}
        </motion.button>
      </div>

      <p className="mt-10 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-dim">
        Пары · расписание {group}
      </p>
      <p className="mt-1.5 text-center text-[10.5px] font-semibold text-dim/70">
        сделано с любовью к студентам
      </p>
    </div>
  );
}
