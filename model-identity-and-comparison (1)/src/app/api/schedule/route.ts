import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { lessons, settings } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(lessons)
      .orderBy(asc(lessons.dayOfWeek), asc(lessons.pairNumber));
    const srows = await db.select().from(settings);
    const map: Record<string, string> = {};
    for (const s of srows) map[s.key] = s.value;
    return NextResponse.json({
      lessons: rows,
      settings: {
        group: map.group ?? "Моя группа",
        semesterStart: map.semesterStart ?? "",
      },
    });
  } catch (e) {
    console.error("GET /api/schedule", e);
    return NextResponse.json(
      { error: "Не удалось загрузить расписание" },
      { status: 500 },
    );
  }
}
