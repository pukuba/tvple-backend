import {
    BadRequestException,
    UnprocessableEntityException,
    NotFoundException,
    ForbiddenException,
} from "@nestjs/common"

import { Repository, EntityRepository } from "typeorm"
import * as argon2 from "argon2"

import { UploadMediaDto } from "src/app/media/service/dto"
import { configService } from "../services/config.service"
import { MediaEntity } from "../entities/media.entity"

@EntityRepository(MediaEntity)
export class MediaRepository extends Repository<MediaEntity> {
    async uploadMedia(userId: string, dto: UploadMediaDto, url: string) {
        const media = new MediaEntity({
            userId: userId,
            ...dto,
            url,
        })

        try {
            return await this.save(media)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }
    }
}
