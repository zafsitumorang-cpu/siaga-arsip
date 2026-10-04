# Graph Report - siaga-arsip  (2026-10-04)

## Corpus Check
- 66 files · ~23,848 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .example 1, .toml 1)

## Summary
- 466 nodes · 684 edges · 30 communities (24 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5dd586c7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AuthenticatedApp.tsx
- auth.module.ts
- ArsipUploadService
- web/package.json
- server/package.json
- QueryArsipDto
- PrismaService
- @nestjs/common
- dependencies
- compilerOptions
- devDependencies
- compilerOptions
- seed.ts
- file-validation.ts
- package.json
- nest-cli.json
- What You Must Do When Invoked
- SIAGA ARSIP — Desain Demo/Prototipe
- graphify reference: extra exports and benchmark
- SIAGA ARSIP (Demo)
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 22 edges
2. `PrismaService` - 18 edges
3. `compilerOptions` - 16 edges
4. `compilerOptions` - 15 edges
5. `QueryArsipDto` - 13 edges
6. `What You Must Do When Invoked` - 12 edges
7. `SIAGA ARSIP — Desain Demo/Prototipe` - 11 edges
8. `react` - 10 edges
9. `/graphify` - 10 edges
10. `ArsipUploadService` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Self-Review` --references--> `Pagination()`  [INFERRED]
  docs/superpowers/plans/2026-10-04-siaga-arsip-demo.md → web/src/components/StatCard.tsx
- `Task 6: Frontend scaffold + auth UI` --references--> `ApiError`  [INFERRED]
  docs/superpowers/plans/2026-10-04-siaga-arsip-demo.md → web/src/lib/api.ts
- `Task 5: Upload arsip + verifikasi + statistik` --references--> `ArsipService`  [INFERRED]
  docs/superpowers/plans/2026-10-04-siaga-arsip-demo.md → server/src/arsip/arsip.service.ts
- `Task 4: Modul Arsip — daftar, detail, filter, pagination` --references--> `QueryArsipDto`  [INFERRED]
  docs/superpowers/plans/2026-10-04-siaga-arsip-demo.md → server/src/arsip/dto/query-arsip.dto.ts
- `Task 4: Modul Arsip — daftar, detail, filter, pagination` --references--> `JwtAuthGuard`  [INFERRED]
  docs/superpowers/plans/2026-10-04-siaga-arsip-demo.md → server/src/auth/jwt-auth.guard.ts

## Import Cycles
- None detected.

## Communities (30 total, 6 thin omitted)

### Community 0 - "AuthenticatedApp.tsx"
Cohesion: 0.09
Nodes (33): Task 7: Halaman Beranda, Arsip, Upload, Detail, lucide-react, react, react-router-dom, recharts, App(), Me, AuthenticatedApp() (+25 more)

### Community 1 - "auth.module.ts"
Cohesion: 0.07
Nodes (13): Task 3: Auth (login, JWT cookie, guard), class-validator, @nestjs/jwt, @nestjs/passport, @nestjs/throttler, passport-jwt, AuthController, AuthModule (+5 more)

### Community 2 - "ArsipUploadService"
Cohesion: 0.10
Nodes (5): ArsipUploadController, ArsipUploadService, ArsipDto, ArsipWithSubbagian, toArsipDto()

### Community 3 - "web/package.json"
Cohesion: 0.05
Nodes (36): autoprefixer, clsx, postcss, react-dom, tailwind-merge, tailwindcss, @types/react, @types/react-dom (+28 more)

### Community 4 - "server/package.json"
Cohesion: 0.06
Nodes (32): class-transformer, helmet, jest, multer, @nestjs/cli, @nestjs/core, @nestjs/platform-express, passport (+24 more)

### Community 5 - "QueryArsipDto"
Cohesion: 0.11
Nodes (4): ArsipController, ArsipService, toDto(), QueryArsipDto

### Community 6 - "PrismaService"
Cohesion: 0.11
Nodes (12): Review Focus, Task 1: Bootstrap monorepo + koneksi Neon, Task 2: Skema Prisma + migrasi + seed, Task 4: Modul Arsip — daftar, detail, filter, pagination, Task 5: Upload arsip + verifikasi + statistik, Task 6: Frontend scaffold + auth UI, Task 8: Uji alur penuh + README, PrismaService (+4 more)

### Community 7 - "@nestjs/common"
Cohesion: 0.10
Nodes (20): cookie-parser, @nestjs/common, @nestjs/testing, @prisma/client, supertest, AppModule, ArsipModule, ArsipDto (+12 more)

### Community 8 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, bcrypt, class-transformer, class-validator, cookie-parser, helmet, multer, @nestjs/common (+10 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+9 more)

### Community 10 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, jest, @nestjs/cli, @nestjs/testing, prisma, supertest, ts-jest, ts-node (+9 more)

### Community 11 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, incremental (+7 more)

### Community 12 - "seed.ts"
Cohesion: 0.33
Nodes (6): bcrypt, JUDUL_TEMPLATES, main(), mulberry32(), prisma, SUBBAGIAN

### Community 13 - "file-validation.ts"
Cohesion: 0.40
Nodes (4): ALLOWED_EXTENSIONS, ALLOWED_MIMETYPES, validateUpload(), ValidateUploadResult

### Community 14 - "package.json"
Cohesion: 0.40
Nodes (4): name, private, scripts, dev

### Community 15 - "nest-cli.json"
Cohesion: 0.50
Nodes (3): collection, $schema, sourceRoot

### Community 18 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 19 - "SIAGA ARSIP — Desain Demo/Prototipe"
Cohesion: 0.12
Nodes (15): Global Constraints, Self-Review, SIAGA ARSIP Demo — Implementation Plan, 10. Catatan Deployment, 1. Tujuan, 2. Stack (final, disetujui user), 3. Struktur Monorepo, 4. Skema Database (Prisma) (+7 more)

### Community 20 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 21 - "SIAGA ARSIP (Demo)"
Cohesion: 0.25
Nodes (7): Batasan upload, Catatan demo, Endpoint utama, Prasyarat, Setup, SIAGA ARSIP (Demo), Testing

### Community 22 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 23 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 24 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 25 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **210 isolated node(s):** `name`, `private`, `dev`, `$schema`, `collection` (+205 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 285 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PrismaService` connect `PrismaService` to `auth.module.ts`, `ArsipUploadService`, `QueryArsipDto`, `@nestjs/common`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **Why does `Subbagian` connect `SIAGA ARSIP — Desain Demo/Prototipe` to `AuthenticatedApp.tsx`, `PrismaService`?**
  _High betweenness centrality (0.183) - this node is a cross-community bridge._
- **Why does `Task 2: Skema Prisma + migrasi + seed` connect `PrismaService` to `SIAGA ARSIP — Desain Demo/Prototipe`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `PrismaService` (e.g. with `Task 2: Skema Prisma + migrasi + seed` and `Task 3: Auth (login, JWT cookie, guard)`) actually correct?**
  _`PrismaService` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `dev` to the rest of the system?**
  _210 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuthenticatedApp.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08705882352941176 - nodes in this community are weakly interconnected._
- **Should `auth.module.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06968641114982578 - nodes in this community are weakly interconnected._