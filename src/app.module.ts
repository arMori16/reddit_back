import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { CookieMiddleware } from './auth/strategy/cookies.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule,PrismaModule],
  controllers: [AppController],
  providers: [AppService,{
    provide:APP_GUARD,
    useClass: AtGuard
  },CookieMiddleware,JwtService],
})
export class AppModule implements NestModule{

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieMiddleware)
      .forRoutes('*'); // Или укажите конкретные маршруты
    }
}
