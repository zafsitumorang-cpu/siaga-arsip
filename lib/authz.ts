import { eq } from "drizzle-orm";
import { getChatGPTUser } from "../app/chatgpt-auth";
import { getDb } from "../db";
import { users } from "../db/schema";

export async function getCurrentAppUser() {
  const identity = await getChatGPTUser();
  if (!identity) return null;
  const db = getDb();
  let [profile] = await db.select().from(users).where(eq(users.id, identity.userId)).limit(1);
  if (!profile) {
    profile = {
      id: identity.userId,
      email: identity.email || "user@bawaslu.go.id",
      name: identity.displayName || identity.email || "Administrator",
      role: "admin",
      subbagian: "Administrasi",
      active: true,
      createdAt: new Date().toISOString(),
    };
    await db.insert(users).values(profile).onConflictDoNothing();
  }
  if (!profile.active) return null;
  return { identity, profile };
}

export async function requireRoles(allowed: Array<"admin" | "verifikator" | "operator" | "viewer">) {
  const current = await getCurrentAppUser();
  if (!current || !allowed.includes(current.profile.role)) return null;
  return current;
}
