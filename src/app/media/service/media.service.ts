import {
    Injectable,
    HttpStatus,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "src/shared/entities/user.entity"
import { getRepository, Repository } from "typeorm"

import { File } from "src/shared/services/type"
import { UploadMediaDto } from "./dto/upload-media.dto"
import { validate } from "class-validator"
import { randNumber } from "src/shared/lib"
import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { RedisService } from "src/shared/Services/redis.service"
import { MessageService } from "src/shared/services/message.service"
import { UserRepository } from "src/shared/repositories/user.repository"
import { StatusOk } from "src/shared/types"
import { JwtPayload } from "jsonwebtoken"
import { AwsService } from "src/shared/services/aws.service"
import { MediaEntity } from "src/shared/entities/media.entity"

@Injectable()
export class MediaService {
    constructor(private readonly awsService: AwsService) {}

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
                let media: MediaEntity
                try {
                    const url = this.awsService.uploadFile(
                        file.name,
                        "media",
                        file.buffer,
                    )
                    return url
                } catch {}
            },
        )
        const res = this.awsService.uploadFile(file.name, "media", file.buffer)
        return res
    }
}
