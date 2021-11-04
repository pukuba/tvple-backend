import { ApiProperty } from "@nestjs/swagger"

import { IsNotEmpty, Length } from "class-validator"

export class UpdateMediaDto {
    @ApiProperty({
        required: false,
        example: "media name",
    })
    @IsNotEmpty()
    @Length(3, 75)
    title: string

    @ApiProperty({
        required: false,
        example: "media description",
    })
    @Length(0, 2000)
    description: string
}
