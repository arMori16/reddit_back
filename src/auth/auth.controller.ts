import { BadRequestException, Body, Controller, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";


@Controller('/')
export class AuthController{
    constructor(private service:AuthService){}
    @Post()
    async handleAuth(@Body() dto:AuthDto){
        try {
            if (dto.action === 'signup') {
                return await this.service.signup(dto);
            }
            if (dto.action === 'login') {
                return await this.service.signin(dto);
            }
            throw new BadRequestException('Invalid action');
        } catch (error) {
            console.error('Error in AuthController:', error);  // Логируем ошибку
            throw new BadRequestException('Something went wrong');
        }
    }
}