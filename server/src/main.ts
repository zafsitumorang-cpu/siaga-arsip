import 'reflect-metadata';
import { existsSync } from 'fs';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // behind Render/proxy — trust X-Forwarded-* so cookies & protocol are correct
    bodyParser: true,
  });
  app.set('trust proxy', 1);
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  app.enableCors({ origin: true, credentials: true });

  // Serve the built SPA (web/dist) from the same origin when it exists.
  // Locally the server runs from server/ (dist at ../web/dist); on Render the
  // start command runs from the repo root (web/dist). Try both, plus $WEB_DIST.
  const candidates = [
    process.env.WEB_DIST,
    join(process.cwd(), 'web', 'dist'),
    join(process.cwd(), '..', 'web', 'dist'),
  ].filter((p): p is string => Boolean(p));
  const webDist = candidates.find((p) => existsSync(join(p, 'index.html')));
  if (webDist) {
    app.useStaticAssets(webDist);
    // SPA fallback: any non-/api GET without a file extension → index.html
    app.use((req: { method: string; path: string; accepts: (t: string) => string }, res: any, next: () => void) => {
      const isApi = req.path.startsWith('/api');
      const hasExtension = /\.[a-z0-9]+$/i.test(req.path);
      if (req.method !== 'GET' || isApi || hasExtension) {
        return next();
      }
      res.sendFile(join(webDist, 'index.html'));
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
