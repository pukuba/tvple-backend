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
    async updateMedia(media: MediaEntity) {
        await this.save(media)
        return media
    }

    async uploadMedia(userId: string, dto: UploadMediaDto, url: string) {
        const media = new MediaEntity({
            userId: userId,
            ...dto,
            url,
        })

        try {
            return await this.save(media)
        } catch (err) {
            console.log(err)
            throw new UnprocessableEntityException(err.errmsg)
        }
    }

    async getMediaWithUser(mediaId: string) {
        const media: MediaEntity = await this.createQueryBuilder("media")
            .where("media.mediaId = :mediaId", { mediaId })
            .leftJoinAndSelect("media.user", "user")
            .leftJoinAndSelect("media.comment", "comment")
            .select(["media", "user.username", "comment"])
            .orderBy("comment.timeStamp", "ASC")
            .getOne()
        if (media === undefined) {
            throw new NotFoundException("해당 영상이 존재하지 않습니다")
        }
        return media
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

    async searchMediaByKeyword(page: number = 1, keyword: string = "") {
        const skip = Math.max(page - 1, 0) * 20
        const take = 20

        const [result, total] = await Promise.all([
            this.query(`
                select * from media where match(title)
                against('${keyword}' IN BOOLEAN MODE)
                order by views desc
                limit ${skip}, ${take}
            `),
            this.query(`
                select count(DISTINCT mediaId) as total from media where match(title)
                against('${keyword}' IN BOOLEAN MODE)
            `),
        ])
        return {
            data: result,
            count: ~~total[0].total,
        }
    }

    async searchMediaByAuthor(page: number = 1, author: string) {
        const skip = Math.max(page - 1, 0) * 20
        const take = 20

        const [result, total] = await this.createQueryBuilder("media")
            .select()
            .where("media.userId = :author", { author })
            .skip(skip)
            .take(take)
            .getManyAndCount()
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
