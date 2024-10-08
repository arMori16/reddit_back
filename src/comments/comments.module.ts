import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsGateway } from "websockets/websockets";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { CommentsController } from "./comments.controller";



@Module({
    imports:[PrismaModule],
    controllers:[CommentsController],
    providers:[CommentsService,PrismaService,CommentsGateway]
})
export class CommentsModule{}