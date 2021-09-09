import {
    Get,
    Post,
    Body,
    Put,
    UseGuards,
    Delete,
    Param,
    Headers,
    Query,
    Controller,
    UsePipes,
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
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
    constructor(private readonly authService: AuthService) { }

    @UsePipes(new ValidationPipe())
    @Post("sign-in")
    @ApiOperation({
        summary: "로그인",
        description:
            "로그인을 윈한 API 입니다. \naccess 토큰과 유저 정보를 반환합니다.",
    })
    @ApiBody({ type: LoginDto })
    async signIn(@Body() userData: LoginDto) {
        const user = await this.authService.validateUser(userData)
        return await this.authService.signIn(user)
    }

    @UsePipes(new ValidationPipe())
    @Post("sign-up")
    @ApiOperation({
        summary: "회원가입",
        description: "회원가입을 위한 API 입니다.",
    })
    @ApiBody({ type: CreateUserDto })
    async signUp(@Body() userData: CreateUserDto) {
        return this.authService.signUp(userData)
    }

    @UsePipes(new ValidationPipe())
    @Post("code")
    @ApiOperation({
        summary: "휴대번호 인증번호 발송",
        description: "휴대번호 인증번호 발송을 위한 API 입니다.",
    })
    async createAuthCode(@Body() userData: CreateAuthCodeDto) {
        return this.authService.createAuthCode(userData)
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
        return this.authService.checkAuthCode({
            phoneNumber,
            verificationCode,
        })
    }

    @Delete("sign-out")
    @UseGuards(AuthGuard("jwt"))
    @ApiBearerAuth()
    async signOut(@Headers("authorization") bearer: string) {
        return this.authService.signOut(bearer)
    }
}
