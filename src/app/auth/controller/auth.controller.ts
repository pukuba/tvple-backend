import {
    Get,
    Post,
    Body,
    Put,
    Delete,
    Param,
    Query,
    Controller,
    UsePipes,
} from "@nestjs/common"
import {
    CreateUserDto,
    CreateAuthCodeDto,
    CheckAuthCodeDto,
    LoginDto,
} from "../dto"
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger"
import { AuthService } from "../service/auth.service"
import { ValidationPipe } from "../../../shared/pipes/validation.pipe"

@ApiTags("v1/auth")
@Controller("v1/auth")
export class AuthController {
    constructor(private readonly userService: AuthService) {}

    @UsePipes(new ValidationPipe())
    @Post("sign-in")
    @ApiOperation({
        summary: "로그인",
        description:
            "로그인을 윈한 API 입니다. \naccess 토큰과 유저 정보를 반환합니다.",
    })
    @ApiBody({ type: LoginDto })
    async signIn(@Body() userData: LoginDto) {
        const user = await this.userService.validateUser(userData)
        return await this.userService.signIn(user)
    }

    @UsePipes(new ValidationPipe())
    @Post("sign-up")
    @ApiOperation({
        summary: "회원가입",
        description: "회원가입을 위한 API 입니다.",
    })
    @ApiBody({ type: CreateUserDto })
    async signUp(@Body() userData: CreateUserDto) {
        return this.userService.signUp(userData)
    }

    @UsePipes(new ValidationPipe())
    @Post("code")
    @ApiOperation({
        summary: "휴대번호 인증번호 발송",
        description: "휴대번호 인증번호 발송을 위한 API 입니다.",
    })
    async createAuthCode(@Body() userData: CreateAuthCodeDto) {
        return this.userService.createAuthCode(userData)
    }

    @Get("code")
    @ApiOperation({
        summary: "휴대번호 인증번호 확인",
        description: "휴대번호 인증번호 확인을 위한 API 입니다",
    })
    async checkAuthCode(
        @Query("phoneNumber") phoneNumber: string,
        @Query("verificationCode") verificationCode: string,
    ) {
        return this.userService.checkAuthCode({
            phoneNumber,
            verificationCode,
        })
    }
}
