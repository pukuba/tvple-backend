// Nest dependencies
import {
    Injectable,
    HttpStatus,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

// Other dependencies
import { JwtPayload } from "jsonwebtoken"
import { validate } from "class-validator"
import { getRepository, Repository } from "typeorm"

// Local files
import { StatusOk } from "src/shared/types"
import { UploadMediaDto } from "./dto/upload-media.dto"
import { AwsService } from "src/shared/services/aws.service"
import { MediaRepository } from "src/shared/repositories/media.repository"
import { File } from "src/shared/services/type"
import { RedisService } from "src/shared/Services/redis.service"
import { MediaEntity } from "src/shared/entities/media.entity"

@Injectable()
export class MediaService {
    constructor(
        private readonly awsService: AwsService,
        private readonly redisService: RedisService,
        @InjectRepository(MediaRepository)
        private readonly mediaRepository: MediaRepository,
    ) {}

    async uploadMedia(userId: string, file: File, payload: UploadMediaDto) {
        payload.title = payload.title.replace(/^\s+|\s+$/g, "")
        if (payload.title.length === 0) {
            throw new BadRequestException("Title name can not be whitespace")
        }
        const dto = new UploadMediaDto()
        dto.title = payload.title
        dto.description = payload.description
        return await validate(dto, { validationError: { target: false } }).then(
            async (errors) => {
                if (errors.length > 0) {
                    throw new BadRequestException(errors)
                }
                try {
                    const url = this.awsService.uploadFile(
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
                } catch {
                    throw new BadRequestException("Error uploading file")
                }
            },
        )
    }

    async getMedia(mediaId: string, ip: string) {
        const view = await this.redisService.getData(`${mediaId}${ip}`)
        if (view === null) {
            await Promise.all([
                this.redisService.setOnlyKey(`${mediaId}${ip}`, 3600),
                this.mediaRepository.updateMediaViewCount(mediaId, 1),
            ])
        }
        return await this.mediaRepository.getMediaByMediaId(mediaId)
    }

    async searchMedia(page: number, keyword: string) {
        return await this.mediaRepository.searchMedia(page, keyword)
    }
}
