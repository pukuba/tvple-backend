// Nest dependencies
import { TypeOrmModule } from "@nestjs/typeorm"
import { Test, TestingModule } from "@nestjs/testing"

// Other dependencies

import { Connection, Repository } from "typeorm"
import { deepStrictEqual as equal } from "assert"
import * as fs from "fs"
// Local files
import { MediaService } from "./media.service"
import { MediaController } from "../controller/media.controller"
import { jwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { MessageService } from "src/shared/services/message.service"
import { RedisService } from "src/shared/Services/redis.service"
import { MediaModule } from "../media.module"
import { UserRepository } from "src/shared/repositories/user.repository"
import { MediaRepository } from "src/shared/repositories/media.repository"
describe("MediaService", () => {
    let service: MediaService
    let userDb: UserRepository
    let mediaDb: MediaRepository
    let token: string
    let mediaId: string
    before(async () => {
        const module = await Test.createTestingModule({
            imports: [
                MediaModule,
                TypeOrmModule.forRoot({
                    type: "mysql",
                    username: "travis",
                    database: "test",
                    entities: ["./**/*.entity.ts"],
                    synchronize: true,
                }),
            ],
        }).compile()
        service = module.get<MediaService>(MediaService)
        userDb = module.get<UserRepository>(UserRepository)
        mediaDb = module.get<MediaRepository>(MediaRepository)
        await userDb.createUser({
            username: "test",
            password: "testtest1@@",
            id: "test",
            phoneNumber: "01000000000",
            verificationToken: "01010101010",
        })
        token = jwtManipulationService.generateJwtToken({
            id: "test",
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        })
    })
    describe("uploadMedia", () => {
        it("should be return MediaEntity", async () => {
            const file = {
                buffer: fs.readFileSync("test/sample-mp4-file-small.mp4"),
                fieldname: "file",
                originalname: "sample-mp4-file-small.mp4",
                encoding: "",
                mimetype: "video/mp4",
                name: "sample-mp4-file-small.mp4",
                size: 1024,
            }
            const {
                title,
                description,
                mediaId: id,
            } = await service.uploadMedia("test", file, {
                title: "test",
                description: "test",
            })
            equal(title, "test")
            equal(description, "test")
            mediaId = id
        })
    })

    describe("getMedia", () => {
        it("should be return MediaEntity", async () => {
            const media = await service.getMedia(mediaId, "::1", "test")
            equal(media.userId, "test")
            equal(media.mediaId, mediaId)
            equal(media.views, 1)
        })
        it("should be return BadRequestException Error", async () => {
            try {
                await service.getMedia("test1234", "::1", "test")
            } catch (e) {
                equal(e.message, "해당 영상이 존재하지가 않습니다")
            }
        })
    })

    describe("searchMedia", () => {
        it("should be return pageInfo", async () => {
            const pageInfo = await service.searchMedia(1, "t")
            equal(pageInfo.count, 1)
            equal(pageInfo.data[0].mediaId, mediaId)
            equal(pageInfo.data[0].title.includes("t"), true)
        })
    })

    describe("deleteMedia", () => {
        it("should be return void", async () => {
            const res = await service.deleteMedia("test", mediaId)
            equal(res, undefined)
        })
    })

    after(async () => {
        await Promise.all([
            mediaDb.query("delete from media;"),
            mediaDb.query("delete from user;"),
        ])
    })
})
