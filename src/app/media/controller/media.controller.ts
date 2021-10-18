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
    UsePipes,
    BadRequestException,
    UseInterceptors,
    UploadedFile,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { AuthGuard } from "@nestjs/passport"
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger"

// Other dependencies
import * as concat from "concat-stream"

// Local files
import { JwtAuthGuard } from "src/shared/guards/role.guard"
import { jwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { ValidationPipe } from "../../../shared/pipes/validation.pipe"
import { MediaService } from "../service/media.service"

@ApiTags("v1/media")
@Controller("v1/media")
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @Post("")
    @UseInterceptors(FileInterceptor("file"))
    @ApiOperation({ summary: "upload media" })
    async uploadMedia(
        @Headers("authorization") bearer: string,
        @UploadedFile() file,
        @Body() body,
    ) {
        return this.mediaService.uploadMedia(
            jwtManipulationService.decodeJwtToken(bearer, "id"),
            file,
            body,
        )
    }
}
