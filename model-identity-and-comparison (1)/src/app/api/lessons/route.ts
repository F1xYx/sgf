import { NextResponse } from "next/server";
import { db } from "@/db";
import { lessons } from "@/db/schema";
import { parseLessonInput } from "@/lib/lesson-input";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = parseLessonInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const [row] = await db.insert(lessons).values(parsed.data).returning();
    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    console.error("POST /api/lessons", e);
    return NextResponse.json(
      { error: "Не удалось создать пару" },
      { status: 500 },
    );
  }
}
