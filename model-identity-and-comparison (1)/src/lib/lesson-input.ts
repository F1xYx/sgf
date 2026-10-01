import type { NewLessonRow } from "@/db/schema";

const PARITIES = new Set(["odd", "even", "both"]);
const TYPES = new Set(["lecture", "practice", "lab", "other"]);
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

type Ok = { ok: true; data: Omit<NewLessonRow, "id"> };
type Err = { ok: false; error: string };

export function parseLessonInput(body: unknown): Ok | Err {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Некорректное тело запроса" };
  }
  const b = body as Record<string, unknown>;

  const dayOfWeek = Number(b.dayOfWeek);
  const pairNumber = Number(b.pairNumber);
  const subject = String(b.subject ?? "").trim();
  const teacher = String(b.teacher ?? "").trim();
  const room = String(b.room ?? "").trim();
  const weekParity = String(b.weekParity ?? "both");
  const type = String(b.type ?? "lecture");
  const startTime = String(b.startTime ?? "").trim();
  const endTime = String(b.endTime ?? "").trim();

  if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6)
    return { ok: false, error: "День недели должен быть от 0 до 6" };
  if (!Number.isInteger(pairNumber) || pairNumber < 1 || pairNumber > 8)
    return { ok: false, error: "Номер пары должен быть от 1 до 8" };
  if (!subject || subject.length > 90)
    return { ok: false, error: "Укажите название предмета (до 90 символов)" };
  if (teacher.length > 90) return { ok: false, error: "Слишком длинное ФИО" };
  if (room.length > 30) return { ok: false, error: "Слишком длинная аудитория" };
  if (!PARITIES.has(weekParity))
    return { ok: false, error: "Некорректная чётность недели" };
  if (!TYPES.has(type)) return { ok: false, error: "Некорректный тип занятия" };
  if (startTime && !TIME_RE.test(startTime))
    return { ok: false, error: "Некорректное время начала" };
  if (endTime && !TIME_RE.test(endTime))
    return { ok: false, error: "Некорректное время окончания" };
  if (startTime && endTime && startTime >= endTime)
    return { ok: false, error: "Начало должно быть раньше конца" };

  return {
    ok: true,
    data: {
      dayOfWeek,
      pairNumber,
      subject,
      teacher,
      room,
      weekParity,
      type,
      startTime,
      endTime,
    },
  };
}
