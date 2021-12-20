// Nest dependencies
import {
    Injectable,
    HttpStatus,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

// Other dependencies
import { validate } from "class-validator"

// Local files
import { AwsService } from "src/shared/services/aws.service"
import { MediaRepository } from "src/shared/repositories/media.repository"
import { LikeRepository } from "src/shared/repositories/like.repository"
import { CommentRepository } from "src/shared/repositories/comment.repository"
import { CreateCommentDto } from "../dto"
import { RedisService } from "src/shared/services/redis.service"
import { MediaEntity } from "src/shared/entities/media.entity"
import { LikeEntity } from "src/shared/entities/like.entity"
import { UserRepository } from "src/shared/repositories/user.repository"
import { UserEntity } from "src/shared/entities/user.entity"
import { StatusOk } from "src/shared/types"

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(MediaRepository)
        private readonly mediaRepository: MediaRepository,
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        @InjectRepository(CommentRepository)
        private readonly commentRepository: CommentRepository,
    ) {}

    async getCommentByMediaId(mediaId: string) {
        return await this.commentRepository.getCommentByMediaId(mediaId)
    }

    async deleteComment(commentId: string, userId: string): Promise<StatusOk> {
        return await this.commentRepository.deleteComment(commentId, userId)
    }

    async createComment(args: CreateCommentDto, userId: string) {
        let user: UserEntity
        if (!(args.color === "#ffffff" || args.color === "#000000")) {
            user = await this.userRepository.getUserById(userId)
            if (user.point >= 100) {
                user.point -= 100
            } else {
                throw new UnauthorizedException("포인트가 부족합니다")
            }
            await this.userRepository.updateUser(user)
        }
        try {
            return await this.commentRepository.createComment({
                ...args,
                userId,
            })
        } catch {
            if (user) {
                user.point += 100
                await this.userRepository.updateUser(user)
            }
            throw new BadRequestException("댓글 작성에 실패했습니다")
        }
    }
}
