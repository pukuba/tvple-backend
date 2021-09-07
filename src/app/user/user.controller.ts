import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ValidationPipe } from '../../shared/pipes/validation.pipe';

@ApiBearerAuth()
@ApiTags('user')
@Controller('v1')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UsePipes(new ValidationPipe())
    @Post('users')
    @ApiOperation({ summary: '회원가입 API', description: '회원가입을 위한 API 입니다.' })
    @ApiBody({ type: CreateUserDto })
    async craete(@Body() userData: CreateUserDto) {
        return this.userService.create(userData)
    }

    @UsePipes(new ValidationPipe())
    @Post('users/authcode')
    @ApiOperation({ summary: '휴대번호 인증번호 발송 API', description: '휴대번호 인증번호 발송 API 입니다.' })
    async authCode(@Body() userData) {

    }

}
