import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditLogs } from "../../../db/schema";
import { requireRoles } from "../../../lib/authz";

export const dynamic = "force-dynamic";

export async function GET() {
  const current = await requireRoles(["admin", "verifikator"]);
  if (!current) return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  const rows = await getDb().select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100);
  return NextResponse.json({ data: rows });
}
