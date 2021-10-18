// Nest dependencies
import {
    Get,
    Post,
    Body,
    Patch,
    UseGuards,
    Delete,
    Param,
    Headers,
    Query,
    Controller,
    UsePipes,
} from "@nestjs/common"
import { ApiBearerAuth, ApiTags, ApiOperation } from "@nestjs/swagger"
import { AuthGuard } from "@nestjs/passport"

// Local files
import {
    CreateUserDto,
    CreateAuthCodeDto,
    ResetPasswordDto,
    DeleteUserDto,
    LoginDto,
} from "../dto"
import { JwtAuthGuard } from "src/shared/guards/role.guard"
import { AuthService } from "../service/auth.service"
import { ValidationPipe } from "../../../shared/pipes/validation.pipe"

@ApiTags("v1/auth")
@Controller("v1/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UsePipes(new ValidationPipe())
    @Post("sign-in")
    @ApiOperation({
        summary: "로그인",
        description:
            "로그인을 윈한 API 입니다. \naccess 토큰과 유저 정보를 반환합니다.",
    })
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "로그아웃",
        description: "로그아웃을 위한 API 입니다.",
    })
    async signOut(@Headers("authorization") bearer: string) {
        return this.authService.signOut(bearer)
    }

    @UsePipes(new ValidationPipe())
    @Delete("account")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "계정 삭제",
        description: "계정 삭제를 위한 API 입니다.",
    })
    async account(
        @Body() userData: DeleteUserDto,
        @Headers("authorization") bearer: string,
    ) {
        return this.authService.deleteAccount(userData, bearer)
    }

    @Get("find-id")
    @ApiOperation({
        summary: "아이디 찾기",
        description: "아이디 찾기를 위한 API 입니다.",
    })
    async findId(@Query("verificationToken") verificationToken: string) {
        return this.authService.findId({ verificationToken })
    }

    @Patch("reset-password")
    @ApiOperation({
        summary: "비밀번호 재설정",
        description: "비밀번호 재설정을 위한 API 입니다.",
    })
    async resetPassword(@Body() userData: ResetPasswordDto) {
        return this.authService.resetPassword(userData)
    }
}
