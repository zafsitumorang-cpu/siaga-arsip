-- CreateEnum
CREATE TYPE "StatusArsip" AS ENUM ('MENUNGGU', 'TERVERIFIKASI');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subbagian" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Subbagian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arsip" (
    "id" SERIAL NOT NULL,
    "nomor" TEXT,
    "judul" TEXT NOT NULL,
    "subbagianId" INTEGER NOT NULL,
    "tanggalDokumen" TIMESTAMP(3),
    "status" "StatusArsip" NOT NULL DEFAULT 'MENUNGGU',
    "isDigital" BOOLEAN NOT NULL DEFAULT false,
    "fileNama" TEXT,
    "filePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Arsip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Subbagian_nama_key" ON "Subbagian"("nama");

-- CreateIndex
CREATE INDEX "Arsip_status_idx" ON "Arsip"("status");

-- CreateIndex
CREATE INDEX "Arsip_subbagianId_idx" ON "Arsip"("subbagianId");

-- AddForeignKey
ALTER TABLE "Arsip" ADD CONSTRAINT "Arsip_subbagianId_fkey" FOREIGN KEY ("subbagianId") REFERENCES "Subbagian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
