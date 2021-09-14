import { IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class FindIdDto {
    @ApiProperty({
        type: String,
        description: "전화번호 인증 토큰",
        required: true,
    })
    @IsString()
    readonly verificationToken: string
}
