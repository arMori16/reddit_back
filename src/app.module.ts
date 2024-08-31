import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';

@Module({
  imports: [AuthModule,PrismaModule],
  controllers: [AppController],
  providers: [AppService,{
    provide:APP_GUARD,
    useClass: AtGuard
  }],
})
export class AppModule {}
