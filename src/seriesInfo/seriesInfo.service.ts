import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { InfoDto } from "./dto/info.dto";
import { SeriesName } from "src/auth/types/seriesName.type";


@Injectable()
export class SeriesInfoService{
    constructor(private prisma:PrismaService){}
    async assignInfo(dto:InfoDto){
        console.log('URA2');
        try{
            if (!dto.SeriesName) {
                console.log('URA3');
                throw new Error('SeriesName is required');
            }
            const isExist = await this.prisma.infoSeries.findUnique({
                where:{
                    SeriesName:dto?.SeriesName
                }
            })
            if(isExist){
                console.log('URA4');
                return false;
            }
            const info = await this.prisma.infoSeries.create({
                data:{
                    SeriesName:dto.SeriesName,
                    Rate:dto.Rate,
                    Status:dto.Status,
                    Type:dto.Type,
                    ReleaseYear:dto.ReleaseYear,
                    Genre:dto.Genre,
                    Studio:dto.Studio,
                    AmountOfEpisode:dto.AmountOfEpisode,
                    VoiceActing:dto.VoiceActing,
                    VideoSource:dto.VideoSource,
                },
                select:{
                    SeriesName:true,
                    Rate:true,
                    Status:true,
                    Type:true,
                    ReleaseYear:true,
                    Genre:true,
                    Studio:true,
                    AmountOfEpisode:true,
                    VoiceActing:true,
                    VideoSource:true,

                }
            })
            console.log('URA5');
            console.log(info);
            
            return info;
        }catch(err){
            console.log(err);
            return false;
        }
    }
    async getInfo(seriesName:SeriesName){
        try{
            
            const info = this.prisma.infoSeries.findUnique({
                where:{
                    SeriesName:seriesName.SeriesName
                },
                select:{
                    SeriesName:true,
                    Rate:true,
                    Status:true,
                    Type:true,
                    ReleaseYear:true,
                    Genre:true,
                    Studio:true,
                    AmountOfEpisode:true,
                    VoiceActing:true,
                    VideoSource:true,

                }
            })
            return info;
        }catch(err){
            console.log(err);
            return false;
        }
    }
}