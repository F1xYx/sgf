export type WeekParity = "odd" | "even";
export type LessonParity = WeekParity | "both";
export type LessonType = "lecture" | "practice" | "lab" | "other";

export interface LessonT {
  id: number;
  dayOfWeek: number; // 0=Mon ... 6=Sun
  weekParity: LessonParity;
  pairNumber: number;
  subject: string;
  teacher: string;
  room: string;
  type: LessonType;
  startTime: string;
  endTime: string;
}

export interface SettingsT {
  group: string;
  semesterStart: string; // "YYYY-MM-DD" or ""
}

export interface PairTime {
  n: number;
  start: string;
  end: string;
}

export const PAIRS: PairTime[] = [
  { n: 1, start: "09:00", end: "10:35" },
  { n: 2, start: "10:45", end: "12:20" },
  { n: 3, start: "13:00", end: "14:35" },
  { n: 4, start: "14:45", end: "16:20" },
  { n: 5, start: "16:30", end: "18:05" },
];

export const TYPE_META: Record<
  LessonType,
  { label: string; short: string; color: string }
> = {
  lecture: { label: "Лекция", short: "Лек", color: "#6C63F0" },
  practice: { label: "Практика", short: "Пр", color: "#0DA768" },
  lab: { label: "Лабораторная", short: "Лаб", color: "#E89114" },
  other: { label: "Другое", short: "Др", color: "#0EA0DC" },
};

export const PARITY_LABEL: Record<LessonParity, string> = {
  both: "Каждую неделю",
  odd: "Нечётная",
  even: "Чётная",
};

export const DAY_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
export const DAY_FULL_ACC = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

export function toMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function pairTime(n: number): PairTime {
  return PAIRS.find((p) => p.n === n) ?? PAIRS[0];
}

export function lessonTimes(l: {
  pairNumber: number;
  startTime: string;
  endTime: string;
}): { start: string; end: string } {
  const p = pairTime(l.pairNumber);
  return {
    start: l.startTime || p.start,
    end: l.endTime || p.end,
  };
}

export function mondayOf(d: Date): Date {
  const x = new Date(d);
  const dow = (x.getDay() + 6) % 7;
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - dow);
  return x;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Какая сейчас учебная неделя и её чётность (odd = числитель). */
export function getWeekInfo(
  now: Date,
  semesterStart: string,
): { weekNo: number; parity: WeekParity } {
  let sem: Date | null = null;
  if (semesterStart) {
    const parsed = new Date(`${semesterStart}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) sem = parsed;
  }
  if (!sem) {
    const y = now.getFullYear();
    const m = now.getMonth(); // 0-based; сентябрь = 8
    sem = new Date(m >= 8 ? y : y - 1, 8, 1);
  }
  const diffWeeks = Math.floor(
    (mondayOf(now).getTime() - mondayOf(sem).getTime()) / 604800000,
  );
  const weekNo = Math.max(1, diffWeeks + 1);
  return { weekNo, parity: weekNo % 2 === 1 ? "odd" : "even" };
}

export function matchesParity(l: LessonParity, p: WeekParity): boolean {
  return l === "both" || l === p;
}

export function fmtWeekdayLong(d: Date): string {
  return new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(d);
}

export function fmtDayMonth(d: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  }).format(d);
}

/** Секунды, прошедшие с начала суток. */
export function nowSeconds(now: Date): number {
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}

/** Обратный отсчёт вида 1:05:09 или 05:09. */
export function fmtCountdown(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${p(mm)}:${p(ss)}` : `${p(mm)}:${p(ss)}`;
}

export function gapLabel(mins: number): string {
  if (mins < 60) return `${mins} мин`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} ч ${m} мин` : `${h} ч`;
}

export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export function isoLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function nowMinutes(now: Date): number {
  return now.getHours() * 60 + now.getMinutes();
}
