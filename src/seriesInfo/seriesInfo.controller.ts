import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { SeriesInfoService } from "./seriesInfo.service";
import { InfoDto } from "./dto/info.dto";
import { Public } from "src/common/decorators/public.decorator";
import { SeriesName } from "src/auth/types/seriesName.type";

@Controller('/catalog')
export class SeriesInfoController{
    constructor(private service:SeriesInfoService){}
    @Public()
    @Get('/item')
    async getInfo(@Query() query:SeriesName){
        return await this.service.getInfo(query)
    }
    @Public()
    @Post('/item')
    async assignInfo(@Body() dto:InfoDto){
        console.log(dto);
        try{
            
            return await this.service.assignInfo(dto)
        }
        catch(err){
            console.log(err);
            
        }
    }
}