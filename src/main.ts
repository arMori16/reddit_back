import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

import { CookieMiddleware } from './auth/strategy/cookies.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:true
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true
    }
  ))
  app.use(
    session({
      secret:process.env.SESSION_SECRET,
      resave:false,
      saveUninitialized:false
    })
  )
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
