import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { PAIRS } from "@/lib/schedule";
import { SEED_GROUP, SEED_LESSONS } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

/**
 * The demo remains usable when a local DATABASE_URL is not configured.
 * This is especially useful in the preview environment, where the database
 * is optional and the bundled schedule is enough to explore the UI.
 */
export async function GET() {
  try {
    const { db } = await import("@/db");
    const { lessons, settings } = await import("@/db/schema");
    const rows = await db
      .select()
      .from(lessons)
      .orderBy(asc(lessons.dayOfWeek), asc(lessons.pairNumber));
    const srows = await db.select().from(settings);
    const map: Record<string, string> = {};
    for (const s of srows) map[s.key] = s.value;
    return NextResponse.json({
      lessons: rows,
      settings: { group: map.group ?? "Моя группа", semesterStart: map.semesterStart ?? "" },
    });
  } catch (e) {
    console.warn("Using bundled demo schedule:", e instanceof Error ? e.message : e);
    return NextResponse.json({
      lessons: SEED_LESSONS.map((lesson, id) => {
        const pair = PAIRS.find((p) => p.n === lesson.pairNumber) ?? PAIRS[0];
        return { id: id + 1, ...lesson, startTime: pair.start, endTime: pair.end, room: lesson.room };
      }),
      settings: { group: SEED_GROUP, semesterStart: "2025-09-01" },
    });
  }
}
