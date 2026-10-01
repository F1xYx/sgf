import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

/**
 * Расписание пар.
 * dayOfWeek: 0 = понедельник ... 6 = воскресенье
 * weekParity: odd = числитель, even = знаменатель, both = каждую неделю
 */
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(),
  weekParity: varchar("week_parity", { length: 10 }).notNull().default("both"),
  pairNumber: integer("pair_number").notNull(),
  subject: text("subject").notNull(),
  teacher: text("teacher").notNull().default(""),
  room: varchar("room", { length: 40 }).notNull().default(""),
  type: varchar("type", { length: 20 }).notNull().default("lecture"),
  startTime: varchar("start_time", { length: 5 }).notNull().default(""),
  endTime: varchar("end_time", { length: 5 }).notNull().default(""),
});

export const settings = pgTable("settings", {
  key: varchar("key", { length: 40 }).primaryKey(),
  value: text("value").notNull().default(""),
});

export type LessonRow = typeof lessons.$inferSelect;
export type NewLessonRow = typeof lessons.$inferInsert;
