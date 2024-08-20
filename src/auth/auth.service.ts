import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { AuthDto } from "./dto/auth.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config"


@Injectable()
export class AuthService{
    constructor(private prisma:PrismaService,private jwt:JwtService,private config:ConfigService){}
    async signup(dto:AuthDto){
        //hash the password
        const hash = await argon.hash(dto.password)
        try{
            const user = await this.prisma.user.create({
                data:{
                    email:dto.email,
                    hash,
                    firstName:dto.firstName
                },
                select:{
                    id:true,
                    email:true,
                    createdAt:true
                }
            })
            const token = await this.signToken(user.id,user.email)
            return {user,token};
        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException('Credentials taken!')
                }
            }
            throw error;

        }
        //if it incorrect we decline it 
    }
    async signin(dto:AuthDto){
        //Check users data
        const user = await this.prisma.user.findUnique({
            where: {
                email:dto.email
            }
        })
        if(!user){
            throw new ForbiddenException('Credential incorrect')
        }
        const pwMatches = await argon.verify(user.hash,dto.password);
        if(!pwMatches){
            throw new ForbiddenException('Credentials incorrect')
        }
        const token = await this.signToken(user.id,user.email);
        return {user,token};
    }
    async signToken(userId:number,email:string):Promise<string>{

        const payload = {
            sub:userId,
            email
        }
        const secret = process.env.JWT_SECRET
        return await this.jwt.signAsync(payload,{
            expiresIn:'1h',
            secret:secret
        })
    }
}