import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AtGuard } from "src/common/guards";
import { AtStrategy } from "./strategy/at.strategy";
import { RtStrategy } from "./strategy/rt.strategy";

@Module({
    imports:[PrismaModule,JwtModule.register({
        secret:process.env.JWT_SECRET,
        signOptions:{expiresIn:'15m'}
    }),ConfigModule],
    controllers:[AuthController],
    providers:[AuthService,JwtService,ConfigService,AtStrategy,RtStrategy]
})
export class AuthModule{}