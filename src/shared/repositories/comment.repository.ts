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
import { CreateCommentDto } from "src/app/comment/dto"
import { configService } from "../services/config.service"
import { CommentEntity } from "../entities/comment.entity"

@EntityRepository(CommentEntity)
export class CommentRepository extends Repository<CommentEntity> {
    async createComment(args: CreateCommentDto & { userId: string }) {
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
            .where("comment.commentId = :commentId", { commentId })
            .leftJoinAndSelect("comment.media", "media")
            .getOne()
        if (data?.userId === userId || data?.media?.userId === userId) {
            await this.delete({
                commentId: commentId,
            })
            return {
                status: "ok",
                message: "정상적으로 삭제되었습니다",
            }
        }
        throw new ForbiddenException("권한이 없습니다")
    }

    async getCommentByMediaId(mediaId: string) {
        return {
            data: await this.find({
                where: { mediaId },
                order: { timeStamp: "ASC" },
            }),
        }
    }
}
