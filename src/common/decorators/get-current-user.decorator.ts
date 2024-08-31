import { createParamDecorator,ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "src/auth/types/jwtPayload.type";
import { JwtPayloadWithRt } from "src/auth/types/jwtPayloadWithRt.type";

export const GetCurrentUser = createParamDecorator(
    (data:keyof JwtPayloadWithRt | undefined,context:ExecutionContext)=>{
        const request = context.switchToHttp().getRequest();
        
        if(!data) return request.user;
        console.log('User Email: ');
        return request.user[data];

    }
)