import { IsString, Matches } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class ResetPasswordDto {
    @ApiProperty({
        type: String,
        description: "전화번호 인증 토큰",
        required: true,
    })
    @IsString()
    readonly verificationToken: string

    @ApiProperty({
        type: String,
        description: "재설정할 비밀번호",
        required: true,
    })
    @IsString()
    @Matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,40}$/,
        {
            message:
                "비밀번호는 6자 이상 40자 이하이며 하나 이상의 숫자 및 문자, 특수문자가 필요합니다.",
        },
    )
    readonly password: string
}
