import { Controller, Get, Query } from "@nestjs/common";
import { MailService } from "./mail.service";




@Controller('mail')
export class MailController{
    constructor(private readonly service:MailService){}
    @Get('getMailReq')
    async getMailReq(@Query('mail') mail:string){
        const code = String(Math.floor(100000 + Math.random()*900000));
        return await this.service.sendVerificationCode(mail,code)
    }

}