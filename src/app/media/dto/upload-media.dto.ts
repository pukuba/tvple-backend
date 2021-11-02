import { ApiProperty } from "@nestjs/swagger"

import { IsNotEmpty, Length } from "class-validator"

export class UploadMediaDto {
    @ApiProperty({
        required: true,
        example: "media name",
    })
    @IsNotEmpty()
    @Length(3, 75)
    title: string

    @ApiProperty({
        required: true,
        example: "media description",
    })
    @Length(0, 2000)
    description: string
}
