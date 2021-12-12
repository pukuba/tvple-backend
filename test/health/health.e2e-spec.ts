// Nest dependencies
import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"

// Other dependencies
import * as request from "supertest"
import { equal } from "assert"

//Local files
import { ApplicationModule } from "../../src/app.module"
import { configService } from "../../src/shared/services/config.service"
import { RedisService } from "../../src/shared/services/redis.service"
import { jwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { beforeRegister, afterDeleteAccount } from "../lib"

describe("Health E2E", () => {
    let app: INestApplication
    let token: string
    before(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ApplicationModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()

        token = await beforeRegister(app, {
            id: "pukuba",
            pw: "test1234!@",
            username: "pukuba",
        })
    })

    it("/v1/health/live (GET)", async () => {
        const { body } = await request(app.getHttpServer())
            .get("/v1/health/live")
            .expect(200)
        equal(body.status, "ok")
    })

    it("/v1/health/auth (GET) - Authorization", async () => {
        const { body } = await request(app.getHttpServer())
            .get("/v1/health/auth")
            .set({ Authorization: token })
            .expect(200)

        equal(body.status, "ok")
        await afterDeleteAccount(app, {
            id: "pukuba",
            pw: "test1234!@",
            token,
        })
    })

    it("/v1/health/auth (GET) - Not authorization", async () => {
        await request(app.getHttpServer())
            .get("/v1/health/auth")
            .set({ Authorization: token })
            .expect(401)
    })
})
