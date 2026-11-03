import { NextRequest, NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { archives, auditLogs } from "../../../../db/schema";
import { getChatGPTUser } from "../../../chatgpt-auth";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Autentikasi diperlukan" }, { status: 401 });
  const { id } = await params;
  const body = await request.json() as { status?: "Menunggu Verifikasi" | "Terverifikasi" | "Ditolak" | "Inaktif"; notes?: string };
  const now = new Date().toISOString();
  await getDb().update(archives).set({ status: body.status, notes: body.notes, verifiedBy: body.status === "Terverifikasi" ? (user.name || user.email) : null, verifiedAt: body.status === "Terverifikasi" ? now : null }).where(eq(archives.id, id));
  await getDb().insert(auditLogs).values({ id: crypto.randomUUID(), userId: user.userId, userName: user.name || user.email || "Pengguna", action: "UPDATE_STATUS", entityType: "archive", entityId: id, detail: `Status diubah menjadi ${body.status}`, createdAt: now });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Autentikasi diperlukan" }, { status: 401 });
  const { id } = await params;
  const [row] = await getDb().select().from(archives).where(eq(archives.id, id)).limit(1);
  if (row?.fileKey) await env.BUCKET.delete(row.fileKey);
  await getDb().delete(archives).where(eq(archives.id, id));
  return NextResponse.json({ ok: true });
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await getDb().select().from(archives).where(eq(archives.id, id)).limit(1);
  if (!row?.fileKey) return NextResponse.json({ error: "Berkas dummy tidak memiliki file fisik" }, { status: 404 });
  const object = await env.BUCKET.get(row.fileKey);
  if (!object) return NextResponse.json({ error: "Berkas tidak ditemukan" }, { status: 404 });
  return new Response(object.body, { headers: { "content-type": row.mimeType, "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(row.fileName)}` } });
}
