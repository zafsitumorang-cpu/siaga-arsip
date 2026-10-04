# Graph Report - siaga-arsip  (2026-10-04)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 364 nodes · 569 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ec67405d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AuthenticatedApp.tsx
- @nestjs/common
- arsip-upload.service.ts
- web/package.json
- server/package.json
- arsip.service.ts
- PrismaService
- app.module.ts
- dependencies
- compilerOptions
- devDependencies
- compilerOptions
- seed.ts
- file-validation.ts
- package.json
- nest-cli.json

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 22 edges
2. `compilerOptions` - 16 edges
3. `compilerOptions` - 15 edges
4. `PrismaService` - 14 edges
5. `QueryArsipDto` - 12 edges
6. `ArsipUploadService` - 9 edges
7. `react` - 9 edges
8. `react-router-dom` - 9 edges
9. `ArsipUploadController` - 8 edges
10. `ArsipService` - 8 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `AuthenticatedApp()`  [EXTRACTED]
  web/src/App.tsx → web/src/AuthenticatedApp.tsx
- `App()` --calls--> `Login()`  [EXTRACTED]
  web/src/App.tsx → web/src/pages/Login.tsx
- `AuthenticatedApp()` --calls--> `Layout()`  [EXTRACTED]
  web/src/AuthenticatedApp.tsx → web/src/components/Layout.tsx
- `AuthenticatedApp()` --calls--> `Beranda()`  [EXTRACTED]
  web/src/AuthenticatedApp.tsx → web/src/pages/Beranda.tsx
- `AuthenticatedApp()` --calls--> `DaftarArsip()`  [EXTRACTED]
  web/src/AuthenticatedApp.tsx → web/src/pages/DaftarArsip.tsx

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "AuthenticatedApp.tsx"
Cohesion: 0.10
Nodes (27): react, react-router-dom, App(), Me, AuthenticatedApp(), Me, Layout(), menu (+19 more)

### Community 1 - "@nestjs/common"
Cohesion: 0.08
Nodes (11): class-validator, @nestjs/common, @nestjs/jwt, @nestjs/passport, passport-jwt, AuthController, AuthService, LoginDto (+3 more)

### Community 2 - "arsip-upload.service.ts"
Cohesion: 0.08
Nodes (13): ArsipUploadController, ALLOWED_EXTENSIONS, ALLOWED_MIMETYPES, ArsipUploadService, buildStorageFilename(), CreateArsipDto, ensureUploadsDir(), UPLOADS_DIR (+5 more)

### Community 3 - "web/package.json"
Cohesion: 0.05
Nodes (36): autoprefixer, clsx, lucide-react, postcss, react-dom, tailwind-merge, tailwindcss, @types/react (+28 more)

### Community 4 - "server/package.json"
Cohesion: 0.06
Nodes (30): helmet, jest, multer, @nestjs/cli, @nestjs/core, @nestjs/platform-express, passport, prisma (+22 more)

### Community 5 - "arsip.service.ts"
Cohesion: 0.09
Nodes (8): class-transformer, @prisma/client, ArsipController, ArsipDto, ArsipService, ArsipWithSubbagian, toDto(), QueryArsipDto

### Community 6 - "PrismaService"
Cohesion: 0.13
Nodes (5): PrismaService, StatistikController, StatistikModule, StatistikDto, StatistikService

### Community 7 - "app.module.ts"
Cohesion: 0.15
Nodes (10): cookie-parser, @nestjs/testing, @nestjs/throttler, supertest, AppModule, ArsipModule, AuthModule, PrismaModule (+2 more)

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

## Knowledge Gaps
- **147 isolated node(s):** `Me`, `Me`, `Method`, `ArsipItem`, `Statistik` (+142 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 211 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `typescript` connect `web/package.json` to `server/package.json`?**
  _High betweenness centrality (0.286) - this node is a cross-community bridge._
- **Why does `@nestjs/common` connect `@nestjs/common` to `arsip-upload.service.ts`, `server/package.json`, `arsip.service.ts`, `PrismaService`, `app.module.ts`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `AuthenticatedApp.tsx` to `web/package.json`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **What connects `Me`, `Me`, `Method` to the rest of the system?**
  _147 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuthenticatedApp.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09797979797979799 - nodes in this community are weakly interconnected._
- **Should `@nestjs/common` be split into smaller, more focused modules?**
  _Cohesion score 0.07948717948717948 - nodes in this community are weakly interconnected._
- **Should `arsip-upload.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08076923076923077 - nodes in this community are weakly interconnected._