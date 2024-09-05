import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";



@Injectable()
export class  AtGuard extends AuthGuard('jwt'){
    constructor(private reflector:Reflector){
        super();
    }

    async canActivate(context: ExecutionContext):Promise<boolean> { 
        const isPublic = this.reflector.getAllAndOverride('isPublic',[
            context.getHandler(),
            context.getClass()
        ]);

        if(isPublic) return true;

        const request = context.switchToHttp().getRequest();
        console.log('Authorization req: ',request.headers.authorization);
        
        try {
            const canActivateResult = await super.canActivate(context) as boolean;
            console.log('Can activate result:', canActivateResult);
            return canActivateResult;
          } catch (error) {
            console.error('Error in canActivate:', error);
            throw error; // Повторно выбрасываем ошибку, чтобы она была обработана выше
          }
        /* return super.canActivate(context); */
    }
}