import { IsNotEmpty, IsString, Length, Matches } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    @ApiProperty({ type: String, description: "유저 ID", required: true })
    @IsString()
    @Matches(/^(?=.*[a-z])[a-z0-9]{4,20}$/, {
        message:
            "아이디의 길이는 4자 이상 20자 이하이며 영문자만으로 혹은 영문자와 숫자를 조합하여 사용 가능합니다.",
    })
    readonly id: string

    @ApiProperty({ type: String, description: "유저 Name", required: true })
    @IsString()
    @Matches(/^[a-z0-9가-힣\\s]{4,20}$/, {
        message: "올바른 username이 아닙니다",
    })
    readonly username: string

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

    @ApiProperty({
        type: String,
        description: "전화번호 인증 토큰",
        required: true,
    })
    @IsString()
    readonly verificationToken: string
}
