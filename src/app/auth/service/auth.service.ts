import {
    Injectable,
    HttpStatus,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "src/shared/entities/user.entity"
import { getRepository, Repository } from "typeorm"
import { AuthCodeJwtResult } from "../auth.interface"

import {
    CreateUserDto,
    CreateAuthCodeDto,
    CheckAuthCodeDto,
    LoginDto,
    FindIdDto
} from "../dto"
import { validate } from "class-validator"
import { randNumber } from "src/shared/lib"
import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { RedisService } from "src/shared/Services/redis.service"
import { MessageService } from "src/shared/services/message.service"
import { UserRepository } from "src/shared/repositories/user.repository"
import { StatusOk } from "src/shared/types"
import { JwtPayload } from "jsonwebtoken"

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtManipulationService,
        private readonly redisService: RedisService,
        private readonly messageService: MessageService,
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) { }

    async signUp(dto: CreateUserDto) {
        const { username, phoneNumber, id, verificationToken } = dto

        const user = await this.userRepository.find({
            where: [{ username }, { phoneNumber }, { id }],
        })
        if (user.length > 0)
            throw new BadRequestException(
                "이미 중복된 아이디, 혹은 닉네임, 휴대번호가 있습니다.",
            )

        const jwtResult = this.jwtService.decodeJwtToken(
            verificationToken,
        )
        if (jwtResult.phoneNumber !== phoneNumber)
            throw new UnauthorizedException(
                "휴대번호 인증이 만료되었거나 휴대번호 인증절차가 이루어지지 않았습니다.",
            )

        await this.userRepository.createUser(dto)
        const token = this.jwtService.generateJwtToken({
            id: dto.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        })
        const responseData = {
            accessToken: token,
            user: {
                id,
                username,
            },
        }
        return responseData
    }

    async signOut(bearer: string) {
        const decodedToken = this.jwtService.decodeJwtToken(
            bearer,
        ) as JwtPayload
        const expireDate: number = decodedToken.exp
        const remainingSeconds = Math.round(expireDate - Date.now() / 1000)
        await this.redisService.setOnlyKey(
            `blacklist-${bearer.split(" ")[1]}`,
            remainingSeconds,
        )
        return { status: "ok", message: "토큰을 블랙리스트에 추가하였습니다" }
    }

    async createAuthCode(dto: CreateAuthCodeDto): Promise<StatusOk> {
        const { phoneNumber } = dto
        const verificationCode = randNumber(100000, 999999).toString()
        const requestResult = await this.messageService.sendVerificationMessage(
            {
                phoneNumber,
                verificationCode,
            },
        )
        if (requestResult.statusCode === "202") {
            this.redisService.setData(phoneNumber, verificationCode, 180)
            return {
                status: "ok",
                message: "본인확인 인증번호를 발송하였습니다",
            }
        } else {
            throw new BadRequestException("NCP SENS transport failed")
        }
    }

    async checkAuthCode(dto: CheckAuthCodeDto) {
        const { phoneNumber, verificationCode } = dto
        const authorizationCode = await this.redisService.getData(phoneNumber)
        if (authorizationCode !== verificationCode) {
            throw new BadRequestException("전화번호 인증에 실패하였습니다")
        }
        const responseData = {
            verificationToken: ` ${this.jwtService.generateJwtToken({
                phoneNumber,
                exp: Math.floor(Date.now() / 1000) + 60 * 15,
            })}`,
        }
        return responseData
    }

    async findId(dto: FindIdDto): Promise<StatusOk> {
        const { verificationToken } = dto
        const phoneNumber = this.jwtService.decodeJwtToken(verificationToken).phoneNumber
        const responseData = await this.userRepository.getUserByPhoneNumber(phoneNumber)
        return { status: "ok", message: `id는 ${responseData.id} 입니다` }
    }

    async signIn(userEntity: UserEntity) {
        const token: string = this.jwtService.generateJwtToken({
            id: userEntity.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 15,
        })
        const responseData = {
            accessToken: token,
            user: {
                id: userEntity.id,
                username: userEntity.username,
            },
        }
        return responseData
    }

    async validateUser(dto: LoginDto): Promise<UserEntity> {
        return await this.userRepository.validateUser(dto)
    }
}
