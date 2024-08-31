import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";



@Injectable()
export class  AtGuard extends AuthGuard('jwt'){
    constructor(private reflector:Reflector){
        super();
    }

    canActivate(context: ExecutionContext) { 
        const isPublic = this.reflector.getAllAndOverride('isPublic',[
            context.getHandler(),
            context.getClass()
        ]);

        if(isPublic) return true;

        const request = context.switchToHttp().getRequest();
        console.log('Authorization req: ',request.headers.authorization);
        

        return super.canActivate(context);
    }
}