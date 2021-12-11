import { IsString, Matches, Min, Max, IsNumberString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CheckAuthCodeDto {
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

    @ApiProperty({
        type: Number,
        description: "인증번호",
        required: true,
    })
    @IsNumberString()
    @Min(100000)
    @Max(999999)
    readonly verificationCode: string
}

export class CheckAuthCodeResponseDto {
    @ApiProperty({
        type: String,
        description: "인증 토큰",
    })
    readonly verificationToken: string
}
