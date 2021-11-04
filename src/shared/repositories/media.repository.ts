// Nest dependencies
import {
    BadRequestException,
    UnprocessableEntityException,
    NotFoundException,
    ForbiddenException,
} from "@nestjs/common"

// Other dependencies
import { Repository, EntityRepository, Like } from "typeorm"

// Local files
import { UploadMediaDto, UpdateMediaDto } from "src/app/media/dto"
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

    async getMediaByMediaId(mediaId: string) {
        let media: MediaEntity
        try {
            media = await this.findOneOrFail({ mediaId: mediaId })
        } catch {
            throw new BadRequestException("해당 영상이 존재하지가 않습니다")
        }
        return media
    }

    async updateMediaViewCount(mediaId: string, count: number) {
        let media: MediaEntity
        try {
            media = await this.findOneOrFail({ mediaId: mediaId })
            media.views += count
            await this.save(media)
        } catch {
            throw new NotFoundException("해당 게시글이 존재하지가 않습니다")
        }
    }

    async searchMedia(page: number, keyword: string = "") {
        const skip = Math.max(page - 1, 0) * 20
        const take = 20
        const [result, total] = await this.findAndCount({
            where: {
                title: Like(`%${keyword}%`),
            },
            order: { date: "DESC" },
            take: take,
            skip: skip,
        })
        return {
            data: result,
            count: total,
        }
    }

    async deleteMedia(userId: string, mediaId: string) {
        try {
            const media: MediaEntity = await this.findOneOrFail({
                mediaId,
                userId,
            })
            await this.delete(media)
        } catch {
            throw new NotFoundException("해당 영상이 존재하지 않습니다")
        }
    }

    async patchMedia(userId: string, mediaId: string, dto: UpdateMediaDto) {
        try {
            const media: MediaEntity = await this.findOneOrFail({
                mediaId,
                userId,
            })
            media.title = dto.title || media.title
            media.description = dto.description || media.description
            return await this.save(media)
        } catch {
            throw new NotFoundException("해당 영상이 존재하지 않습니다")
        }
    }
}
