// Nest dependencies
import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"

// Other dependencies
import * as request from "supertest"
import { deepStrictEqual as equal } from "assert"

// Local files
import { ApplicationModule } from "../../src/app.module"
import { beforeRegister, afterDeleteAccount } from "../lib"
import { UserRepository } from "src/shared/repositories/user.repository"
import { MediaRepository } from "src/shared/repositories/media.repository"

describe("User E2E", async () => {
    let app: INestApplication
    let token: string
    before(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ApplicationModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        moduleFixture.get<UserRepository>(UserRepository)
        moduleFixture.get<MediaRepository>(MediaRepository)
        await app.init()

        token = await beforeRegister(app, {
            id: "test1234",
            pw: "test1234!@",
            username: "pukuba",
            phoneNumber: "01000000000",
        })
    })

    after(async () => {
        await afterDeleteAccount(app, {
            id: "test1234",
            pw: "test1234!@",
            token,
        })
        await app.close()
    })

    it("/v1/user/search (GET)", async () => {
        const { body } = await request(app.getHttpServer())
            .get("/v1/user/search?page=1&keyword=pukuba")
            .set("Content-Type", "application/json")
            .expect(200)
        equal(body.count, 1)
        equal(body.data[0].id, "test1234")
    })
})
