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
import { MediaService } from "../service/media.service"
import { MediaEntity } from "src/shared/entities/media.entity"
import {
    UploadMediaDto,
    UpdateMediaDto,
    SearchMediaDto,
    SearchMediaResponseDto,
    MediaEntityResponseDto,
} from "../dto"

@ApiTags("v1/media")
@Controller("v1/media")
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Get("/search")
    @ApiOperation({ summary: "미디어 검색" })
    @ApiQuery({ type: SearchMediaDto })
    @ApiOkResponse({ type: SearchMediaResponseDto, description: "검색 성공" })
    async searchMedia(@Query() searchMediaDto: SearchMediaDto) {
        return this.mediaService.searchMedia(
            searchMediaDto.page,
            searchMediaDto.keyword,
        )
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @Post("/upload")
    @UseInterceptors(FileInterceptor("file"))
    @ApiOperation({ summary: "미디어 업로드" })
    @ApiConsumes("multipart/form-data")
    @ApiBody({ type: UploadMediaDto })
    @ApiCreatedResponse({
        type: MediaEntityResponseDto,
        description: "업로드 성공",
    })
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

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @Post("/like/:mediaId")
    @ApiOperation({ summary: "미디어 좋아요 상태 변경" })
    @ApiOkResponse({
        type: MediaEntityResponseDto,
        description: "좋아요 상태 변경 성공",
    })
    @ApiBearerAuth()
    async likeMedia(
        @Headers("authorization") bearer: string,
        @Param("mediaId") mediaId: string,
    ) {
        return this.mediaService.likeMedia(
            jwtManipulationService.decodeJwtToken(bearer, "id"),
            mediaId,
        )
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @Get("/like/list/:page")
    @ApiOperation({ summary: "좋아요 목록 가져오기" })
    @ApiOkResponse({
        type: SearchMediaResponseDto,
        description: "좋아요 목록 가져오기 성공",
    })
    async getLikeByMedia(
        @Headers("authorization") bearer: string,
        @Param("page", ParseIntPipe) page: number = 1,
    ) {
        return this.mediaService.getLikeByMedia(
            jwtManipulationService.decodeJwtToken(bearer, "id"),
            page,
        )
    }

    @Get(":mediaId")
    @ApiOperation({ summary: "동영상 정보 가져오기" })
    @ApiOkResponse({
        type: MediaEntityResponseDto,
        description: "미디어 정보 가져오기 성공",
    })
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

    @Delete(":mediaId")
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({ summary: "미디어를 삭제" })
    @ApiOkResponse({ description: "미디어 삭제 성공" })
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
    @ApiOkResponse({
        type: MediaEntityResponseDto,
        description: "미디어 수정 성공",
    })
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
