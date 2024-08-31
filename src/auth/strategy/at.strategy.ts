import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy,ExtractJwt} from 'passport-jwt';
import { JwtPayload } from '../types/jwtPayload.type';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(config:ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }
    validate(payload:JwtPayload){
        return payload;
    }
}