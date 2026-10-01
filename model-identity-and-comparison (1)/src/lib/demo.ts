import type { LessonT, LessonType } from "./schedule";

function hm(base: Date, offsetMin: number): string {
  const d = new Date(base.getTime() + offsetMin * 60000);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
}

interface Spec {
  id: number;
  from: number; // минут от «якоря» до начала
  to: number; // минут от «якоря» до конца
  subject: string;
  teacher: string;
  room: string;
  type: LessonType;
}

/**
 * Временные (демонстрационные) пары, построенные вокруг текущего момента,
 * чтобы наглядно показать работу таймеров:
 *  1) уже закончилась     → «прошедшая», приглушена
 *  2) идёт прямо сейчас   → таймер «до конца» + прогресс
 *  3) начнётся через ~9 мин → таймер «до начала»
 *  4) после длинного окна → обычная будущая пара
 */
const SPECS: Spec[] = [
  {
    id: -1,
    from: -105,
    to: -15,
    subject: "Демо: пара уже прошла",
    teacher: "Вехтева Н. А.",
    room: "160, корп. Л",
    type: "lecture",
  },
  {
    id: -2,
    from: -11,
    to: 4,
    subject: "Демо: пара идёт сейчас",
    teacher: "Жуковская Т. В.",
    room: "219, корп. А",
    type: "practice",
  },
  {
    id: -3,
    from: 9,
    to: 24,
    subject: "Демо: следующая пара",
    teacher: "Борисенко А. Б.",
    room: "155, корп. Л",
    type: "lab",
  },
  {
    id: -4,
    from: 64,
    to: 79,
    subject: "Демо: пара после окна",
    teacher: "Якимов К. А.",
    room: "309, корп. А",
    type: "other",
  },
];

export function buildDemoLessons(anchor: Date, dayOfWeek: number): LessonT[] {
  return SPECS.map((s, i) => ({
    id: s.id,
    dayOfWeek,
    weekParity: "both" as const,
    pairNumber: i + 1,
    subject: s.subject,
    teacher: s.teacher,
    room: s.room,
    type: s.type,
    startTime: hm(anchor, s.from),
    endTime: hm(anchor, s.to),
  }));
}
