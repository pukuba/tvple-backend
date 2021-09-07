import { IsNotEmpty, IsString, Length, Matches } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateAuthCodeDto {
    @ApiProperty({
        type: String,
        description: "유저 Phone Number",
        required: true,
    })
    @IsString()
    @Matches(/^010\d{8,8}$/, {
        message: "올바른 전화번호가 아닙니다 ex) 01000000000",
    })
    readonly phoneNumber: string
}
