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
import { LikeEntity } from "../entities/like.entity"
import { MediaEntity } from "../entities/media.entity"

@EntityRepository(LikeEntity)
export class LikeRepository extends Repository<LikeEntity> {
    async getLikeByMedia(userId: string, page = 1) {
        const skip = Math.max(page - 1, 0) * 20
        const take = 20

        const [data, count] = await this.createQueryBuilder("like")
            .where("like.userId = :userId", { userId })
            .leftJoinAndSelect("like.media", "media")
            .skip(skip)
            .take(take)
            .getManyAndCount()

        return {
            data: data.map((x) => {
                return { ...x.media }
            }),
            count,
        }
    }

    async getLikeStatus(userId: string, mediaId: string) {
        return await this.findOne({
            where: {
                userId: userId,
                mediaId: mediaId,
            },
        })
    }

    async like(userId: string, mediaId: string) {
        const like = new LikeEntity({
            userId: userId,
            mediaId: mediaId,
        })
        try {
            return await this.save(like)
        } catch {
            throw new UnprocessableEntityException("이미 존재합니다")
        }
    }

    async unlike(likeStatus: LikeEntity) {
        try {
            return await this.remove(likeStatus)
        } catch {
            throw new UnprocessableEntityException("삭제 실패")
        }
    }

    async deleteLikeByMediaId(mediaId: string) {
        try {
            return await this.delete({ mediaId: mediaId })
        } catch {
            throw new UnprocessableEntityException("삭제 실패")
        }
    }
}
