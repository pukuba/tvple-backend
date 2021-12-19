// Nest dependencies
import {
    BadRequestException,
    UnprocessableEntityException,
    NotFoundException,
    ForbiddenException,
} from "@nestjs/common"

// Other dependencies
import { Repository, EntityRepository } from "typeorm"

// Local files
import { UploadMediaDto, UpdateMediaDto } from "src/app/media/dto"
import { configService } from "../services/config.service"
import { CommentEntity } from "../entities/comment.entity"

interface CreateCommentInput {
    mediaId: string
    userId: string
    content: string
    timeStamp: number
    posX: number
    posY: number
    color: string
}

@EntityRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {
    async createComment(args: CreateCommentInput) {
        const comment = new CommentEntity({
            mediaId: args.mediaId,
            userId: args.userId,
            content: args.content,
            timeStamp: args.timeStamp,
            posX: args.posX,
            posY: args.posY,
            color: args.color,
        })
        try {
            return await this.save(comment)
        } catch {
            throw new UnprocessableEntityException(
                "코멘트를 작성하는데 에러가 발생했습니다",
            )
        }
    }

    async deleteComment(commentId: string, userId: string) {
        const data = await this.createQueryBuilder("comment")
            .where("like.commentId = :commentId", { commentId })
            .leftJoinAndSelect("like.media", "media")
            .getOne()
        if (data.userId === userId || data.media.userId === userId) {
            await this.delete({
                commentId: commentId,
            })
            return true
        }
        throw new ForbiddenException("권한이 없습니다")
    }

    async getCommentByMediaId(mediaId: string) {
        const data = await this.find({ where: { mediaId } })
        return data
    }
}
