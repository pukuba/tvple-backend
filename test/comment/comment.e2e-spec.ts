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

describe("Comment E2E", () => {
    let app: INestApplication
    let token: string
    let mediaId: string
    let commentId: string
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
            phoneNumber: "01000000000",
        })
        const { body } = await request(app.getHttpServer())
            .post("/v1/media/upload")
            .set("Authorization", token)
            .set("Content-Type", "multipart/form-data")
            .field("title", "test title")
            .field("description", "test media description")
            .attach("file", "./test/sample-mp4-file-small.mp4")
            .expect(201)

        equal(body.userId, "pukuba")
        equal(body.title, "test title")
        mediaId = body.mediaId
    })

    it("/v1/comment/:mediaId (POST)", async () => {
        const { body } = await request(app.getHttpServer())
            .post(`/v1/comment/${mediaId}`)
            .set("Authorization", token)
            .send({
                content: "test comment",
                timeStamp: 5.5,
                posX: 1.1,
                posY: 99.9,
                color: "#ffffff",
            })
            .expect(201)

        equal(body.userId, "pukuba")
        equal(body.mediaId, mediaId)
        equal(body.content, "test comment")
        commentId = body.commentId
    })

    it("/v1/comment/:mediaId (GET)", async () => {
        const { body } = await request(app.getHttpServer())
            .get(`/v1/comment/${mediaId}`)
            .set("Authorization", token)
            .expect(200)

        equal(body.data.length, 1)
        equal(body.data[0].userId, "pukuba")
        equal(body.data[0].mediaId, mediaId)
        equal(body.data[0].content, "test comment")
        equal(body.data[0].commentId, commentId)
    })

    it("/v1/media/:mediaId (GET)", async () => {
        const { body } = await request(app.getHttpServer())
            .get(`/v1/media/${mediaId}`)
            .set("Authorization", token)
            .expect(200)
        equal(body.user.username, "pukuba")
        equal(body.mediaId, mediaId)
        equal(body.title, "test title")
        equal(body.description, "test media description")
        equal(body.comment[0].userId, "pukuba")
    })

    it("/v1/comment/info/:commentId", async () => {
        const { body } = await request(app.getHttpServer())
            .get(`/v1/comment/info/${commentId}`)
            .set("Authorization", token)
            .expect(200)
        equal(body.userId, "pukuba")
        equal(body.mediaId, mediaId)
        equal(body.content, "test comment")
        equal(body.commentId, commentId)
        equal(body.user.id, "pukuba")
        equal(body.user.username, "pukuba")
    })

    it("/v1/comment/:commentId (DELETE)", async () => {
        const { body } = await request(app.getHttpServer())
            .delete(`/v1/comment/${commentId}`)
            .set("Authorization", token)
            .expect(200)

        equal(body.status, "ok")
    })

    after(async () => {
        await afterDeleteAccount(app, {
            id: "pukuba",
            pw: "test1234!@",
            token: token,
        })
    })
})