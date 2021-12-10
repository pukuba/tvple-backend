import { ApiProperty } from "@nestjs/swagger"

import { IsNotEmpty, Length } from "class-validator"

export class UploadMediaDto {
    @ApiProperty({ type: "string", format: "binary" })
    file: any

    @ApiProperty({
        required: true,
        example: "media name",
        description: "미디어의 제목",
    })
    @IsNotEmpty()
    @Length(3, 75)
    title: string

    @ApiProperty({
        required: true,
        example: "media description",
        description: "미디어의 설명",
    })
    @Length(0, 2000)
    description: string
}

export class MediaEntityResponseDto {
    @ApiProperty({ example: "string" })
    mediaId: string

    @ApiProperty({ example: "media url" })
    url: string

    @ApiProperty({ example: "media description" })
    description: string

    @ApiProperty({ example: "testId" })
    userId: string

    @ApiProperty({ example: "media title" })
    title: string

    @ApiProperty({ type: "string", format: "date-time" })
    date: string

    @ApiProperty({ example: 0 })
    likes: number

    @ApiProperty({ example: 0 })
    views: number
}
