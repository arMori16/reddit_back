import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber } from "class-validator"

export class InfoDto{
    @IsNotEmpty()
    SeriesName:string 
    @IsNotEmpty()
    Description:string
    @IsNotEmpty()
    SeriesViewName:string
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    Rate:number
    @IsNotEmpty()
    Status:string
    @IsNotEmpty()
    Type:string
    @IsNotEmpty()
    ReleaseYear:string
    @IsNotEmpty()
    @Type(() => Array)
    Genre:string[]
    @IsNotEmpty()
    @Type(() => Array)
    Studio:string[]
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    AmountOfEpisode:number
    @IsNotEmpty()
    @Type(() => Array)
    VoiceActing:string[]
    @IsNotEmpty()
    VideoSource:string
}