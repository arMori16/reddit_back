import { Module } from "@nestjs/common";
import { SeriesInfoService } from "./seriesInfo.service";
import { SeriesInfoController } from "./seriesInfo.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaModule } from "src/prisma/prisma.module";


@Module({
    imports:[PrismaModule],
    controllers:[SeriesInfoController],
    providers:[SeriesInfoService,PrismaService],

})
export class SeriesInfoModule{}