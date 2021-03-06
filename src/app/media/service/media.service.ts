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
import { UploadMediaDto, UpdateMediaDto } from "../dto"
import { AwsService } from "src/shared/services/aws.service"
import { MediaRepository } from "src/shared/repositories/media.repository"
import { LikeRepository } from "src/shared/repositories/like.repository"
import { File } from "src/shared/types"
import { RedisService } from "src/shared/services/redis.service"
import { MediaEntity } from "src/shared/entities/media.entity"
import { LikeEntity } from "src/shared/entities/like.entity"

@Injectable()
export class MediaService {
    constructor(
        private readonly awsService: AwsService,
        private readonly redisService: RedisService,
        @InjectRepository(MediaRepository)
        private readonly mediaRepository: MediaRepository,
        @InjectRepository(LikeRepository)
        private readonly likeRepository: LikeRepository,
    ) {}

    async getLikeByMedia(userId: string, page = 1) {
        return await this.likeRepository.getLikeByMedia(userId, page)
    }

    async likeMedia(userId: string, mediaId: string) {
        const [media, likeStatus] = await Promise.all([
            this.mediaRepository.getMediaByMediaId(mediaId),
            this.likeRepository.getLikeStatus(userId, mediaId),
        ])

        if (likeStatus) {
            media.likes--
            await Promise.all([
                this.mediaRepository.updateMedia(media),
                this.likeRepository.unlike(likeStatus),
            ])
        } else {
            media.likes++
            await Promise.all([
                this.mediaRepository.updateMedia(media),
                this.likeRepository.like(userId, mediaId),
            ])
        }

        return media
    }

    async uploadMedia(userId: string, file: File, payload: UploadMediaDto) {
        payload.title = payload.title.replace(/^\s+|\s+$/g, "")
        if (payload.title.length === 0) {
            throw new BadRequestException("Title name can not be whitespace")
        }
        const dto = new UploadMediaDto()
        dto.title = payload.title
        dto.description = payload.description
        dto.file = file
        return await validate(dto, { validationError: { target: false } }).then(
            async (errors) => {
                if (errors.length > 0) {
                    throw new BadRequestException(errors)
                }
                try {
                    const url = await this.awsService.uploadFile(
                        `${Date.now()}-${file.originalname}`,
                        "media",
                        file.buffer,
                    )
                    const newMedia: MediaEntity =
                        await this.mediaRepository.uploadMedia(
                            userId,
                            payload,
                            url,
                        )
                    return newMedia
                } catch (e) {
                    throw new BadRequestException("Error uploading file")
                }
            },
        )
    }

    async getMedia(mediaId: string, ip: string, userId?: string) {
        const [media, view] = await Promise.all([
            this.mediaRepository.getMediaWithUser(mediaId),
            this.redisService.getData(`views:${mediaId}:${ip}`),
        ])
        if (view === null) {
            media.views++
            await Promise.all([
                this.redisService.setOnlyKey(`views:${mediaId}:${ip}`, 3600),
                this.mediaRepository.updateMedia(media),
            ])
        }
        return media
    }

    async searchMedia(page: number, keyword?: string, author?: string) {
        if (author) {
            return await this.mediaRepository.searchMediaByAuthor(page, author)
        }
        return await this.mediaRepository.searchMediaByKeyword(page, keyword)
    }

    async deleteMedia(userId: string, mediaId: string) {
        await this.likeRepository.deleteLikeByMediaId(mediaId)
        await this.mediaRepository.deleteMedia(userId, mediaId)
    }

    async updateMedia(
        userId: string,
        mediaId: string,
        payload: UpdateMediaDto,
    ) {
        return await this.mediaRepository.patchMedia(userId, mediaId, payload)
    }
}
