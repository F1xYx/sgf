import { NextResponse } from "next/server";
import { db } from "@/db";
import { lessons, settings } from "@/db/schema";
import { SEED_GROUP, SEED_LESSONS } from "@/lib/seed-data";

/** Сброс расписания к демо-варианту. */
export async function POST() {
  try {
    await db.delete(lessons);
    await db.insert(lessons).values(
      SEED_LESSONS.map((l) => ({ ...l })),
    );

    const now = new Date();
    const semYear = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
    const semesterStart = `${semYear}-09-01`;

    await db
      .insert(settings)
      .values({ key: "group", value: SEED_GROUP })
      .onConflictDoUpdate({ target: settings.key, set: { value: SEED_GROUP } });
    await db
      .insert(settings)
      .values({ key: "semesterStart", value: semesterStart })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: semesterStart },
      });

    return NextResponse.json({ ok: true, count: SEED_LESSONS.length });
  } catch (e) {
    console.error("POST /api/seed", e);
    return NextResponse.json(
      { error: "Не удалось сбросить расписание" },
      { status: 500 },
    );
  }
}
