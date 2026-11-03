import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditLogs, users } from "../../../db/schema";
import { requireRoles } from "../../../lib/authz";

export const dynamic = "force-dynamic";

const demoUsers = [
  { id: "usr-admin", email: "admin@bawaslu-acehtimur.go.id", name: "Administrator", role: "admin" as const, subbagian: "Administrasi", active: true },
  { id: "usr-verifikator", email: "verifikator@bawaslu-acehtimur.go.id", name: "Verifikator Arsip", role: "verifikator" as const, subbagian: "Administrasi", active: true },
  { id: "usr-hukum", email: "hukum@bawaslu-acehtimur.go.id", name: "Operator Hukum", role: "operator" as const, subbagian: "Hukum", active: true },
  { id: "usr-pengawasan", email: "pengawasan@bawaslu-acehtimur.go.id", name: "Operator Pengawasan", role: "operator" as const, subbagian: "Pengawasan", active: true },
];

export async function GET() {
  const current = await requireRoles(["admin", "verifikator"]);
  if (!current) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  const db = getDb();
  let rows = await db.select().from(users).orderBy(asc(users.name));
  if (rows.length <= 1) {
    const now = new Date().toISOString();
    await db.insert(users).values(demoUsers.map((item) => ({ ...item, createdAt: now }))).onConflictDoNothing();
    rows = await db.select().from(users).orderBy(asc(users.name));
  }
  return NextResponse.json({ data: rows });
}

export async function POST(request: NextRequest) {
  const current = await requireRoles(["admin"]);
  if (!current) return NextResponse.json({ error: "Akses administrator diperlukan" }, { status: 403 });
  const body = await request.json() as { name?: string; email?: string; role?: "admin" | "verifikator" | "operator" | "viewer"; subbagian?: string };
  if (!body.name?.trim() || !body.email?.trim()) return NextResponse.json({ error: "Nama dan email wajib diisi" }, { status: 400 });
  const row = { id: crypto.randomUUID(), name: body.name.trim(), email: body.email.trim().toLowerCase(), role: body.role || "operator", subbagian: body.subbagian || "Administrasi", active: true, createdAt: new Date().toISOString() };
  await getDb().insert(users).values(row);
  await getDb().insert(auditLogs).values({ id: crypto.randomUUID(), userId: current.profile.id, userName: current.profile.name, action: "CREATE", entityType: "user", entityId: row.id, detail: `Menambah pengguna ${row.email}`, createdAt: row.createdAt });
  return NextResponse.json({ data: row }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const current = await requireRoles(["admin"]);
  if (!current) return NextResponse.json({ error: "Akses administrator diperlukan" }, { status: 403 });
  const body = await request.json() as { id?: string; name?: string; role?: "admin" | "verifikator" | "operator" | "viewer"; subbagian?: string; active?: boolean };
  if (!body.id) return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
  await getDb().update(users).set({ name: body.name, role: body.role, subbagian: body.subbagian, active: body.active }).where(eq(users.id, body.id));
  return NextResponse.json({ ok: true });
}
