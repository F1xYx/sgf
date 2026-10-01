import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { lessons } from "@/db/schema";
import { parseLessonInput } from "@/lib/lesson-input";

type Ctx = { params: Promise<{ id: string }> };

function parseId(id: string): number | null {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const idNum = parseId(id);
    if (!idNum) {
      return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
    }
    const body = await req.json();
    const parsed = parseLessonInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const [row] = await db
      .update(lessons)
      .set(parsed.data)
      .where(eq(lessons.id, idNum))
      .returning();
    if (!row) {
      return NextResponse.json({ error: "Пара не найдена" }, { status: 404 });
    }
    return NextResponse.json(row);
  } catch (e) {
    console.error("PUT /api/lessons/[id]", e);
    return NextResponse.json(
      { error: "Не удалось обновить пару" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const idNum = parseId(id);
    if (!idNum) {
      return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
    }
    const [row] = await db
      .delete(lessons)
      .where(eq(lessons.id, idNum))
      .returning({ id: lessons.id });
    if (!row) {
      return NextResponse.json({ error: "Пара не найдена" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/lessons/[id]", e);
    return NextResponse.json(
      { error: "Не удалось удалить пару" },
      { status: 500 },
    );
  }
}
