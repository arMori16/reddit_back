import { BadRequestException, Body, Controller, Post, Req, Res,Get, UseGuards, Session } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { Public } from "src/common/decorators/public.decorator";
import { GetCurrentUserId } from "src/common/decorators/get-current-userId.decorator";
import { GetCurrentUser } from "src/common/decorators/get-current-user.decorator";
import { JwtPayload } from "./types/jwtPayload.type";
import { Tokens } from "./types";
import { AuthGuard } from "@nestjs/passport";
import { AtGuard } from "src/common/guards/at.guard";
import { RtGuard } from "src/common/guards";
import session from "express-session";


@Controller('/')
export class AuthController{
    constructor(private service:AuthService){}
    @Public()
    @Post('')
    async handleAuth(@Body() dto:AuthDto){
        try {
            if (dto.action === 'signup') {
                return await this.service.signup(dto);
            }
            if (dto.action === 'login') {
                console.log('xui2');
                return await this.service.signin(dto);
            }
            throw new BadRequestException('Invalid action');
        } catch (error) {
            console.error('Error in AuthController:', error);  // Логируем ошибку
            throw new BadRequestException('Something went wrong');
        }
    }
    @UseGuards(AtGuard)
    @Post('logout')
    async logout(@GetCurrentUserId() userId:number):Promise<boolean>{
        if (!userId) {
            throw new BadRequestException('User ID not found');
        }
        return this.service.logout(userId);
    }
    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    async refreshTokens(@GetCurrentUserId() userId:number,
                        @GetCurrentUser('refreshToken') refreshToken:string):Promise<Tokens>{
                            if(!userId){throw new BadRequestException('User ID not found');}
                            return this.service.refreshTokens(userId,refreshToken);

    } 
    @UseGuards(AtGuard)
    @Get('getUserId')
    async getUserId(@GetCurrentUserId() userId:number):Promise<number>{
        if (!userId) {
            throw new BadRequestException('User ID not found');
        }
        return this.service.getUserId(userId);
    }

    /* @UseGuards(AtGuard)
    @Get('test')
    async getTokens(@Body() req:Request){
        return this.service.
    } */
}