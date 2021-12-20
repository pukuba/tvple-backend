import { ApiProperty } from "@nestjs/swagger"

export class DeleteCommentResponseDto {
    @ApiProperty({
        type: String,
        description: "status",
    })
    readonly status: string

    @ApiProperty({
        type: String,
        description: "message",
    })
    readonly message: string
}
