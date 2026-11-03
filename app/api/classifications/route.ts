import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditLogs, classifications } from "../../../db/schema";
import { dummyClassifications } from "../../../lib/dummy-data";
import { requireRoles } from "../../../lib/authz";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  let rows = await db.select().from(classifications).orderBy(asc(classifications.code));
  if (!rows.length) {
    const now = new Date().toISOString();
    await db.insert(classifications).values(dummyClassifications.map((item) => ({ ...item, createdAt: now }))).onConflictDoNothing();
    rows = await db.select().from(classifications).orderBy(asc(classifications.code));
  }
  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest) {
  const current = await requireRoles(["admin"]);
  if (!current) return NextResponse.json({ error: "Akses administrator diperlukan" }, { status: 403 });
  const body = await request.json() as { code?: string; name?: string; retentionYears?: number; description?: string };
  if (!body.code?.trim() || !body.name?.trim()) return NextResponse.json({ error: "Kode dan nama wajib diisi" }, { status: 400 });
  const row = { id: crypto.randomUUID(), code: body.code.trim().toUpperCase(), name: body.name.trim(), retentionYears: Math.max(1, Number(body.retentionYears) || 5), description: body.description?.trim() || "", createdAt: new Date().toISOString() };
  await getDb().insert(classifications).values(row);
  await getDb().insert(auditLogs).values({ id: crypto.randomUUID(), userId: current.profile.id, userName: current.profile.name, action: "CREATE", entityType: "classification", entityId: row.id, detail: `Menambah klasifikasi ${row.code}`, createdAt: row.createdAt });
  return NextResponse.json({ data: row }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const current = await requireRoles(["admin"]);
  if (!current) return NextResponse.json({ error: "Akses administrator diperlukan" }, { status: 403 });
  const body = await request.json() as { id?: string; name?: string; retentionYears?: number; description?: string };
  if (!body.id) return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
  await getDb().update(classifications).set({ name: body.name?.trim(), retentionYears: Math.max(1, Number(body.retentionYears) || 5), description: body.description?.trim() || "" }).where(eq(classifications.id, body.id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const current = await requireRoles(["admin"]);
  if (!current) return NextResponse.json({ error: "Akses administrator diperlukan" }, { status: 403 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
  await getDb().delete(classifications).where(eq(classifications.id, id));
  return NextResponse.json({ ok: true });
}
