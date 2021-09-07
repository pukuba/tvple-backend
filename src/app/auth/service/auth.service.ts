import { Injectable, HttpStatus, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "src/shared/entities/users.entity"
import { getRepository, Repository } from "typeorm"
import { AuthCodeJwtResult } from "../auth.interface"
import * as crypto from "crypto-js"
import fetch from "node-fetch"
import * as jwt from "jsonwebtoken"
import { CreateUserDto, CreateAuthCodeDto, CheckAuthCodeDto } from "../dto"
import { HttpException } from "@nestjs/common/exceptions/http.exception"
import { validate } from "class-validator"
import { randNumber } from "src/shared/lib"
import { RedisService } from "src/shared/Services/redis.service"
import { configService } from "src/shared/services/config.service"

@Injectable()
export class AuthService {
    constructor(
        private readonly redisService: RedisService,
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
                "이미 중복된 아이디, 닉네임, 휴대전화가 있습니다.",
            )
        try {
            const jwtResult = jwt.verify(
                authCodeToken,
                configService.getEnv("JWT_TOKEN"),
            ) as AuthCodeJwtResult
            if (jwtResult.phoneNumber !== phoneNumber) throw ""
        } catch {
            throw new BadRequestException(
                "전화번호 인증이 만료되었거나 전화번호가 인증되지 않았습니다.",
            )
        }

        const newUser = new UserEntity()
        newUser.username = username
        newUser.phoneNumber = phoneNumber
        newUser.password = password
        newUser.id = id
        const error = await validate(newUser)
        if (error.length > 0) {
            throw new BadRequestException("회원가입에 실패하였습니다.")
        } else {
            const [savedUser] = await Promise.all([
                this.userRepository.save(newUser),
                this.redisService.deleteData(phoneNumber),
            ])
            return this.buildUserRO(savedUser)
        }
    }

    async createAuthCode(dto: CreateAuthCodeDto) {
        const { phoneNumber } = dto
        await this.authCodePost(phoneNumber)
    }

    async checkAuthCode(dto: CheckAuthCodeDto) {
        const { phoneNumber, authCode } = dto
        const authorizationCode = await this.redisService.getData(phoneNumber)
        if (authorizationCode === null) {
            const _errors = { message: "인증번호를 다시 요청해주세요" }
            throw new HttpException(
                { message: "인증시간 만료", _errors },
                HttpStatus.BAD_REQUEST,
            )
        }
        if (authCode !== parseInt(authorizationCode, 10)) {
            const _errors = { message: "인증번호가 올바르지 않습니다" }
            throw new HttpException(
                { message: "인증번호 오류", _errors },
                HttpStatus.BAD_REQUEST,
            )
        }
        return this.generatePhoneNumberJWT(phoneNumber)
    }

    private generatePhoneNumberJWT(phoneNumber: string) {
        const today = new Date()
        const exp = new Date(today)
        exp.setDate(today.getDate() + 15)
        return jwt.sign(
            {
                phoneNumber,
                exp: exp.getTime() / 1000,
            },
            configService.getEnv("JWT_TOKEN"),
        )
    }

    private generateUserJWT(user) {
        const today = new Date()
        const exp = new Date(today)
        exp.setDate(today.getDate() + 60)
        return jwt.sign(
            {
                id: user.id,
                exp: exp.getTime() / 1000,
            },
            configService.getEnv("JWT_TOKEN"),
        )
    }

    private buildUserRO(user: UserEntity) {
        const { password, ...other } = user
        const userRO = {
            ...other,
            token: this.generateUserJWT(user),
        }
        return { user: userRO }
    }

    private async authCodePost(phoneNumber: string) {
        const timeStamp = Date.now().toString()
        const hmac = crypto.algo.HMAC.create(
            crypto.algo.SHA256,
            configService.getEnv("NCP_SECRET_KEY"),
        )
        hmac.update("POST")
        hmac.update(" ")
        hmac.update(
            `/sms/v2/services/${configService.getEnv("NCP_SMS_KEY")}/messages`,
        )
        hmac.update("\n")
        hmac.update(timeStamp)
        hmac.update("\n")
        hmac.update(configService.getEnv("NCP_ACCESS_KEY"))

        const hash = hmac.finalize().toString(crypto.enc.Base64)
        const authCode = randNumber(100000, 999999)
        await Promise.all([
            fetch(
                `https://sens.apigw.ntruss.com/sms/v2/services/${configService.getEnv(
                    "env.NCP_SMS_KEY",
                )}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "x-ncp-iam-access-key":
                            configService.getEnv("NCP_ACCESS_KEY"),
                        "x-ncp-apigw-timestamp": timeStamp,
                        "x-ncp-apigw-signature-v2": hash,
                    },
                    body: JSON.stringify({
                        type: "SMS",
                        countryCode: "82",
                        from: configService.getEnv("PHONE_NUMBER"),
                        contentType: "COMM",
                        content: `[폼 클레이] 본인확인 인증번호 \n[${authCode}]를 화면에 입력해주세요`,
                        messages: [
                            {
                                to: phoneNumber,
                            },
                        ],
                    }),
                },
            ),
            this.redisService.setData(phoneNumber, authCode.toString(), 180),
        ])
    }
}
