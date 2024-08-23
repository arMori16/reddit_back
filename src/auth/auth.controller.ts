import { BadRequestException, Body, Controller, Post, Req, Res,Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { Public } from "@prisma/client/runtime/library";
import { GetCurrentUserId } from "src/common/decorators/get-current-userId.decorator";
import { GetCurrentUser } from "src/common/decorators/get-current-user.decorator";
import { JwtPayload } from "./types/jwtPayload.type";
import { Tokens } from "./types";


@Controller('/')
export class AuthController{
    constructor(private service:AuthService){}
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
            if(dto.action === 'logout'){
                return await this.service.logout(dto)
            }
            throw new BadRequestException('Invalid action');
        } catch (error) {
            console.error('Error in AuthController:', error);  // Логируем ошибку
            throw new BadRequestException('Something went wrong');
        }
    }
    @Post('refresh')
    async refreshTokens(@GetCurrentUserId() userId:number,
                        @GetCurrentUser() email:string):Promise<Tokens>{
                            return this.service.refreshTokens(userId,email);

    } 
    
}