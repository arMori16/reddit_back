import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { InfoDto } from "./dto/info.dto";
import { Response } from "express";
import { SeriesName } from "src/auth/types/seriesName.type";
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fsSync from 'fs';
import {promises as fs} from "fs";
import { pipeline } from "stream";

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
                    SeriesViewName:dto.SeriesViewName,
                    Description:dto.Description,
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
                    Description:true,
                    SeriesViewName:true,
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
        console.log('ITs BACKEND SERIESNAME',seriesName);
        if (!seriesName) {
            throw new Error('SeriesName cannot be undefined or null');
        }
        try{
            console.log('ITs BACKEND SERIESNAME 2',seriesName);
            
            const info = this.prisma.infoSeries.findUnique({
                where:{
                    SeriesName:seriesName.SeriesName
                },
                select:{
                    SeriesName:true,
                    SeriesViewName:true,
                    Description:true,
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
    async deleteIs(){
        const deleteIs =  this.prisma.infoSeries.deleteMany({});
        console.log(deleteIs);
        return deleteIs;
    }
    async refreshInfo(seriesName:any){
        try{
            const res = await this.prisma.infoSeries.update({
                where:{
                    SeriesName:seriesName.SeriesName
                },
                data:{
                    VideoSource:seriesName.VideoSource
                },
                select:{
                    VideoSource:true
                }
            })
            return res.VideoSource;
        }catch(err){
            console.log(err);
            
        }
    }
}
export class VideoFormatterService{
    async videoUpload(videoUrl:string,seriesName:string){
        try{
            const tempDir = path.join(__dirname, '..', '..', 'video',`${seriesName}`);
            const inputFile = videoUrl;
            console.log('VIDEOURL: ',videoUrl);
            console.log(seriesName);
            
            const outputFiles = [];
            
            await this.createDirectories(tempDir);        
            const file720p = await this.convertVideo(inputFile, '1280x720', '720p.mp4',seriesName);
            console.log('720p file converted: ', file720p);
            outputFiles.push(file720p);

            const file480p = await this.convertVideo(inputFile, '854x480', '480p.mp4',seriesName);
            console.log('480p file converted: ', file480p);
            outputFiles.push(file480p);

            console.log('Output Files: ', outputFiles);
            return outputFiles;

        }catch(err){
            console.error('VideoFormatterService Error: ',err);
            
        }
    }
    /* private getVideoFormat = async(videoPath: string): Promise<string>=> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoPath, (err, metadata) => {
                if (err) {
                    reject(err);
                } else {
                    const format = metadata.format.format_name; // Формат видео
                    resolve(format);
                }
            });
        });
    } */
    private convertVideo(inputPath:string,resolution:string,outputFileName:string,seriesName:string):Promise<string>{
        return new Promise(async(resolve,reject)=>{
            try{

                const height = resolution.split('x')[1];
                console.log('HIEGHT: ',height);
                console.log('SeriesName: ',seriesName);
                
                const outputDir = path.join(__dirname, '..', '..', 'video', seriesName, `${height}p`);

                console.log('OUTPUT DIR SERIES: ',outputDir);
                
                const outputPath = path.join(outputDir, outputFileName);
                await fs.mkdir(outputDir, { recursive: true }).catch((err) => {
                    console.error(`Error creating directory ${outputDir}:`, err);
                    return reject(err);
                });
                console.log('OUTPUT PATH: ',outputPath);
                
                const isExists = await fs.access(outputPath).then(() => true).catch(() => false);
                if(isExists){ 
                    console.log(`File already exists: ${outputPath}`);
                    return resolve(outputPath)
                };
                ffmpeg(inputPath)
                .outputOptions([
                    `-vf scale=${resolution}`, // Устанавливаем разрешение видео
                    '-codec:v libx264',       // Видео кодек H.264
                    '-codec:a aac',           // Аудио кодек AAC
                    '-start_number 0',
                ])
                .output(outputPath)
                .on('start', (commandLine) => {
                    console.log('Spawned Ffmpeg with command: ' + commandLine);
                })
                .on('progress', (progress) => {
                    console.log(`Processing: ${progress.percent}% done`);
                })
                .on('stderr', function(stderrLine) {
                    console.log('Stderr output: ' + stderrLine);
                })
                .on('end', () => {
                    console.log(`Conversion complete for ${outputFileName}`);
                    resolve(outputPath);
                })
                .on('error', (err) => {
                    console.error(`Error during conversion for ${outputFileName}: `, err);
                    reject(err);
                })
                .run();
            }catch(err){
                console.error(err);
                
            }
    
        })
    }
    private async createDirectories(temp:string){
        try{
            const dir720p = `${temp}/720p`;
            const dir480p = `${temp}/480p`;
            await fs.mkdir(dir720p, { recursive: true }).catch((err) => {
                console.error(`Error creating directory ${dir720p}:`, err);
              });
              console.log('Папка 720p создана');
          
              await fs.mkdir(dir480p, { recursive: true }).catch((err) => {
                console.error(`Error creating directory ${dir480p}:`, err);
              });
              console.log('Папка 480p создана');
        }catch (err) {
            console.error('Ошибка при создании директорий:', err);
          }
    }
    async getVideoInfo(videoPath:string,req:Request,res:Response){
        /* console.log('VIDEOPATH IN SERVICE: ',videoPath);
        const videoSize = (await fs.stat(videoPath)).size;
        const CHUNK_SIZE = 10 ** 6;
        const range = req.headers['range'] as string | undefined;
        if (!range) {
            return new ForbiddenException('Range не найденно');
        }
        const start = Number(range.replace(/\D/g,""));
        const end = Math.min(start + CHUNK_SIZE,videoSize - 1);

        const contentLength = end - start + 1;
        const headers = {
            'Content-Range':`bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges':'bytes',
            'Content-Length':contentLength,
            'Content-Type':'video/mp4'
        }

        res.writeHead(206,headers);
        
        const videoStream = fsSync.createReadStream(videoPath, { start, end });

        // Передаем поток в ответ
        videoStream.pipe(res)

        // Если возникнет ошибка при стриминге, логируем ошибку
        videoStream.on('error', (error) => {
            console.error('Ошибка при чтении видео:', error);
            res.status(500).send('Ошибка при чтении видео');
        }); */
    }
    async getRoute(seriesName:string,quality:string){
        const dirSeriesName = `C:/Users/arMori/Desktop/RedditClone/reddit_back/src/video/${seriesName}`;
        const isExists = await fs.stat(dirSeriesName).then(() => true).catch(() => false);
        console.log('EXISTS FILE!',dirSeriesName);
        try{
            if(isExists){
                const check = path.join(`${__dirname},'..','..',video/${seriesName}/${quality}/${quality}.mp4`)
                
                const checked = await fs.stat(check).then(() => true).catch(() => false);;
                if(checked){
                    console.log('Return FILE: ',check);
                    return check;
                }
            }

        }catch(err){
            console.log(err);
            
        }
    }
}