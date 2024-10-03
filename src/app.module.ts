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
import { SeriesInfoModule } from './seriesInfo/seriesInfo.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [AuthModule,PrismaModule,SeriesInfoModule,MailModule,MailerModule.forRoot({
    transport:'smtps://barasekson67@gmail.com:bodazopa2020@smpt.domain.com',
    defaults:{
      from:'"Mori🍃" <barasekson67@gmail.com>'
    },
    template:{
      
    }
  })],
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
