import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { users } from "../../../db/schema";
import { getCurrentAppUser } from "../../../lib/authz";

export const dynamic = "force-dynamic";

export async function GET() {
  const current = await getCurrentAppUser();
  if (!current) return NextResponse.json({ error: "Autentikasi diperlukan" }, { status: 401 });
  return NextResponse.json({ data: current.profile });
}

export async function PATCH(request: NextRequest) {
  const current = await getCurrentAppUser();
  if (!current) return NextResponse.json({ error: "Autentikasi diperlukan" }, { status: 401 });
  const body = await request.json() as { name?: string; subbagian?: string };
  const update = { name: body.name?.trim() || current.profile.name, subbagian: body.subbagian || current.profile.subbagian };
  await getDb().update(users).set(update).where(eq(users.id, current.profile.id));
  return NextResponse.json({ data: { ...current.profile, ...update } });
}
