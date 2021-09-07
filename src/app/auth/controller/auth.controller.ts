import {
    Get,
    Post,
    Body,
    Put,
    Delete,
    Param,
    Controller,
    UsePipes,
} from "@nestjs/common"
import { CreateUserDto, CreateAuthCodeDto, CheckAuthCodeDto } from "../dto"
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger"
import { AuthService } from "../service/auth.service"
import { ValidationPipe } from "../../../shared/pipes/validation.pipe"

@ApiTags("v1/auth")
@Controller("v1/auth")
export class AuthController {
    constructor(private readonly userService: AuthService) {}

    @UsePipes(new ValidationPipe())
    @Post("sign-up")
    @ApiOperation({
        summary: "회원가입 API",
        description: "회원가입을 위한 API 입니다.",
    })
    @ApiBody({ type: CreateUserDto })
    async craeteUser(@Body() userData: CreateUserDto) {
        return this.userService.signUp(userData)
    }

    @UsePipes(new ValidationPipe())
    @Post("code")
    @ApiOperation({
        summary: "휴대번호 인증번호 발송 API",
        description: "휴대번호 인증번호 발송을 위한 API 입니다.",
    })
    async createAuthCode(@Body() userData: CreateAuthCodeDto) {
        return this.userService.createAuthCode(userData)
    }

    @UsePipes(new ValidationPipe())
    @Post("code/check")
    @ApiOperation({
        summary: "휴대번호 인증번호 확인 API",
        description: "휴대번호 인증번호 확인 API을 위한 API 입니다",
    })
    async checkAuthCode(@Body() userData: CheckAuthCodeDto) {
        return this.userService.checkAuthCode(userData)
    }
}
