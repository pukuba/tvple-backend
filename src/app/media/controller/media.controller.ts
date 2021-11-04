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
} from "@nestjs/swagger"

// Other dependencies
import * as concat from "concat-stream"

// Local files
import { JwtAuthGuard } from "src/shared/guards/role.guard"
import { jwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { ValidationPipe } from "../../../shared/pipes/validation.pipe"
import { MediaService } from "../service/media.service"
import { UploadMediaDto, UpdateMediaDto } from "../dto"

@ApiTags("v1/media")
@Controller("v1/media")
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @Post("")
    @UseInterceptors(FileInterceptor("file"))
    @ApiOperation({ summary: "upload media" })
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: UploadMediaDto })
    async uploadMedia(
        @Headers("authorization") bearer: string,
        @UploadedFile() file,
        @Body() body: UploadMediaDto,
    ) {
        return this.mediaService.uploadMedia(
            jwtManipulationService.decodeJwtToken(bearer, "id"),
            file,
            body,
        )
    }

    @Get(":mediaId")
    @ApiOperation({ summary: "get media" })
    async getMedia(
        @Ip() ip: string,
        @Param("mediaId") mediaId: string,
        @Headers("authorization") bearer: string,
    ) {
        let userId: string | undefined = undefined
        try {
            userId = jwtManipulationService.decodeJwtToken(bearer, "id")
        } catch {
            userId = undefined
        }
        return this.mediaService.getMedia(mediaId, ip, userId)
    }

    @Get("/search")
    @ApiOperation({ summary: "get all media" })
    async searchMedia(@Query() { page, keyword }) {
        return this.mediaService.searchMedia(page, keyword)
    }

    @Delete(":mediaId")
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({ summary: "영상을 삭제" })
    async deleteMedia(
        @Headers("authorization") bearer: string,
        @Param("mediaId") mediaId: string,
    ) {
        return this.mediaService.deleteMedia(
            jwtManipulationService.decodeJwtToken(bearer, "id"),
            mediaId,
        )
    }

    @Patch(":mediaId")
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({ summary: "영상을 수정" })
    async updateMedia(
        @Headers("authorization") bearer: string,
        @Param("mediaId") mediaId: string,
        @Body() body: UpdateMediaDto,
    ) {
        return this.mediaService.updateMedia(
            jwtManipulationService.decodeJwtToken(bearer, "id"),
            mediaId,
            body,
        )
    }
}
