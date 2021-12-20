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
