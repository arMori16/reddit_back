import { Module } from "@nestjs/common";
import { SeriesInfoService, VideoFormatterService } from "./seriesInfo.service";
import { SeriesInfoController, VideoFormatter } from "./seriesInfo.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaModule } from "src/prisma/prisma.module";


@Module({
    imports:[PrismaModule],
    controllers:[SeriesInfoController,VideoFormatter],
    providers:[SeriesInfoService,PrismaService,VideoFormatterService],

})
export class SeriesInfoModule{}