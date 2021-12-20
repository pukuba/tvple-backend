// Nest dependencies
import { TypeOrmModule } from "@nestjs/typeorm"
import { Test, TestingModule } from "@nestjs/testing"
import {
    Injectable,
    HttpStatus,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
} from "@nestjs/common"
// Other dependencies
import { deepStrictEqual as equal } from "assert"
import * as fs from "fs"
// Local files
import { CommentService } from "./comment.service"
import { jwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { CommentModule } from "../comment.module"
import { UserRepository } from "src/shared/repositories/user.repository"
import { MediaRepository } from "src/shared/repositories/media.repository"

describe("MediaService", () => {
    let service: CommentService
    let userDb: UserRepository
    let mediaDb: MediaRepository
    let token: string
    let mediaId1: string
    let mediaId2: string
    let commentId1: string
    let commentId2: string
    before(async () => {
        const module = await Test.createTestingModule({
            imports: [
                CommentModule,
                TypeOrmModule.forRoot({
                    type: "mysql",
                    username: "travis",
                    database: "test",
                    entities: ["./**/*.entity.ts"],
                    keepConnectionAlive: true,
                    synchronize: true,
                }),
            ],
        }).compile()
        service = module.get<CommentService>(CommentService)
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
        ;[mediaId1, mediaId2] = await Promise.all([
            mediaDb
                .uploadMedia(
                    "test",
                    {
                        file: 1,
                        title: "test-1",
                        description: "이건 test-1 영상입니다",
                    },
                    "https://pukuba.dev/1",
                )
                .then((x) => x.mediaId),
            mediaDb
                .uploadMedia(
                    "test",
                    {
                        file: 2,
                        title: "test-2",
                        description: "이건 test-2 영상입니다",
                    },
                    "https://pukuba.dev/2",
                )
                .then((x) => x.mediaId),
        ])
    })
    describe("createComment", () => {
        it("should be throw BadRequestException error", async () => {
            try {
                await service.createComment(
                    {
                        mediaId: "aabbccddeeffgg",
                        content: "test",
                        posX: 11,
                        posY: 22,
                        color: "#ffffff",
                        timeStamp: 111.1,
                    },
                    "test",
                )
            } catch (e) {
                equal(e instanceof BadRequestException, true)
                equal(e.status, 400)
                equal(e.response, {
                    statusCode: 400,
                    message: "댓글 작성에 실패했습니다",
                    error: "Bad Request",
                })
            }
        })

        it("should be throw UnauthorizedException error", async () => {
            try {
                await service.createComment(
                    {
                        mediaId: mediaId1,
                        content: "test",
                        posX: 11,
                        posY: 22,
                        color: "#123456",
                        timeStamp: 111.1,
                    },
                    "test",
                )
            } catch (e) {
                equal(e instanceof UnauthorizedException, true)
                equal(e.status, 401)
                equal(e.response, {
                    statusCode: 401,
                    message: "포인트가 부족합니다",
                    error: "Unauthorized",
                })
            }
        })

        it("should be return CommentEntity - 1", async () => {
            const result = await service.createComment(
                {
                    mediaId: mediaId1,
                    content: "test-comment",
                    posX: 11.11,
                    posY: 22.22,
                    color: "#ffffff",
                    timeStamp: 111.1,
                },
                "test",
            )
            equal(result.mediaId, mediaId1)
            equal(result.content, "test-comment")
            equal(result.posX, 11.11)
            equal(result.posY, 22.22)
            equal(result.color, "#ffffff")
            equal(result.timeStamp, 111.1)
            commentId1 = result.commentId
        })

        it("should be return CommentEntitiy - 2", async () => {
            const result = await service.createComment(
                {
                    mediaId: mediaId1,
                    content: "test-comment-2",
                    posX: 22.22,
                    posY: 11.11,
                    color: "#000000",
                    timeStamp: 11.1,
                },
                "test",
            )
            equal(result.mediaId, mediaId1)
            equal(result.content, "test-comment-2")
            equal(result.posX, 22.22)
            equal(result.posY, 11.11)
            equal(result.color, "#000000")
            equal(result.timeStamp, 11.1)
            commentId2 = result.commentId
        })
    })

    describe("getCommentByMediaId", async () => {
        it("should be return CommentEntity[] - 1", async () => {
            const result = await service.getCommentByMediaId(mediaId1)
            equal(result.length, 2)
            equal(result[0].mediaId, mediaId1)
            equal(result[0].content, "test-comment-2")
            equal(result[0].posX, 22.22)
            equal(result[0].posY, 11.11)
            equal(result[0].color, "#000000")
            equal(result[0].timeStamp, 11.1)
            equal(result[1].mediaId, mediaId1)
            equal(result[1].content, "test-comment")
            equal(result[1].posX, 11.11)
            equal(result[1].posY, 22.22)
            equal(result[1].color, "#ffffff")
            equal(result[1].timeStamp, 111.1)
        })

        it("should be return CommentEntity[] - 2", async () => {
            const result = await service.getCommentByMediaId(mediaId2)
            equal(result.length, 0)
        })
    })

    describe("deleteComment", async () => {
        it("should be throw ForbiddenException error", async () => {
            try {
                await service.deleteComment(mediaId1, "testtest")
            } catch (e) {
                equal(e instanceof ForbiddenException, true)
                equal(e.status, 403)
                equal(e.response, {
                    statusCode: 403,
                    message: "권한이 없습니다",
                    error: "Forbidden",
                })
            }
        })

        it("should be return StatusOK", async () => {
            const result = await service.deleteComment(commentId1, "test")
            equal(result.status, "ok")
            equal(result.message, "정상적으로 삭제되었습니다")
        })
    })

    after(async () => {
        await Promise.all([
            mediaDb.query("delete from `like`;"),
            mediaDb.query("delete from user;"),
            mediaDb.query("delete from media;"),
        ])
    })
})
