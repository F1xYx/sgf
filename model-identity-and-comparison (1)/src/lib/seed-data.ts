import type { LessonParity, LessonType } from "./schedule";

export interface SeedLesson {
  dayOfWeek: number; // 0 = Пн ... 6 = Вс
  weekParity: LessonParity;
  pairNumber: number;
  subject: string;
  teacher: string;
  room: string;
  type: LessonType;
}

export const SEED_GROUP = "БПИ261";

/** Расписание группы БПИ261 (ТГТУ). Среда — свободная. */
export const SEED_LESSONS: SeedLesson[] = [
  // ================= НЕЧЁТНАЯ НЕДЕЛЯ =================
  // Понедельник
  { dayOfWeek: 0, weekParity: "odd", pairNumber: 1, subject: "Алгоритм, модели данных и основы ИИ", teacher: "Вехтева Н. А.", room: "160, корп. Л", type: "lecture" },
  { dayOfWeek: 0, weekParity: "odd", pairNumber: 3, subject: "Иностранный язык", teacher: "Группа А9", room: "311, корп. А", type: "practice" },
  { dayOfWeek: 0, weekParity: "odd", pairNumber: 4, subject: "Элективные дисциплины по ФК и спорту", teacher: "Группа П14", room: "Спортзал С8", type: "practice" },
  // Вторник
  { dayOfWeek: 1, weekParity: "odd", pairNumber: 1, subject: "Высшая математика", teacher: "Жуковская Т. В.", room: "219, корп. А", type: "practice" },
  { dayOfWeek: 1, weekParity: "odd", pairNumber: 2, subject: "Социальная психология", teacher: "Швецова Е. В.", room: "107, корп. Д", type: "practice" },
  { dayOfWeek: 1, weekParity: "odd", pairNumber: 3, subject: "Алгоритм, модели данных и основы ИИ", teacher: "Вехтева Н. А.", room: "155, корп. Л", type: "lab" },
  { dayOfWeek: 1, weekParity: "odd", pairNumber: 5, subject: "Физическая культура и спорт", teacher: "Группа П4", room: "235, корп. А", type: "lecture" },
  // Четверг
  { dayOfWeek: 3, weekParity: "odd", pairNumber: 1, subject: "История России", teacher: "Якимов К. А.", room: "234, корп. А", type: "lecture" },
  { dayOfWeek: 3, weekParity: "odd", pairNumber: 2, subject: "Основы российской государственности", teacher: "Поповичева М. В.", room: "317, корп. А", type: "practice" },
  { dayOfWeek: 3, weekParity: "odd", pairNumber: 4, subject: "Физика", teacher: "Исаева О. В., Лямина М. А.", room: "224, корп. А", type: "lab" },
  { dayOfWeek: 3, weekParity: "odd", pairNumber: 5, subject: "История России", teacher: "Якимов К. А.", room: "309, корп. А", type: "practice" },
  // Пятница
  { dayOfWeek: 4, weekParity: "odd", pairNumber: 2, subject: "Основы российской государственности", teacher: "Поповичева М. В.", room: "236, корп. А", type: "lecture" },
  { dayOfWeek: 4, weekParity: "odd", pairNumber: 3, subject: "Прикладные интеллектуальные технологии", teacher: "Борисенко А. Б.", room: "155, корп. Л", type: "lab" },

  // ================= ЧЁТНАЯ НЕДЕЛЯ =================
  // Понедельник
  { dayOfWeek: 0, weekParity: "even", pairNumber: 1, subject: "Русский язык и культура общения", teacher: "Иконникова Я. В.", room: "106, корп. А", type: "practice" },
  { dayOfWeek: 0, weekParity: "even", pairNumber: 2, subject: "Высшая математика", teacher: "Жуковская Т. В.", room: "235, корп. А", type: "lecture" },
  { dayOfWeek: 0, weekParity: "even", pairNumber: 3, subject: "Иностранный язык", teacher: "Группа А9", room: "311, корп. А", type: "practice" },
  { dayOfWeek: 0, weekParity: "even", pairNumber: 4, subject: "Элективные дисциплины по ФК и спорту", teacher: "Группа П14", room: "Спортзал С8", type: "practice" },
  // Вторник
  { dayOfWeek: 1, weekParity: "even", pairNumber: 1, subject: "Высшая математика", teacher: "Жуковская Т. В.", room: "219, корп. А", type: "practice" },
  { dayOfWeek: 1, weekParity: "even", pairNumber: 3, subject: "Алгоритм, модели данных и основы ИИ", teacher: "Вехтева Н. А.", room: "155, корп. Л", type: "lab" },
  { dayOfWeek: 1, weekParity: "even", pairNumber: 4, subject: "Прикладные интеллектуальные технологии", teacher: "Борисенко А. Б.", room: "160, корп. Л", type: "lecture" },
  // Четверг
  { dayOfWeek: 3, weekParity: "even", pairNumber: 1, subject: "История России", teacher: "Якимов К. А.", room: "234, корп. А", type: "lecture" },
  { dayOfWeek: 3, weekParity: "even", pairNumber: 2, subject: "Основы российской государственности", teacher: "Поповичева М. В.", room: "317, корп. А", type: "practice" },
  { dayOfWeek: 3, weekParity: "even", pairNumber: 3, subject: "Социальная психология", teacher: "Швецова Е. В.", room: "236, корп. А", type: "lecture" },
  { dayOfWeek: 3, weekParity: "even", pairNumber: 5, subject: "История России", teacher: "Якимов К. А.", room: "309, корп. А", type: "practice" },
  // Пятница
  { dayOfWeek: 4, weekParity: "even", pairNumber: 1, subject: "Элективные дисциплины по ФК и спорту", teacher: "Группа П14", room: "Спортзал С8", type: "practice" },
  { dayOfWeek: 4, weekParity: "even", pairNumber: 2, subject: "Физика", teacher: "Исаева О. В.", room: "231, корп. А", type: "practice" },
  { dayOfWeek: 4, weekParity: "even", pairNumber: 3, subject: "Физика", teacher: "Исаева О. В.", room: "235, корп. А", type: "lecture" },
  { dayOfWeek: 4, weekParity: "even", pairNumber: 5, subject: "Прикладные интеллектуальные технологии", teacher: "Борисенко А. Б.", room: "155, корп. Л", type: "lab" },
];
