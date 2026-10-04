import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ArsipModule } from './arsip/arsip.module';
import { StatistikModule } from './statistik/statistik.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ArsipModule,
    StatistikModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 5 }]),
  ],
})
export class AppModule {}
