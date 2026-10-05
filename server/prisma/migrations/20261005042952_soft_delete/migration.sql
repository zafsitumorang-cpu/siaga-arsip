-- AlterTable
ALTER TABLE "Arsip" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Arsip_deletedAt_idx" ON "Arsip"("deletedAt");
