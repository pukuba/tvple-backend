import {
    BadRequestException,
    UnprocessableEntityException,
    NotFoundException,
    ForbiddenException,
} from "@nestjs/common"

import { Repository, EntityRepository } from "typeorm"
import * as jwt from "jsonwebtoken"
import * as argon2 from "argon2"

import {
    CreateUserDto,
    CreateAuthCodeDto,
    CheckAuthCodeDto,
    LoginDto,
} from "src/app/auth/dto"
import { configService } from "../services/config.service"
import { UserEntity } from "../entities/users.entity"

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    constructor() {
        super()
    }

    async validateUser(dto: LoginDto) {
        let user: UserEntity
        try {
            user = await this.findOneOrFail({
                where: {
                    id: dto.id,
                },
            })
        } catch {
            throw new BadRequestException("계정이 존재하지 않습니다.")
        }
        const isValidPassword = argon2.verify(user.password, dto.password)
        if (!isValidPassword)
            throw new BadRequestException("비밀번호가 올바르지 않습니다.")
        return user
    }

    async createUser(dto: CreateUserDto): Promise<void> {
        const newUser: UserEntity = new UserEntity({
            username: dto.username,
            password: dto.password,
            phoneNumber: dto.phoneNumber,
            id: dto.id,
        })

        try {
            await this.save(newUser)
        } catch (error) {
            throw new UnprocessableEntityException(error.errmsg)
        }
    }
}
