-- AlterTable
ALTER TABLE "Arsip" ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedById" INTEGER;

-- CreateTable
CREATE TABLE "RiwayatArsip" (
    "id" SERIAL NOT NULL,
    "arsipId" INTEGER NOT NULL,
    "aksi" TEXT NOT NULL,
    "keterangan" TEXT,
    "userId" INTEGER,
    "username" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiwayatArsip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RiwayatArsip_arsipId_idx" ON "RiwayatArsip"("arsipId");

-- AddForeignKey
ALTER TABLE "Arsip" ADD CONSTRAINT "Arsip_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arsip" ADD CONSTRAINT "Arsip_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatArsip" ADD CONSTRAINT "RiwayatArsip_arsipId_fkey" FOREIGN KEY ("arsipId") REFERENCES "Arsip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatArsip" ADD CONSTRAINT "RiwayatArsip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
