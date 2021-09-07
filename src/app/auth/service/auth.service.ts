import {
    Injectable,
    HttpStatus,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "src/shared/entities/users.entity"
import { getRepository, Repository } from "typeorm"
import { AuthCodeJwtResult } from "../auth.interface"

import { CreateUserDto, CreateAuthCodeDto, CheckAuthCodeDto } from "../dto"
import { validate } from "class-validator"
import { randNumber } from "src/shared/lib"
import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { RedisService } from "src/shared/Services/redis.service"
import { MessageService } from "src/shared/services/message.service"
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtManipulationService,
        private readonly redisService: RedisService,
        private readonly messageService: MessageService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async signUp(dto: CreateUserDto) {
        const { username, phoneNumber, password, id, authCodeToken } = dto
        const qb = getRepository(UserEntity)
            .createQueryBuilder("user")
            .where("user.username = :username", { username })
            .orWhere("user.phoneNumber = :phoneNumber", { phoneNumber })
            .orWhere("user.id = :id", { id })

        const user = await qb.getOne()

        if (user)
            throw new BadRequestException(
                "이미 중복된 아이디, 혹은 닉네임, 휴대번호가 있습니다.",
            )
        const jwtResult = this.jwtService.decodeJwtToken(
            authCodeToken,
        ) as AuthCodeJwtResult
        if (jwtResult.phoneNumber !== phoneNumber)
            throw new UnauthorizedException(
                "휴대번호 인증이 만료되었거나 휴대번호 인증절차가 이루어지지 않았습니다.",
            )
        const newUser = new UserEntity()
        newUser.username = username
        newUser.phoneNumber = phoneNumber
        newUser.password = password
        newUser.id = id
        const error = await validate(newUser)
        if (error.length > 0) {
            throw new BadRequestException("회원가입에 실패하였습니다.")
        } else {
            await Promise.all([
                this.userRepository.save(newUser),
                this.redisService.deleteData(phoneNumber),
            ])
            return this.jwtService.generateJwtToken({
                id,
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
            })
        }
    }

    async createAuthCode(dto: CreateAuthCodeDto) {
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
        }
    }

    async checkAuthCode(dto: CheckAuthCodeDto) {
        const { phoneNumber, authCode } = dto
        const authorizationCode = await this.redisService.getData(phoneNumber)
        if (authorizationCode !== authCode) {
            throw new BadRequestException("전화번호 인증에 실패하였습니다")
        }
        return ` ${this.jwtService.generateJwtToken({
            phoneNumber,
            exp: Math.floor(Date.now() / 1000) + 60 * 15,
        })}`
    }
}
