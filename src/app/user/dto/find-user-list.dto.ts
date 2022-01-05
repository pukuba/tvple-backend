import { IsArray, IsNumber } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class FindUserListDto {
    @ApiProperty({ required: false, example: 1 })
    page: number
    @ApiProperty({
        required: true,
        example: "keyword",
        description: "검색 키워드",
    })
    username: string
}

export class FindUserListReseponseDto {
    @ApiProperty({
        description: "검색 결과",
        type: "array",
        items: {
            properties: {
                id: { type: "string" },
                username: { type: "string" },
                mediaCount: { type: "number" },
                link: { type: "string" },
                profileImage: { type: "string" },
                biography: { type: "string" },
            },
        },
    })
    @IsArray()
    readonly users: {
        userId: string
        username: string
        mediaCount: number
        link: string
        profileImage: string
        biography: string
    }[]

    @IsNumber()
    @ApiProperty({ description: "검색 결과 수" })
    readonly count: number
}
