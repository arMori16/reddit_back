import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CommentsDto } from "websockets/comment.dto";



@Injectable()
export class CommentsService{
    constructor(private readonly prisma:PrismaService){}
    async createComment(commentDto:CommentsDto){
        try{
            const req = await this.prisma.comments.create({
                data:{
                    SeriesName:commentDto.seriesName,
                    ParentId:commentDto.parentId,
                    UserId:commentDto.userId,
                    CommentText:commentDto.commentText
                },
                include:{
                    user:true,
                    parent:true,
                    replies:true
                }
            })
        }catch(err){
            console.error('Error when trying to createComment!');
        }
    }
}