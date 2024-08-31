import { createParamDecorator,ExecutionContext } from "@nestjs/common";
import {JwtPayload} from '../../auth/types/jwtPayload.type';

export const GetCurrentUserId = createParamDecorator(
    (_: undefined,context:ExecutionContext)=>{
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayload;
        console.log('Request user:', request.user);
        console.log('User payload:', user.sub);
        if (user && typeof user.sub === 'number') {
            return user.sub;
        }
        return null;
    },
);