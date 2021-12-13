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

describe("Media E2E", () => {
    let app: INestApplication
    let token1: string, token2: string, mediaId1: string
    before(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ApplicationModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()

        token1 = await beforeRegister(app, {
            id: "pukuba",
            pw: "test1234!@",
            username: "pukuba",
            phoneNumber: "01000000000",
        })
        token2 = await beforeRegister(app, {
            id: "erolf0123",
            pw: "test1234!@",
            username: "erolf0123",
            phoneNumber: "01000000001",
        })
    })

    after(async () => {
        await Promise.all([
            afterDeleteAccount(app, {
                id: "pukuba",
                pw: "test1234!@",
                token: token1,
            }),
            afterDeleteAccount(app, {
                id: "erolf0123",
                pw: "test1234!@",
                token: token2,
            }),
        ])
    })

    it("/v1/media/upload (POST)", async () => {
        const { body } = await request(app.getHttpServer())
            .post("/v1/media/upload")
            .set("Authorization", token1)
            .set("Content-Type", "multipart/form-data")
            .field("title", "test title")
            .field("description", "test media description")
            .attach("file", "./test/sample-mp4-file-small.mp4")
            .expect(201)

        equal(body.userId, "pukuba")
        equal(body.title, "test title")
        mediaId1 = body.mediaId
    })

    it("/v1/media/like/:mediaId (POST) - token1", async () => {
        const { body } = await request(app.getHttpServer())
            .post(`/v1/media/like/${mediaId1}`)
            .set("Authorization", token1)
            .expect(201)

        equal(body.userId, "pukuba")
        equal(body.mediaId, mediaId1)
    })

    it("/v1/media/like/:mediaId (POST) - token2", async () => {
        const { body } = await request(app.getHttpServer())
            .post(`/v1/media/like/${mediaId1}`)
            .set("Authorization", token2)
            .expect(201)

        equal(body.userId, "pukuba")
        equal(body.mediaId, mediaId1)
    })

    it("/v1/media/like/list/:page (GET) - token1", async () => {
        const { body } = await request(app.getHttpServer())
            .get(`/v1/media/like/list/1`)
            .set("Authorization", token1)
            .expect(200)

        equal(body.data.length, 1)
        equal(body.data[0].userId, "pukuba")
        equal(body.data[0].mediaId, mediaId1)
        equal(body.data[0].likes, 2)
        equal(body.count, 1)
    })

    it("/v1/media/like/list/:page (GET) - token2", async () => {
        const { body } = await request(app.getHttpServer())
            .get(`/v1/media/like/list/1`)
            .set("Authorization", token2)
            .expect(200)

        equal(body.data.length, 1)
        equal(body.data[0].userId, "pukuba")
        equal(body.data[0].mediaId, mediaId1)
        equal(body.data[0].likes, 2)
        equal(body.count, 1)
    })

    it("/v1/media/search (GET)", async () => {
        const { body } = await request(app.getHttpServer())
            .get("/v1/media/search")
            .set("Authorization", token1)
            .query({ keyword: "test" })
            .expect(200)

        equal(body.data.length, 1)
        equal(body.count, 1)
        equal(body.data[0].userId, "pukuba")
        equal(body.data[0].mediaId, mediaId1)
        equal(body.data[0].likes, 2)
    })
})
