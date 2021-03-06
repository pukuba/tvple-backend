import { IsNotEmpty, IsString, Length, Matches } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Jwt } from "jsonwebtoken"

export class LoginDto {
    @ApiProperty({ type: String, description: "유저 ID", required: true })
    @IsString()
    @Matches(/^(?=.*[a-z])[a-z0-9]{4,20}$/, {
        message:
            "아이디의 길이는 4자 이상 20자 이하이며 영문자만으로 혹은 영문자와 숫자를 조합하여 사용 가능합니다.",
    })
    readonly id: string

    @ApiProperty({ type: String, description: "유저 Password", required: true })
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

export class LoginResultDto {
    @ApiProperty({ description: "access 토큰" })
    readonly accessToken: string

    @ApiProperty({
        description: "유저 정보",
        properties: {
            id: { type: "string" },
        },
    })
    readonly user: {
        id: string
    }
}

export class DeleteUserDto extends LoginDto {}
