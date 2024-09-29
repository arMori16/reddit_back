import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Query, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { SeriesInfoService, VideoFormatterService } from "./seriesInfo.service";
import { InfoDto } from "./dto/info.dto";
import { Public } from "src/common/decorators/public.decorator";
import { SeriesName } from "src/auth/types/seriesName.type";
import * as fsSync from 'fs';
import {promises as fs} from "fs";
import * as path from "path";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('/catalog')
export class SeriesInfoController{
    constructor(private service:SeriesInfoService){}
    @Public()
    @Get('/getAmountOfSeries')
    async getAmountOfSeries(){
        return this.service.getAmountOfSeries();
    }
    @Public()
    @Get('/:getImage')
    async getImage(@Param('getImage') getImage:string,@Res() res:Response){
        try{
            const pathImage = path.join(__dirname,'..','..',`public/images/${getImage}.jpg`);
            /* console.log('PATH IMAGE: ',pathImage);
            
            const files = await fs.readdir(pathImage);
            const images = await files.map(file=>path.join(pathImage,file)); */
            res.sendFile(pathImage);
        }
        catch(err){
            console.error('Error when tried to read');
            return res.status(500).json({error:'Cannot connect to the lis of images'})
        }

    }

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
    @Public()
    @Get(':filename/:quality')
    async getVideo(@Param('filename') filename:string,@Param('quality') quality:string,@Res() res:Response){
        const file = path.join(__dirname,'..','..',`src/video/${filename}/${quality}/${quality}.mp4`);
        if (fsSync.existsSync(file)) {
            return res.sendFile(file);
          } else {
            return res.status(404).send('File not found');
          }
    }
}


@Controller('/videoFormat')
export class VideoFormatter{
    constructor(private service:VideoFormatterService){}
    @Public()
    @Post()
    async uploadVideo(@Body('videoUrl') videoUrl:string,
                      @Body('numOfEpisode') numOfEpisode:number,
                      @Body('seriesName') seriesName:string,
                      @Res() res:Response){
    try {
        const result = await this.service.videoUpload(videoUrl,seriesName,numOfEpisode);
         // Передаем URL на обработку
        return res.json(result);
        } catch (err) {
            console.error('Ошибка при обработке видео:', err);
            return res.status(500).json({ message: 'Ошибка при обработке видео' });
        }
    }
    @Public()
    @Get('/getRoute')
    async getRoute(@Query('seriesName') seriesName:string,
                    @Query('quality') quality:string,
                    @Req() req:Request,
                    @Res() res:Response){
                        try {
                            const filePath = await this.service.getRoute(seriesName, quality);
                            if (filePath) {
                                console.log('Sending file path:', filePath);
    
                                return res.status(200).json({filePath}); // Отправляем путь в ответе
                            } else {
                                return res.status(404).json({ message: 'Файл не найден' });
                            } 
                        } catch (err) {
                            console.error('Ошибка при обработке видео:', err);
                            return res.status(500).json({ message: 'Ошибка при обработке видео' });
                        }
    }
    @Public()
    @Get('/getVideo')
    async getVideo(@Query('path') videoPath:string,@Req() req:Request,@Res() res:Response){
        
        try {

            const range = req.headers['range'];
            if (!range) {
                res.status(404).send('Requires range')
            }
            const CHUNK_SIZE = 10 ** 6;
            const fullPath = `${videoPath}`;
            console.log('IS FULLPUTH: ',fullPath);
            
            const videoSize = fsSync.statSync(fullPath).size;
            const start = Number(range.replace(/\D/g, ''));
            const end = Math.min(start + CHUNK_SIZE,videoSize - 1); // 1 MB block

            const contentLength = end - start + 1;
            const headers = {
                'Content-Range': `bytes ${start}-${end}/${videoSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': contentLength,
                'Content-Type': 'video/mp4',
            };
            const videoStream = fsSync.createReadStream(fullPath, { start, end });
            res.writeHead(206, headers);
            videoStream.pipe(res);
        } catch (error) {
            console.error('Error sending video:', error);
            res.status(500).send('Error sending video');
        }
    }
    @Public()
    @Get(':seriesName-:episode/:resolution/:segmentName')
    getSegment(
      @Res() res: Response,
      @Param('seriesName') seriesName: string,
      @Param('episode') episode: number,
      @Param('resolution') resolution: string,
      @Param('segmentName') segmentName: string,
    ) {
        const filePath = path.join(__dirname, 'src', 'video', seriesName, resolution, segmentName);
        console.log('FILEPATH',filePath);
        
        res.sendFile(filePath, { root: '.' }, (err) => {
          if (err) {
            console.error(err);
            res.status(404).send('File not found');
          }
        });
    }
}
            /* console.log('PATH ARGUMENT: ',videoPath);
            console.log('VIDEOPATH IN SERVICE: ',videoPath);
            const videoSize = (await fs.stat(videoPath)).size;
            const CHUNK_SIZE = 10 ** 6;
            const range = req.headers['range'] as string | undefined;
            if (!range) {
                return new ForbiddenException('Range не найденно');
            }
            const start = Number(range.replace(/\D/g,""));
            const end = Math.min(start + CHUNK_SIZE,videoSize - 1);

            const contentLength = end - start + 1;
            const videoStream = fsSync.createReadStream(videoPath, { start, end });
            const headers = {
                'Content-Range':`bytes ${start}-${end}/${videoSize}`,
                'Accept-Ranges':'bytes',
                'Content-Length':contentLength,
                'Content-Type':'video/mp4'
            }
        
        res.writeHead(206,headers);

        // Передаем поток в ответ
        videoStream.pipe(res);
        

        // Если возникнет ошибка при стриминге, логируем ошибку
        videoStream.on('error', (error) => {
            console.error('Ошибка при чтении видео:', error);
            res.status(500).send('Ошибка при чтении видео');
        }); */
            /* await this.service.getVideoInfo(videoPath,req,res) */
            /* return res.sendFile(videoPath, (err) => {
                if (err) {
                  console.error('Ошибка при отправке видео frontend:', err);
                  return res.status(500).json({ message: 'Ошибка при отправке видео na frontend' });
                }
              }); */

