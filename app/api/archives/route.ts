import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, like, or } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { archives, auditLogs } from "../../../db/schema";
import { dummyArchives } from "../../../lib/dummy-data";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const db = getDb();
  const params = request.nextUrl.searchParams;
  const query = params.get("q")?.trim();
  const subbagian = params.get("subbagian");
  const status = params.get("status");
  const filters = [
    query ? or(like(archives.title, `%${query}%`), like(archives.archiveNumber, `%${query}%`), like(archives.classificationCode, `%${query}%`)) : undefined,
    subbagian && subbagian !== "Semua" ? eq(archives.subbagian, subbagian) : undefined,
    status && status !== "Semua" ? eq(archives.status, status as typeof archives.$inferSelect.status) : undefined,
  ].filter(Boolean);
  let rows = await db.select().from(archives).where(filters.length ? and(...filters as never[]) : undefined).orderBy(desc(archives.uploadedAt)).limit(250);
  if (!rows.length && !query && (!subbagian || subbagian === "Semua") && (!status || status === "Semua")) {
    await db.insert(archives).values(dummyArchives.map((item) => ({ ...item, status: item.status as "Menunggu Verifikasi" | "Terverifikasi" | "Ditolak" | "Inaktif", confidentiality: item.confidentiality as "Publik" | "Internal" | "Rahasia" }))).onConflictDoNothing();
    rows = await db.select().from(archives).orderBy(desc(archives.uploadedAt)).limit(250);
  }
  return NextResponse.json({ data: rows, demoMode: rows.every((row) => row.fileKey === null) });
}

export async function POST(request: NextRequest) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Autentikasi diperlukan" }, { status: 401 });
  const db = getDb();
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Berkas wajib diunggah" }, { status: 400 });
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: "Ukuran maksimum 25 MB" }, { status: 400 });
  const id = crypto.randomUUID();
  const key = `archives/${new Date().getUTCFullYear()}/${id}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  await env.BUCKET.put(key, file.stream(), { httpMetadata: { contentType: file.type }, customMetadata: { uploadedBy: user.userId } });
  const now = new Date().toISOString();
  const row = {
    id,
    archiveNumber: String(form.get("archiveNumber") || ""),
    title: String(form.get("title") || ""),
    description: String(form.get("description") || ""),
    subbagian: String(form.get("subbagian") || "Administrasi"),
    classificationCode: String(form.get("classificationCode") || "ADM.01"),
    archiveDate: String(form.get("archiveDate") || now.slice(0, 10)),
    status: "Menunggu Verifikasi" as const,
    confidentiality: String(form.get("confidentiality") || "Internal") as "Publik" | "Internal" | "Rahasia",
    fileName: file.name,
    fileKey: key,
    fileSize: file.size,
    mimeType: file.type || "application/octet-stream",
    uploadedBy: user.displayName || user.email || "Pengguna",
    uploadedAt: now,
    verifiedBy: null,
    verifiedAt: null,
    notes: "",
  };
  if (!row.title || !row.archiveNumber) return NextResponse.json({ error: "Judul dan nomor arsip wajib diisi" }, { status: 400 });
  await db.insert(archives).values(row);
  await db.insert(auditLogs).values({ id: crypto.randomUUID(), userId: user.userId, userName: row.uploadedBy, action: "UPLOAD", entityType: "archive", entityId: id, detail: `Mengunggah ${row.archiveNumber}`, createdAt: now });
  return NextResponse.json({ data: row }, { status: 201 });
}
