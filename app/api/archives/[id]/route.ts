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
  const body = await request.json() as { title?: string; description?: string; archiveNumber?: string; archiveDate?: string; subbagian?: string; classificationCode?: string; confidentiality?: "Publik" | "Internal" | "Rahasia"; status?: "Menunggu Verifikasi" | "Terverifikasi" | "Ditolak" | "Inaktif"; notes?: string };
  const now = new Date().toISOString();
  const update = { title: body.title, description: body.description, archiveNumber: body.archiveNumber, archiveDate: body.archiveDate, subbagian: body.subbagian, classificationCode: body.classificationCode, confidentiality: body.confidentiality, status: body.status, notes: body.notes, ...(body.status ? { verifiedBy: body.status === "Terverifikasi" ? (user.displayName || user.email) : null, verifiedAt: body.status === "Terverifikasi" ? now : null } : {}) };
  await getDb().update(archives).set(update).where(eq(archives.id, id));
  await getDb().insert(auditLogs).values({ id: crypto.randomUUID(), userId: user.userId, userName: user.displayName || user.email || "Pengguna", action: body.status ? "UPDATE_STATUS" : "UPDATE", entityType: "archive", entityId: id, detail: body.status ? `Status diubah menjadi ${body.status}` : "Metadata arsip diperbarui", createdAt: now });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Autentikasi diperlukan" }, { status: 401 });
  const { id } = await params;
  const [row] = await getDb().select().from(archives).where(eq(archives.id, id)).limit(1);
  if (row?.fileKey) await env.BUCKET.delete(row.fileKey);
  await getDb().delete(archives).where(eq(archives.id, id));
  await getDb().insert(auditLogs).values({ id: crypto.randomUUID(), userId: user.userId, userName: user.displayName || user.email || "Pengguna", action: "DELETE", entityType: "archive", entityId: id, detail: `Menghapus ${row?.archiveNumber || id}`, createdAt: new Date().toISOString() });
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
