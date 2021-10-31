import {
    BadRequestException,
    UnprocessableEntityException,
    NotFoundException,
    ForbiddenException,
} from "@nestjs/common"

import { Repository, EntityRepository } from "typeorm"
import * as crypto from "bcryptjs"

import {
    CreateUserDto,
    CreateAuthCodeDto,
    CheckAuthCodeDto,
    DeleteUserDto,
    LoginDto,
} from "src/app/auth/dto"
import { configService } from "../services/config.service"
import { UserEntity } from "../entities/user.entity"

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    constructor() {
        super()
    }

    async validateUser(dto: LoginDto) {
        let user: UserEntity
        try {
            user = await this.findOneOrFail({
                id: dto.id,
            })
        } catch {
            throw new BadRequestException("계정이 존재하지 않습니다.")
        }
        const isValidPassword = crypto.compareSync(dto.password, user.password)
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

    async getUserByPhoneNumber(phoneNumber: string): Promise<UserEntity> {
        try {
            return await this.findOneOrFail({
                phoneNumber,
            })
        } catch (err) {
            throw new NotFoundException("계정이 존재하지 않습니다.")
        }
    }

    async getUserById(id: string): Promise<UserEntity> {
        try {
            return await this.findOneOrFail({
                id,
            })
        } catch (err) {
            throw new NotFoundException("계정이 존재하지 않습니다")
        }
    }

    async updateUserPassword(
        phoneNumber: string,
        password: string,
    ): Promise<UserEntity> {
        let user: UserEntity
        try {
            user = await this.findOneOrFail({
                phoneNumber: phoneNumber,
            })
        } catch (error) {
            throw new NotFoundException("계정이 존재하지 않습니다")
        }
        const hashedPassword = crypto.hashSync(password, crypto.genSaltSync(10))
        user.password = hashedPassword
        return await this.save(user)
    }

    async deleteUser(dto: DeleteUserDto) {
        try {
            const user = await this.validateUser(dto)
            const { affected } = await this.delete({
                id: user.id,
                password: user.password,
            })
            if (affected === 0) throw new Error()
        } catch (e) {
            throw new NotFoundException("계정이 존재하지 않습니다")
        }
    }
}
