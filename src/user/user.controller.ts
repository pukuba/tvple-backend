import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ValidationPipe } from '../shared/pipes/validation.pipe';

@ApiBearerAuth()
@ApiTags('user')
@Controller('v1')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UsePipes(new ValidationPipe())
    @Post('users')
    @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
    @ApiBody({ type: CreateUserDto })
    async craete(@Body() userData: CreateUserDto) {
        return this.userService.create(userData)
    }
}
