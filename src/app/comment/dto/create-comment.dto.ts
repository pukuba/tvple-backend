import { ApiProperty } from "@nestjs/swagger"

import { IsNotEmpty, Length, IsNumber, Min, Max } from "class-validator"

export class CreateCommentDto {
    @ApiProperty({
        type: "string",
        example: "string",
        description: "댓글의 내용",
    })
    content: string

    @ApiProperty({ type: "float", example: 4.4, description: "댓글의 시간" })
    @IsNumber()
    @Min(0)
    @Max(1000)
    timeStamp: number

    @ApiProperty({ type: "float", example: 4.4, description: "댓글의 좌표 X" })
    @IsNumber()
    @Min(0)
    @Max(100)
    posX: number

    @ApiProperty({ type: "float", example: 4.4, description: "댓글의 좌표 Y" })
    @IsNumber()
    @Min(0)
    @Max(100)
    posY: number

    @ApiProperty({
        type: "string",
        example: "#ffffff",
        description: "댓글의 색상",
    })
    @IsNotEmpty()
    @Length(7, 7)
    color: string
}

export class CreateCommentResponseDto {
    @ApiProperty({ example: "string" })
    commmentId: string

    @ApiProperty({ example: "content" })
    content: string

    @ApiProperty({ example: "userId" })
    userId: string

    @ApiProperty({ example: 111.12 })
    timeStamp: number

    @ApiProperty({ example: 55.3 })
    posX: number

    @ApiProperty({ example: 44.2 })
    posY: number

    @ApiProperty({ example: "#ffffff" })
    color: string
}
