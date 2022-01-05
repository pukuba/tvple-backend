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
    Req,
    UseInterceptors,
    Ip,
    UploadedFile,
    ParseIntPipe,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { AuthGuard } from "@nestjs/passport"
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiQuery,
    ApiParam,
    ApiOkResponse,
} from "@nestjs/swagger"

// Other dependencies
import * as concat from "concat-stream"

// Local files
import { JwtAuthGuard } from "src/shared/guards/role.guard"
import { jwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { ValidationPipe } from "../../../shared/pipes/validation.pipe"
import { UserService } from "../service/user.service"
import { FindUserListReseponseDto, FindUserListDto } from "../dto"

@ApiTags("v1/user")
@Controller("v1/user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("/search")
    @ApiOperation({ summary: "유저 목록 가져오기" })
    @ApiOkResponse({
        type: FindUserListReseponseDto,
        description: "유저 리스트 가져오기 성공",
    })
    async getUserListByUsername(
        @Query("page", ParseIntPipe) page: number = 1,
        @Query("keyword") keyword: string,
    ) {
        return await this.userService.getUserListbyUsername(keyword, page)
    }
}
