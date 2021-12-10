import { ApiProperty } from "@nestjs/swagger"

import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsString,
    Length,
} from "class-validator"
import { MediaEntity } from "src/shared/entities/media.entity"

export class SearchMediaDto {
    @ApiProperty({
        required: true,
        example: 1,
    })
    @IsNotEmpty()
    @IsNumberString()
    page: number

    @ApiProperty({
        required: true,
        example: "search-keyword",
    })
    @Length(0, 200)
    @IsString()
    keyword: string
}

export class SearchMediaResponseDto {
    @ApiProperty({
        description: "검색 결과",
        type: "array",
        items: {
            properties: {
                mediaId: { type: "string" },
                url: { type: "string" },
                userId: { type: "string" },
                description: { type: "string" },
                title: { type: "string" },
                date: { type: "string", format: "date-time" },
                likes: { type: "number" },
                views: { type: "number" },
            },
        },
    })
    @IsArray()
    readonly data: {
        mediaId: string
        url: string
        userId: string
        description: string
        title: string
        date: Date
        likes: number
        views: number
    }[]

    @IsNumber()
    @ApiProperty({ description: "검색 결과 수" })
    readonly count: number
}
