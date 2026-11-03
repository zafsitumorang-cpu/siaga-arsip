import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["admin", "verifikator", "operator", "viewer"] }).notNull().default("operator"),
  subbagian: text("subbagian").notNull().default("Administrasi"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
});

export const classifications = sqliteTable("classifications", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  retentionYears: integer("retention_years").notNull().default(5),
  description: text("description").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

export const archives = sqliteTable("archives", {
  id: text("id").primaryKey(),
  archiveNumber: text("archive_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  subbagian: text("subbagian").notNull(),
  classificationCode: text("classification_code").notNull(),
  archiveDate: text("archive_date").notNull(),
  status: text("status", { enum: ["Menunggu Verifikasi", "Terverifikasi", "Ditolak", "Inaktif"] }).notNull().default("Menunggu Verifikasi"),
  confidentiality: text("confidentiality", { enum: ["Publik", "Internal", "Rahasia"] }).notNull().default("Internal"),
  fileName: text("file_name").notNull(),
  fileKey: text("file_key"),
  fileSize: integer("file_size").notNull().default(0),
  mimeType: text("mime_type").notNull().default("application/pdf"),
  uploadedBy: text("uploaded_by").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
  verifiedBy: text("verified_by"),
  verifiedAt: text("verified_at"),
  notes: text("notes").notNull().default(""),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  detail: text("detail").notNull().default(""),
  createdAt: text("created_at").notNull(),
});
