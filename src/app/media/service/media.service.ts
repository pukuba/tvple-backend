import {
    Injectable,
    HttpStatus,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "src/shared/entities/user.entity"
import { getRepository, Repository } from "typeorm"

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

@Injectable()
export class MediaService {
    constructor(private readonly awsService: AwsService) {}

    async uploadMedia(userId: string, payload: UploadMediaDto, buffer: Buffer) {
        payload.title = payload.title.replace(/^\s+|\s+$/g, "")
        if (payload.title.length < 1) {
            throw new BadRequestException("Title is empty")
        }
        const dto = new UploadMediaDto()
        dto.title = payload.title
        dto.description = payload.description

        return await validate(dto, { validationError: { target: false } }).then(
            async (errors) => {
                if (errors.length > 0) {
                    throw new BadRequestException(
                        errors[0].constraints[
                            Object.keys(errors[0].constraints)[0]
                        ],
                    )
                }
                if (buffer) {
                    const url = this.awsService.uploadFile(
                        `${Date.now()}-${payload.title}.mp4`,
                        "media",
                        buffer,
                    )
                } else {
                    throw new BadRequestException("No file")
                }
            },
        )
    }
}
