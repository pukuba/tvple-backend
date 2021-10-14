import { ApiProperty } from "@nestjs/swagger"

import { IsNotEmpty, IsMongoId, Length } from "class-validator"

export class UploadMediaDto {
    @ApiProperty({
        required: true,
        example: "post name",
    })
    @IsNotEmpty()
    @Length(3, 75)
    name: string

    @ApiProperty({
        required: true,
        example: "post description",
    })
    @Length(0, 2000)
    description: string
}
