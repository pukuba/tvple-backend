import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNumber, IsString } from "class-validator"
import { CommentEntity } from "../../../shared/entities/comment.entity"
export class GetCommentDto {
    @ApiProperty({
        description: "댓글 리스트",
        type: "array",
        items: {
            properties: {
                mediaId: { type: "string", example: "aaabbbcccc-1121231" },
                commentId: { type: "string", example: "aaabbbcccc-1121231" },
                userId: { type: "string", example: "pukuba" },
                content: { type: "string", example: "댓글내용" },
                timeStamp: { type: "float", example: 122.41 },
                posX: { type: "float", example: 4.4 },
                posY: { type: "float", example: 22.22 },
                color: { type: "varchar", example: "#ffffff" },
            },
            type: "object",
        },
    })
    data: CommentEntity[]
}

export class GetCommentByIdDto {
    @ApiProperty({
        description: "상세 정보",
        type: "mediaId",
        example: "aaabbbcccc-1121231",
    })
    mediaId: string

    @ApiProperty({
        description: "댓글 아이디",
        type: "commentId",
        example: "aaabbbcccc-1121231",
    })
    commentId: string

    @ApiProperty({
        description: "유저 정보",
        type: "object",
        example: {
            username: "pukuba",
            userId: "pukuba",
        },
    })
    user: {
        username: string
        userId: string
    }

    @ApiProperty({
        description: "댓글 내용",
        type: "string",
        example: "댓글내용",
    })
    content: string

    @ApiProperty({
        description: "댓글 시간",
        type: "float",
        example: 122.41,
    })
    timeStamp: number

    @ApiProperty({
        description: "댓글 위치",
        type: "float",
        example: 4.4,
    })
    posX: number

    @ApiProperty({
        description: "댓글 위치",
        type: "float",
        example: 22.22,
    })
    posY: number

    @ApiProperty({
        description: "댓글 색상",
        type: "varchar",
        example: "#ffffff",
    })
    color: string
}
