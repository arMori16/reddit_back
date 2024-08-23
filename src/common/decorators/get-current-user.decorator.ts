import { createParamDecorator,ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "src/auth/types/jwtPayload.type";

export const GetCurrentUser = createParamDecorator(
    (_:undefined,context:ExecutionContext):string=>{
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayload;
        return user.email;

    }
)