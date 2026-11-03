import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { getDb } from "../../../db";
import { systemSettings } from "../../../db/schema";
import { requireRoles } from "../../../lib/authz";

export const dynamic = "force-dynamic";

const defaults = {
  archiveNumberPattern: "{urut}/{kode}/{bulan_romawi}/{tahun}",
  maxUploadMb: "25",
  verificationTargetDays: "2",
  defaultRetentionYears: "5",
  allowedExtensions: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png",
  organizationName: "Bawaslu Kabupaten Aceh Timur",
};

export async function GET() {
  const rows = await getDb().select().from(systemSettings).orderBy(asc(systemSettings.key));
  const data = { ...defaults, ...Object.fromEntries(rows.map((row) => [row.key, row.value])) };
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const current = await requireRoles(["admin"]);
  if (!current) return NextResponse.json({ error: "Akses administrator diperlukan" }, { status: 403 });
  const body = await request.json() as Record<string, string>;
  const now = new Date().toISOString();
  const accepted = Object.keys(defaults);
  for (const key of accepted) {
    if (body[key] === undefined) continue;
    await getDb().insert(systemSettings).values({ key, value: String(body[key]), updatedBy: current.profile.name, updatedAt: now }).onConflictDoUpdate({ target: systemSettings.key, set: { value: String(body[key]), updatedBy: current.profile.name, updatedAt: now } });
  }
  return NextResponse.json({ ok: true });
}
