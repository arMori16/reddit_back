import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports:[PrismaModule,JwtModule.register({
    }),ConfigModule],
    controllers:[AuthController],
    providers:[AuthService,JwtService,ConfigService]
})
export class AuthModule{}