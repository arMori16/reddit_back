import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Query, Req, Res } from "@nestjs/common";
import { SeriesInfoService } from "./seriesInfo.service";
import { InfoDto } from "./dto/info.dto";
import { Public } from "src/common/decorators/public.decorator";
import { SeriesName } from "src/auth/types/seriesName.type";
import * as fs from 'fs';
import * as path from "path";
import { Response } from "express";

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
    /* @Public()
    @Get('/test')
    async getImage(@Query('SeriesName') seriesName:string,
                    @Res() res:Response){
        try{
            const imagePath = path.join('C:/users/arMori/desktop/RedditClone/reddit/public/posters',String(seriesName)+'.jpg')
            console.log('HERE IS DIRNAME',"\n",imagePath);
            return imagePath;
            /* if(fs.existsSync(imagePath)){
                console.log('all IS GOOD');
                
                res.sendFile(imagePath);
            }else {
                throw new NotFoundException('Image not found');
            } */
        /* }
        catch(err){
            console.log(err);
            
        }
    } */ 
    @Public()
    @Post('/delete')
    async getName(){
        return await this.service.deleteIs();
    }
    @Public()
    @Patch('/patch')
    async refreshInfo(@Body() seriesName:any){
        return this.service.refreshInfo(seriesName)
    }
}