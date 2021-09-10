import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"

import { Connection, Repository } from "typeorm"
import { deepStrictEqual as equal } from "assert"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthController } from "../controller/auth.controller"

import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { MessageService } from "src/shared/services/message.service"
import { RedisService } from "src/shared/Services/redis.service"
import { AuthModule } from "../auth.module"
import { UserEntity } from "src/shared/entities/user.entity"
import { UserRepository } from "src/shared/repositories/user.repository"
describe("UserService", () => {
    let service: AuthService
    let db: Connection

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                AuthModule,
                TypeOrmModule.forRoot({
                    type: "mysql",
                    username: "travis",
                    database: "test",
                    entities: ["./**/*.entity.ts"],
                    synchronize: true,
                }),
            ],
        }).compile()
        service = module.get<AuthService>(AuthService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
    describe("createAuthCode", () => {
        it("should return void", async () => {
            const res = await service.createAuthCode({
                phoneNumber: "01000000000",
            })
            equal(res.status, "ok")
        })
    })
    let verificationToken
    describe("checkAuthCode", () => {
        it("should return jwt token", async () => {
            const verificationCode = await new RedisService().getData(
                "01000000000",
            )
            const res = await service.checkAuthCode({
                phoneNumber: "01000000000",
                verificationCode: verificationCode,
            })
            verificationToken = res.verificationToken
            equal("verificationToken" in res, true)
        })
    })

    describe("signUp", () => {
        it("should return jwt token", async () => {
            const res = await service.signUp({
                id: "pukuba",
                password: "test1234!",
                phoneNumber: "01000000000",
                verificationToken,
                username: "pukuba",
            })
            equal(res.user.id, "pukuba")
            equal(res.user.username, "pukuba")
        })
    })
})
