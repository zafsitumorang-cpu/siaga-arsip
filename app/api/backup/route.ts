import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../db";
import { archives, auditLogs, classifications, systemSettings, users } from "../../../db/schema";
import { requireRoles } from "../../../lib/authz";

export const dynamic = "force-dynamic";

export async function GET() {
  const current = await requireRoles(["admin"]);
  if (!current) return NextResponse.json({ error: "Akses administrator diperlukan" }, { status: 403 });
  const db = getDb();
  const [archiveRows, classRows, userRows, settingRows, logRows] = await Promise.all([
    db.select().from(archives), db.select().from(classifications), db.select().from(users), db.select().from(systemSettings), db.select().from(auditLogs),
  ]);
  return new NextResponse(JSON.stringify({ format: "siaga-arsip-backup", version: 1, exportedAt: new Date().toISOString(), note: "Backup metadata. Objek berkas R2 tidak disertakan.", data: { archives: archiveRows, classifications: classRows, users: userRows, settings: settingRows, auditLogs: logRows } }, null, 2), { headers: { "content-type": "application/json; charset=utf-8", "content-disposition": `attachment; filename="siaga-arsip-backup-${new Date().toISOString().slice(0, 10)}.json"` } });
}

export async function POST(request: NextRequest) {
  const current = await requireRoles(["admin"]);
  if (!current) return NextResponse.json({ error: "Akses administrator diperlukan" }, { status: 403 });
  const backup = await request.json() as { format?: string; version?: number; data?: { archives?: Array<typeof archives.$inferInsert>; classifications?: Array<typeof classifications.$inferInsert>; users?: Array<typeof users.$inferInsert>; settings?: Array<typeof systemSettings.$inferInsert> } };
  if (backup.format !== "siaga-arsip-backup" || backup.version !== 1 || !backup.data) return NextResponse.json({ error: "Format backup tidak valid" }, { status: 400 });
  const db = getDb();
  for (const row of backup.data.classifications || []) await db.insert(classifications).values(row).onConflictDoNothing();
  for (const row of backup.data.users || []) await db.insert(users).values(row).onConflictDoNothing();
  for (const row of backup.data.settings || []) await db.insert(systemSettings).values(row).onConflictDoUpdate({ target: systemSettings.key, set: { value: row.value, updatedBy: current.profile.name, updatedAt: new Date().toISOString() } });
  for (const row of backup.data.archives || []) await db.insert(archives).values(row).onConflictDoNothing();
  await db.insert(auditLogs).values({ id: crypto.randomUUID(), userId: current.profile.id, userName: current.profile.name, action: "RESTORE", entityType: "backup", entityId: "metadata", detail: "Memulihkan metadata dari backup", createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
