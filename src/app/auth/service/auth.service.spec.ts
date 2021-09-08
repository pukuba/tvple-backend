import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"

import { Connection, Repository } from "typeorm"
import { deepStrictEqual as equal } from "assert"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthController } from "../controller/auth.controller"

import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { MessageService } from "src/shared/services/message.service"
import { RedisService } from "src/shared/Services/redis.service"
import { UserEntity } from "src/shared/entities/users.entity"
import { createMemDB } from "test/test.db"
describe("UserService", () => {
    let service: AuthService
    let db: Connection
    let repository: Repository<UserEntity>
    beforeAll(async () => {
        db = await createMemDB([UserEntity])
        repository = db.getRepository(UserEntity)
        service = new AuthService(
            new JwtManipulationService(),
            new RedisService(),
            new MessageService(),
            repository,
        )
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })
    describe("createAuthCode", () => {
        it("should return void", async () => {
            const res = await service.createAuthCode({ phoneNumber: "01000000000" })
            equal(res, undefined)
        })
    })
    let phoneNumberToken
    describe("checkAuthCode", () => {
        it('should return jwt token', async () => {
            const authorizationCode = await new RedisService().getData("01000000000")
            const res = await service.checkAuthCode({
                phoneNumber: "01000000000",
                authCode: authorizationCode
            })
            phoneNumberToken = res
            equal(typeof phoneNumberToken, "string")
            equal(phoneNumberToken.split(" ").length, 2)
        })
    })

    describe("signUp", () => {
        it("should return jwt token", async () => {
            const res = await service.signUp({
                id: "pukuba",
                password: "test1234!",
                phoneNumber: "01000000000",
                authCodeToken: phoneNumberToken,
                username: "pukuba"
            })
            equal(typeof res, "string")
        })
    })
})
