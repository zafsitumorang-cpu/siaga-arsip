# SIAGA ARSIP Demo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun prototipe SIAGA ARSIP (dashboard + CRUD arsip + upload + verifikasi) dengan NestJS/Prisma di backend dan React/Vite di frontend.

**Architecture:** Monorepo `siaga-arsip/` berisi `server/` (NestJS + Prisma + Postgres Neon) dan `web/` (React + Vite + Tailwind). Frontend memanggil REST API `/api`; file digital disimpan di disk `server/uploads/`.

**Tech Stack:** Node 22, pnpm 10, NestJS 10, TypeScript 5, Prisma 5, PostgreSQL 16 (Neon), React 18, Vite 5, Tailwind 3, shadcn/ui, Jest, supertest, bcrypt, @nestjs/jwt, helmet, class-validator.

**Spec:** `docs/superpowers/specs/2026-10-04-siaga-arsip-demo-design.md`

## Global Constraints

- Semua kredensial di `server/.env` (gitignored): `DATABASE_URL`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`. Tidak ada secret di kode atau commit.
- Nama field Prisma: model PascalCase (`Arsip`, `Subbagian`, `User`), field camelCase.
- Enum status arsip: `MENUNGGU` | `TERVERIFIKASI` (default `MENUNGGU`).
- Upload: hanya `application/pdf`, `image/jpeg`, `image/png`; maks 10 MB; nama file di-sanitize.
- Prefix API: `/api`. Semua endpoint arsip & statistik butuh JWT valid.
- Password di-hash bcrypt (10 rounds). JWT expiry 8 jam, dikirim sebagai cookie `httpOnly`.
- Data seed: 4 subbagian, ±80 arsip. Angka statistik selalu dihitung dari data, tidak hardcode.

## Review Focus

- Upload file non-pdf/jpg/png (mis. `.exe` di-rename) → harus ditolak 400, file tidak tersimpan.
- Upload >10 MB → ditolak 413/400 tanpa membuat baris `Arsip` setengah jadi.
- Verifikasi arsip yang sudah `TERVERIFIKASI` → idempotent (tetap 200, status tetap TERVERIFIKASI), bukan error 500.
- `GET /api/arsip?page=999` melebihi data → mengembalikan array kosong + `total` benar, bukan error.
- Request tanpa/kadaluarsa JWT ke `/api/arsip` → 401, body JSON konsisten.
- `search` dengan karakter `%` atau `'` → tidak error 500 (query terparameterisasi).

---

### Task 1: Bootstrap monorepo + koneksi Neon

**Files:**
- Create: `package.json` (root, pnpm workspace), `pnpm-workspace.yaml`, `.gitignore`
- Create: `server/package.json`, `server/tsconfig.json`, `server/nest-cli.json`
- Create: `server/.env.example`, `server/.env` (tidak di-commit)
- Create: `server/src/main.ts`, `server/src/app.module.ts`

**Interfaces:**
- Produces: repo yang bisa `pnpm install` dan `pnpm --filter server start:dev` tanpa error; `DATABASE_URL` Neon tersedia.

- [ ] **Step 1: Buat proyek Neon + ambil connection string**

Lewat Neon API pakai `NEON_API_KEY` di `~/.hermes/.env`: `POST /api/v2/projects` dengan
`{ "project": { "name": "siaga-arsip", "region_id": "aws-ap-southeast-1", "pg_version": 16 } }`.
Ambil `connection_uris[0].connection_uri`, tulis ke `server/.env` sebagai `DATABASE_URL`.
Expected: `psql`-compatible URI `postgresql://...neon.tech/neondb?sslmode=require`.

- [ ] **Step 2: Inisialisasi struktur monorepo**

Root `package.json`: `{ "private": true, "scripts": { "dev": "pnpm --parallel -r dev" } }`.
`pnpm-workspace.yaml`: `packages: ["server", "web"]`.
`.gitignore`: `node_modules/`, `dist/`, `.env`, `uploads/`, `*.log`.

- [ ] **Step 3: Scaffold NestJS minimal**

`server/package.json` deps: `@nestjs/common@^10`, `@nestjs/core@^10`, `@nestjs/platform-express@^10`,
`reflect-metadata`, `rxjs`, `@prisma/client@^5`, `bcrypt`, `@nestjs/jwt`, `class-validator`,
`class-transformer`, `helmet`, `cookie-parser`, `@nestjs/throttler`. devDeps: `@nestjs/cli@^10`,
`typescript@^5`, `@nestjs/testing`, `jest`, `ts-jest`, `supertest`, `prisma@^5`, `@types/*`.
Scripts: `start:dev` (`nest start --watch`), `build`, `test`, `test:e2e`.

`server/src/main.ts`: bootstrap Nest, `app.setGlobalPrefix('api')`, pakai `helmet()` dan
`cookieParser()`, listen port dari `process.env.PORT ?? 3000`.

- [ ] **Step 4: Verifikasi server hidup**

Run: `cd server && pnpm install && pnpm start:dev`
Expected: log Nest "Nest application successfully started", `curl localhost:3000/api` tidak
menghasilkan connection error.

- [ ] **Step 5: Commit**

```bash
git add .gitignore package.json pnpm-workspace.yaml server/package.json server/tsconfig.json server/nest-cli.json server/src
git commit -m "chore: bootstrap monorepo + nestjs skeleton"
```

---

### Task 2: Skema Prisma + migrasi + seed

**Files:**
- Create: `server/prisma/schema.prisma`, `server/prisma/seed.ts`
- Create: `server/src/prisma/prisma.service.ts`, `server/src/prisma/prisma.module.ts`
- Test: `server/test/seed.spec.ts`

**Interfaces:**
- Consumes: `DATABASE_URL` dari Task 1.
- Produces: `PrismaService` (`extends PrismaClient`, `onModuleInit` connect); model
  `User`, `Subbagian`, `Arsip`; enum `StatusArsip { MENUNGGU, TERVERIFIKASI }`.

- [ ] **Step 1: Tulis skema Prisma**

```prisma
enum StatusArsip { MENUNGGU TERVERIFIKASI }

model User {
  id           Int     @id @default(autoincrement())
  username     String  @unique
  passwordHash String
  role         String  @default("ADMIN")
  createdAt    DateTime @default(now())
}

model Subbagian {
  id     Int     @id @default(autoincrement())
  nama   String  @unique
  arsip  Arsip[]
}

model Arsip {
  id              Int         @id @default(autoincrement())
  nomor           String?
  judul           String
  subbagianId     Int
  subbagian       Subbagian   @relation(fields: [subbagianId], references: [id])
  tanggalDokumen  DateTime?
  status          StatusArsip @default(MENUNGGU)
  isDigital       Boolean     @default(false)
  fileNama        String?
  filePath        String?
  createdAt       DateTime    @default(now())
  @@index([status])
  @@index([subbagianId])
}
```

- [ ] **Step 2: Jalankan migrasi**

Run: `cd server && pnpm prisma migrate dev --name init`
Expected: `migrations/` terbuat, tabel `Arsip/Subbagian/User` ada di Neon.

- [ ] **Step 3: Tulis failing test seed**

`server/test/seed.spec.ts`: setelah seed dijalankan, `prisma.subbagian.count()` == 4,
`prisma.arsip.count()` >= 80, dan `prisma.user.count()` == 1.

- [ ] **Step 4: Run test — verifikasi gagal**

Run: `cd server && pnpm jest test/seed.spec.ts`
Expected: FAIL (seed.ts belum ada / data kosong).

- [ ] **Step 5: Implementasi `prisma/seed.ts`**

Seed 4 subbagian (Administrasi, Hukum, Pengawasan, Penanganan Pelanggaran dan Penyelesaian Sengketa),
1 user dari `ADMIN_USERNAME`/`ADMIN_PASSWORD` (bcrypt 10 rounds), dan 80 arsip dengan sebaran:
judul dari daftar template + nomor urut, `subbagianId` acak deterministik, `tanggalDokumen`
antara 2025-09-01 dan 2025-10-31, ~85% `TERVERIFIKASI`, `isDigital` true untuk 90% yang terverifikasi.
Tambah script `"prisma": { "seed": "ts-node prisma/seed.ts" }`.

- [ ] **Step 6: Run test — verifikasi lulus**

Run: `cd server && pnpm prisma db seed && pnpm jest test/seed.spec.ts`
Expected: PASS (4, ≥80, 1).

- [ ] **Step 7: Commit**

```bash
git add server/prisma server/src/prisma server/test/seed.spec.ts server/package.json
git commit -m "feat: prisma schema, migration, and seed data"
```

---

### Task 3: Auth (login, JWT cookie, guard)

**Files:**
- Create: `server/src/auth/auth.module.ts`, `auth.controller.ts`, `auth.service.ts`
- Create: `server/src/auth/jwt.strategy.ts`, `server/src/auth/jwt-auth.guard.ts`, `dto/login.dto.ts`
- Test: `server/test/auth.e2e-spec.ts`

**Interfaces:**
- Consumes: `PrismaService`, `JWT_SECRET`.
- Produces: `POST /api/auth/login` → set cookie `access_token`, body `{ username, role }`;
  `GET /api/auth/me` → `{ username, role }`; `JwtAuthGuard` (export) untuk dipakai modul lain.

- [ ] **Step 1: Tulis failing e2e test**

`server/test/auth.e2e-spec.ts`: (a) login dengan kredensial benar → 201 + header `set-cookie`
berisi `access_token`; (b) login password salah → 401; (c) `GET /api/auth/me` tanpa cookie → 401;
(d) `GET /api/auth/me` dengan cookie hasil login → 200 dan `username` cocok.
Login 6x berturut-turut dengan password salah → request ke-6 mengembalikan 429 (throttler).

- [ ] **Step 2: Run test — verifikasi gagal**

Run: `cd server && pnpm jest --config test/jest-e2e.json`
Expected: FAIL (route belum ada).

- [ ] **Step 3: Implementasi AuthService**

`login(username, password)`: cari user by username; jika tidak ada atau
`bcrypt.compare` gagal → `throw new UnauthorizedException()`. Jika cocok → `jwtService.sign({ sub: user.id, username, role })`.
`validate(payload)`: ambil user by `payload.sub`, kembalikan `{ id, username, role }`.

- [ ] **Step 4: Implementasi controller + strategy + guard**

`AuthController.login` set cookie: `res.cookie('access_token', token, { httpOnly: true, sameSite: 'lax', maxAge: 8*3600*1000 })`.
`JwtStrategy` membaca token dari cookie (`cookieExtractor`), secret `JWT_SECRET`.
`ThrottlerModule.forRoot([{ ttl: 60000, limit: 5 }])` diterapkan hanya di route login.

- [ ] **Step 5: Run test — verifikasi lulus**

Run: `cd server && pnpm jest --config test/jest-e2e.json`
Expected: PASS (4 skenario + 429).

- [ ] **Step 6: Commit**

```bash
git add server/src/auth server/test/auth.e2e-spec.ts server/test/jest-e2e.json
git commit -m "feat: jwt auth with httpOnly cookie and login throttle"
```

---

### Task 4: Modul Arsip — daftar, detail, filter, pagination

**Files:**
- Create: `server/src/arsip/arsip.module.ts`, `arsip.controller.ts`, `arsip.service.ts`, `dto/query-arsip.dto.ts`
- Test: `server/test/arsip-list.e2e-spec.ts`

**Interfaces:**
- Consumes: `PrismaService`, `JwtAuthGuard` (Task 3).
- Produces:
  - `GET /api/arsip?search=&subbagianId=&status=&page=1&pageSize=10` →
    `{ items: ArsipDto[], total: number, page: number, pageSize: number }`
  - `GET /api/arsip/:id` → `ArsipDto` (404 jika tidak ada)
  - `ArsipDto`: `{ id, nomor, judul, subbagianId, subbagianNama, tanggalDokumen, status, isDigital, fileNama, createdAt }`

- [ ] **Step 1: Tulis failing e2e test**

`arsip-list.e2e-spec.ts`: (a) tanpa auth → 401; (b) `pageSize=5` → `items.length <= 5` dan
`total >= 80`; (c) `search` = judul arsip yang ada → semua hasil mengandung string itu;
(d) `search=%` → 200 (bukan 500); (e) `subbagianId` filter → semua item `subbagianId` cocok;
(f) `status=TERVERIFIKASI` → semua item berstatus itu; (g) `page=999` → `items: []`, `total` tetap benar;
(h) `GET /api/arsip/999999` → 404.

- [ ] **Step 2: Run test — verifikasi gagal**

Run: `cd server && pnpm jest --config test/jest-e2e.json -t "arsip"`
Expected: FAIL (404 route belum ada).

- [ ] **Step 3: Implementasi `ArsipService.findAll(query)`**

Prisma `findMany` + `count` dalam `$transaction`. `where.judul = { contains: search, mode: 'insensitive' }`
(tanpa raw SQL → aman dari `%` dan `'`). `skip = (page-1)*pageSize`, `take = pageSize`,
`orderBy: { createdAt: 'desc' }`, `include: { subbagian: true }`. Map ke `ArsipDto`.

- [ ] **Step 4: Implementasi controller + DTO validasi**

`QueryArsipDto` dengan `class-validator`: `page`/`pageSize` `@Type(() => Number) @IsInt() @Min(1)`,
`pageSize` `@Max(100)`, `status` `@IsEnum(StatusArsip) @IsOptional()`, `search` `@IsString() @IsOptional()`.
Semua route pakai `@UseGuards(JwtAuthGuard)`.

- [ ] **Step 5: Run test — verifikasi lulus**

Run: `cd server && pnpm jest --config test/jest-e2e.json -t "arsip"`
Expected: PASS (8 skenario).

- [ ] **Step 6: Commit**

```bash
git add server/src/arsip server/test/arsip-list.e2e-spec.ts
git commit -m "feat: arsip list, detail, search, filter, pagination"
```

---

### Task 5: Upload arsip + verifikasi + statistik

**Files:**
- Create: `server/src/arsip/arsip-upload.controller.ts` (atau perluas `arsip.controller.ts`)
- Create: `server/src/arsip/file-validation.ts`, `server/src/statistik/statistik.module.ts`, `statistik.controller.ts`, `statistik.service.ts`
- Test: `server/test/upload-verifikasi.e2e-spec.ts`, `server/test/statistik.spec.ts`

**Interfaces:**
- Consumes: `ArsipService`, `PrismaService`.
- Produces:
  - `POST /api/arsip` (multipart: field `file` + `judul`, `nomor?`, `subbagianId`, `tanggalDokumen?`)
    → 201 `ArsipDto`, file tersimpan di `server/uploads/<uuid>.<ext>`, `isDigital=true`, `status=MENUNGGU`
  - `PATCH /api/arsip/:id/verifikasi` → `ArsipDto` dengan `status=TERVERIFIKASI`
  - `GET /api/statistik` → `{ total, aktif, terverifikasi, digital, perSubbagian: [{ id, nama, jumlah }] }`
  - Pure function `validateUpload(mimetype, originalname, size): { ok: boolean; reason?: string }`

- [ ] **Step 1: Tulis failing test upload**

`upload-verifikasi.e2e-spec.ts`: (a) upload `sample.pdf` valid → 201, `isDigital=true`, `status=MENUNGGU`,
file ada di `uploads/`; (b) upload `evil.exe` dengan mimetype dipalsukan `application/pdf` → 400 dan
**tidak ada** baris `Arsip` baru; (c) upload file 11 MB → 400/413, tidak ada baris baru;
(d) `PATCH /api/arsip/:id/verifikasi` → `status=TERVERIFIKASI`; (e) panggil verifikasi kedua kali → tetap 200
`TERVERIFIKASI`; (f) `PATCH /api/arsip/999999/verifikasi` → 404.

- [ ] **Step 2: Run test — verifikasi gagal**

Run: `cd server && pnpm jest --config test/jest-e2e.json -t "upload"`
Expected: FAIL.

- [ ] **Step 3: Implementasi validasi + upload**

`validateUpload`: mimetype harus di daftar `['application/pdf','image/jpeg','image/png']`, ekstensi
`originalname` di `['.pdf','.jpg','.jpeg','.png']`, `size <= 10*1024*1024`. Multer `diskStorage`:
`filename = randomUUID() + ext.toLowerCase()`, `destination = ./uploads` (dibuat saat bootstrap).
Simpan metadata ke DB **setelah** file tersimpan; jika DB gagal, hapus file.

- [ ] **Step 4: Implementasi verifikasi + statistik**

`ArsipService.verifikasi(id)`: `updateMany({ where: { id, status: 'MENUNGGU' }, data: { status: 'TERVERIFIKASI' } })`,
lalu `findUnique(id)`; jika arsip tidak ada → 404. Idempotent karena `updateMany` aman diulang.
`StatistikService.get()`: satu `prisma.$transaction([...])` berisi `count` total, count `TERVERIFIKASI`,
count `isDigital`, dan `groupBy({ by: ['subbagianId'], _count: true })`; `aktif` = total − 0 (semua arsip
dianggap aktif pada demo) — tulis komentar ini di kode.

- [ ] **Step 5: Tulis failing test statistik**

`server/test/statistik.spec.ts` (unit, PrismaService di-mock): total 80, TERVERIFIKASI 68, digital 61,
`perSubbagian` berisi 4 entri dengan jumlah yang menjumlah ke total.

- [ ] **Step 6: Run semua test — verifikasi lulus**

Run: `cd server && pnpm test && pnpm jest --config test/jest-e2e.json`
Expected: PASS semua.

- [ ] **Step 7: Commit**

```bash
git add server/src server/test
git commit -m "feat: upload with validation, verification, and dashboard statistics"
```

---

### Task 6: Frontend scaffold + auth UI

**Files:**
- Create: `web/package.json`, `web/vite.config.ts`, `web/tailwind.config.js`, `web/postcss.config.js`, `web/index.html`
- Create: `web/src/main.tsx`, `web/src/App.tsx`, `web/src/lib/api.ts`, `web/src/pages/Login.tsx`, `web/src/components/Layout.tsx`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: API Task 3 (`/api/auth/login`, `/api/auth/me`).
- Produces: `api.get/post/patch` (fetch wrapper `credentials: 'include'`, lempar `ApiError` berisi status);
  route `/login`, layout sidebar dengan menu Beranda/Arsip/Upload/Laporan(placeholder).

- [ ] **Step 1: Scaffold Vite + Tailwind**

`web/package.json` deps: `react@^18`, `react-dom@^18`, `react-router-dom@^6`, `lucide-react`, `clsx`, `tailwind-merge`.
devDeps: `vite@^5`, `@vitejs/plugin-react`, `typescript`, `tailwindcss@^3`, `postcss`, `autoprefixer`, `@types/react`, `@types/react-dom`.
`vite.config.ts` proxy `/api` → `http://localhost:3000`.

- [ ] **Step 2: Implementasi `lib/api.ts`**

`async function request(method, path, body?)`: `fetch(path, { method, credentials: 'include', headers, body })`;
jika `!res.ok` → `throw new ApiError(res.status, await res.json().catch(() => null))`.
Ekspor `api = { get, post, patch, postForm }` (untuk multipart tanpa set `Content-Type`).

- [ ] **Step 3: Implementasi Login + guard route**

`Login.tsx`: form username/password, submit → `api.post('/auth/login', ...)`, sukses → `navigate('/')`,
gagal → tampilkan pesan "Username atau password salah". `App.tsx`: cek `api.get('/auth/me')` saat mount;
jika 401 → redirect `/login`.

- [ ] **Step 4: Verifikasi build & alur login**

Run: `cd web && pnpm install && pnpm build`
Expected: build sukses. Lalu `pnpm dev` + backend jalan: login benar masuk ke Beranda, login salah menampilkan pesan.

- [ ] **Step 5: Commit**

```bash
git add web .gitignore
git commit -m "feat: frontend scaffold, api client, login flow"
```

---

### Task 7: Halaman Beranda, Arsip, Upload, Detail

**Files:**
- Create: `web/src/pages/Beranda.tsx`, `web/src/pages/DaftarArsip.tsx`, `web/src/pages/UploadArsip.tsx`, `web/src/pages/DetailArsip.tsx`
- Create: `web/src/components/StatCard.tsx`, `web/src/components/StatusBadge.tsx`, `web/src/components/Pagination.tsx`
- Modify: `web/src/App.tsx`

**Interfaces:**
- Consumes: `api`, `GET /api/statistik`, `GET /api/arsip`, `POST /api/arsip`, `PATCH /api/arsip/:id/verifikasi`.
- Produces: 4 halaman fungsional; `StatusBadge` menampilkan "Terverifikasi" (hijau) / "Menunggu Verifikasi" (kuning).

- [ ] **Step 1: Implementasi Beranda**

4 `StatCard` (Total Arsip, Arsip Aktif, Arsip Terverifikasi, Arsip Digital) dari `GET /api/statistik`;
daftar per subbagian dengan jumlah + tombol "Lihat Arsip" (navigasi ke `/arsip?subbagianId=X`);
tabel "Arsip Terbaru" (10 item pertama). Format tanggal `id-ID`.

- [ ] **Step 2: Implementasi Daftar Arsip**

Input pencarian (debounce 300 ms), dropdown subbagian, dropdown status, tabel dengan kolom
Judul/Nomor/Subbagian/Tanggal/Status, `Pagination` (prev/next + "menampilkan X–Y dari N").
Total arsip aktif bila datang dengan query `subbagianId` dari Beranda.

- [ ] **Step 3: Implementasi Upload Arsip**

Form: judul (wajib), nomor, subbagian (wajib), tanggal (input date), file (accept `.pdf,.jpg,.jpeg,.png`).
Validasi klien ukuran ≤10 MB sebelum kirim; kirim via `api.postForm('/arsip', formData)`;
sukses → toast "Arsip berhasil diunggah" + reset form; error → tampilkan pesan dari server.

- [ ] **Step 4: Implementasi Detail Arsip**

Tampilkan metadata + tombol "Buka Dokumen" (link ke `/api/arsip/:id/file` — tambah endpoint statis
`ServeStaticModule`/`res.sendFile` di backend pada langkah ini) dan tombol "Verifikasi" (hanya jika
status `MENUNGGU`) → `PATCH` → refresh data.

- [ ] **Step 5: Verifikasi manual end-to-end**

Run: `pnpm --filter web dev` + backend; di browser: login → Beranda angka muncul → klik "Lihat Arsip"
pada Administrasi → daftar terfilter → buka detail → verifikasi arsip MENUNGGU → status berubah →
Beranda angka Terverifikasi naik 1. Screenshot hasilnya sebelum commit.

- [ ] **Step 6: Commit**

```bash
git add web/src
git commit -m "feat: dashboard, arsip list, upload, and detail pages"
```

---

### Task 8: Uji alur penuh + README

**Files:**
- Create: `README.md`, `server/test/flow.e2e-spec.ts`

**Interfaces:**
- Consumes: seluruh endpoint.
- Produces: bukti alur login → upload → verifikasi → statistik terverifikasi bertambah; README cara menjalankan.

- [ ] **Step 1: Tulis e2e alur penuh**

`flow.e2e-spec.ts`: ambil statistik awal → login → upload 1 arsip → verifikasi → ambil statistik akhir;
assert `akhir.total === awal.total + 1` dan `akhir.terverifikasi === awal.terverifikasi + 1`.

- [ ] **Step 2: Run test — verifikasi lulus**

Run: `cd server && pnpm jest --config test/jest-e2e.json -t "flow"`
Expected: PASS.

- [ ] **Step 3: Tulis README**

Isi: prasyarat, langkah `pnpm install`, isi `.env`, `pnpm prisma migrate deploy`, `pnpm prisma db seed`,
`pnpm dev`, akun default, dan catatan bahwa ini demo (bukan untuk data arsip asli).

- [ ] **Step 4: Commit**

```bash
git add README.md server/test/flow.e2e-spec.ts
git commit -m "test: full flow e2e + README"
```

---

## Self-Review

- **Spec coverage:** arsitektur (T1), skema DB (T2), auth (T3), daftar/detail/filter/pagination (T4),
  upload+verifikasi+statistik (T5), halaman frontend (T6–T7), testing (T2/T3/T4/T5/T8),
  seed (T2), keamanan dasar (T1 helmet, T3 throttle, T4 validasi query, T5 validasi file).
  YAGNI items sengaja tidak ada task-nya.
- **Type consistency:** `ArsipDto`, `StatusArsip`, `validateUpload`, `api.get/post/patch/postForm`,
  `StatCard`, `StatusBadge`, `Pagination` konsisten dipakai antar task.
- **Review Focus:** tiap baris punya test di T4 (b, d, g, h) dan T5 (a–f); baris `%`/`'` di T4(d).
- **Proportion:** plan ini mendefinisikan signature, nama test, dan nilai dari spec; isi fungsi
  diserahkan ke implementer.
