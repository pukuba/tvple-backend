// Nest dependencies
import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"

// Other dependencies
import * as request from "supertest"
import { equal } from "assert"

// Local files
import { ApplicationModule } from "../../src/app.module"
import { configService } from "../../src/shared/services/config.service"
import { RedisService } from "../../src/shared/services/redis.service"
import { jwtManipulationService } from "src/shared/services/jwt.manipulation.service"

describe("Auth E2E", () => {
    let app: INestApplication
    let token: string[] = []
    before(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ApplicationModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })
    after(async () => {
        await app.close()
    })

    let verificationToken: string
    it("/v1/auth/code (POST)", async () => {
        const { body } = await request(app.getHttpServer())
            .post("/v1/auth/code")
            .set({ "Content-Type": "application/json" })
            .send(
                JSON.stringify({
                    phoneNumber: configService.getEnv("PUKUBA_PHONENUMBER"),
                }),
            )
            .expect(201)
        equal(body.status, "ok")
        equal(body.message, "본인확인 인증번호를 발송하였습니다")
    })

    it("/v1/auth/code (GET)", async () => {
        const verificationCode = await new RedisService().getData(
            configService.getEnv("PUKUBA_PHONENUMBER"),
        )
        const { body } = await request(app.getHttpServer())
            .get("/v1/auth/code")
            .set({ "Content-Type": "application/json" })
            .query({
                phoneNumber: configService.getEnv("PUKUBA_PHONENUMBER"),
                verificationCode,
            })
            .expect(200)
        equal(typeof body.verificationToken, "string")
        verificationToken = body.verificationToken
    })

    it("/v1/auth/sign-up (POST)", async () => {
        const { body } = await request(app.getHttpServer())
            .post("/v1/auth/sign-up")
            .set({ "Content-Type": "application/json" })
            .send(
                JSON.stringify({
                    phoneNumber: configService.getEnv("PUKUBA_PHONENUMBER"),
                    verificationToken,
                    id: "pukuba",
                    username: "pukuba",
                    password: "test1234!@",
                }),
            )
            .expect(201)
        equal(typeof body.accessToken, "string")
        equal(body.user.id, "pukuba")
        token.push(`Bearer ${body.accessToken}`)
    })

    it("/v1/auth/sign-in (POST)", async () => {
        const { body } = await request(app.getHttpServer())
            .post("/v1/auth/sign-in")
            .set({ "Content-Type": "application/json" })
            .send(
                JSON.stringify({
                    id: "pukuba",
                    password: "test1234!@",
                }),
            )
            .expect(201)
        equal(typeof body.accessToken, "string")
        equal(body.user.id, "pukuba")
        token.push(`Bearer ${body.accessToken}`)
    })

    it("/v1/auth/sign-out (DELETE) - Success", async () => {
        await request(app.getHttpServer())
            .delete("/v1/auth/sign-out")
            .set({ "Content-Type": "application/json" })
            .set({ Authorization: token[0] })
            .expect(200)
    })

    it("/v1/auth/sign-out (DELETE) - Fail", async () => {
        await request(app.getHttpServer())
            .delete("/v1/auth/sign-out")
            .set({ "Content-Type": "application/json" })
            .set({ Authorization: token[0] })
            .expect(401)
    })

    it("/v1/auth/id (GET)", async () => {
        const verificationToken = jwtManipulationService.generateJwtToken({
            phoneNumber: configService.getEnv("PUKUBA_PHONENUMBER") as string,
            exp: Math.floor(Date.now() / 1000) + 60 * 20,
        })
        const { body } = await request(app.getHttpServer())
            .get("/v1/auth/id")
            .set({ "Content-Type": "application/json" })
            .query({ verificationToken })
            .expect(200)
        equal(body.status, "ok")
    })

    it("/v1/auth/password (PATCH)", async () => {
        const verificationToken = jwtManipulationService.generateJwtToken({
            phoneNumber: configService.getEnv("PUKUBA_PHONENUMBER") as string,
            exp: Math.floor(Date.now() / 1000) + 60 * 30,
        })
        const { body } = await request(app.getHttpServer())
            .patch("/v1/auth/password")
            .set({ "Content-Type": "application/json" })
            .send(JSON.stringify({ password: "test1234!@", verificationToken }))
            .expect(200)
        equal(body.status, "ok")
    })

    it("/v1/auth/account (DELETE)", async () => {
        await request(app.getHttpServer())
            .delete("/v1/auth/account")
            .set({ "Content-Type": "application/json" })
            .set({ Authorization: token[1] })
            .send(JSON.stringify({ id: "pukuba", password: "test1234!@" }))
            .expect(200)
    })
})
