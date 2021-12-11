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
import { ValidationPipe } from "src/shared/pipes/validation.pipe"
import { StatusOk } from "src/shared/types"

@ApiTags("v1/health")
@Controller("v1/health")
export class HealthController {
    constructor() {}

    @Get("/live")
    @ApiOperation({ summary: "서버 상태 확인" })
    @ApiOkResponse({ description: "서버 상태 확인 성공" })
    getLiveHealth(): StatusOk {
        return {
            status: "ok",
            message: `Healthy ${new Date()}`,
        }
    }

    @Get("/auth")
    @ApiOperation({ summary: "JWT 토큰 확인" })
    @ApiBearerAuth()
    @ApiOkResponse({ description: "JWT 토큰 확인 성공" })
    @UseGuards(AuthGuard("jwt"))
    getAuthHealth(): StatusOk {
        return {
            status: "ok",
            message: `Healthy ${new Date()}`,
        }
    }
}
