import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { AuthDto } from "./dto/auth.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import { JwtPayload } from "./types/jwtPayload.type";
import {Tokens} from './types';


@Injectable()
export class AuthService{
    constructor(private prisma:PrismaService,private jwt:JwtService,private config:ConfigService){}
    async signup(dto:AuthDto,session:any){
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
                    firstName:true,
                    createdAt:true
                }
            })
            const tokens:Tokens = await this.signToken(user.id,user.email,session);
            await this.updateRtHash(user.id,tokens.refresh_token);
            return {user,tokens};
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
    async signin(dto:AuthDto,session:any){
        //Check users data
        console.log('xui');
        
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
        const tokens:Tokens = await this.signToken(user.id,user.email,session);
        await this.updateRtHash(user.id,tokens.refresh_token);
        
        return {user,tokens};
    }
    async signToken(userId:number,email:string,session:any):Promise<Tokens>{

        const payload:JwtPayload = {
            sub:userId,
            email:email
        }
        const accessSecret = process.env.JWT_SECRET
        const refreshSecret = process.env.JWT_REFRESH_TOKEN
        const [accessToken,refreshToken] = await Promise.all([
            this.jwt.signAsync(payload,{
                expiresIn:'15m',
                secret:accessSecret
            }),
            this.jwt.signAsync(payload,{
                expiresIn: '28d',
                secret:refreshSecret
            })
            
        ]) 
        /* const oldRefreshToken = localStorage.getItem('refreshToken');
        if(oldRefreshToken !== null){
            return {access_token:accessToken,
                    refresh_token:oldRefreshToken}
        } */
        session.accessToken = accessToken;
        session.refreshToken = refreshToken;
        return {access_token:accessToken,
            refresh_token:refreshToken};
    }
    async logout(userId:number):Promise<boolean>{
        await this.prisma.user.updateMany({
            where:{
                id:userId,
                hashedRT:{
                    not:null,
                }
            },
            data:{
                hashedRT:null
            }
        })
        return true;
    }
    async refreshTokens(userId:number,refreshToken:string,session:any):Promise<Tokens>{
        const user = await this.prisma.user.findUnique({
            where:{
                id:userId,
            },
            select:{
                id:true,
                email:true,
                hashedRT:true
            }
        })
        if(!user || !refreshToken) throw new ForbiddenException('Access denied');
        console.log('getting RT');
        const test = await argon.hash(refreshToken)
        console.log(test);
        console.log(user.hashedRT);
        
        const rtMatches = await argon.verify(user.hashedRT,refreshToken);
        console.log('RT taken');
        if(!rtMatches) throw new ForbiddenException('Access Denied ++++');
        const tokens:Tokens = await this.signToken(user.id,user.email,session);
        await this.updateRtHash(userId,tokens.refresh_token);
        return tokens;
    }
    async updateRtHash(userId: number, rt: string): Promise<void> {
        const hash = await argon.hash(rt);
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data:{
           hashedRT:hash
          }
        });
      }
    async getUserId(userId:number):Promise<number>{
        const user = await this.prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                id:true
            }
        })
        console.log(user.id);
        return user.id;
        
    }
}