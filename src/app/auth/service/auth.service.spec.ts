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
import { UserRepository } from "src/shared/repositories/user.repository"
describe("UserService", () => {
    let service: AuthService
    let db: UserRepository
    let token: string
    before(async () => {
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
        db = module.get<UserRepository>(UserRepository)
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
        })
        it("should return error status 401", async () => {
            await db.deleteUser({
                id: "pukuba",
                password: "test1234!",
            })
            try {
                await service.signUp({
                    id: "pukuba",
                    password: "test1234!",
                    phoneNumber: "01000000000",
                    verificationToken,
                    username: "pukuba",
                })
            } catch (e) {
                equal(e.status, 401)
            }
        })
    })
    describe("signIn", () => {
        it("Should be return jwt token", async () => {
            await db.createUser({
                id: "pukuba",
                password: "test1234!",
                phoneNumber: "01000000000",
                username: "pukuba",
                verificationToken: "01010101010",
            })
            const res = await service.signIn({
                id: "pukuba",
                password: "test1234!",
            })
            equal(typeof res.accessToken, "string")
            equal(res.user.id, "pukuba")
            token = res.accessToken
        })
    })
    describe("deleteAccount", () => {
        it("Should be return status ok", async () => {
            const res = await service.deleteAccount(
                {
                    id: "pukuba",
                    password: "test1234!",
                },
                `Bearer ${token}`,
            )
            equal(res.status, "ok")
            equal(res.message, "계정이 삭제되었습니다")
        })
    })
})
