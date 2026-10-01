import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const updates: { key: string; value: string }[] = [];

    if (typeof body.group === "string") {
      const group = body.group.trim().slice(0, 40);
      if (!group) {
        return NextResponse.json(
          { error: "Название группы не может быть пустым" },
          { status: 400 },
        );
      }
      updates.push({ key: "group", value: group });
    }
    if (typeof body.semesterStart === "string") {
      const v = body.semesterStart.trim();
      if (v && !DATE_RE.test(v)) {
        return NextResponse.json(
          { error: "Дата должна быть в формате ГГГГ-ММ-ДД" },
          { status: 400 },
        );
      }
      updates.push({ key: "semesterStart", value: v });
    }

    for (const u of updates) {
      await db
        .insert(settings)
        .values(u)
        .onConflictDoUpdate({ target: settings.key, set: { value: u.value } });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/settings", e);
    return NextResponse.json(
      { error: "Не удалось сохранить настройки" },
      { status: 500 },
    );
  }
}
