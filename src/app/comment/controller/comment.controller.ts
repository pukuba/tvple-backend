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
    ParseIntPipe,
    Header,
} from "@nestjs/common"
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBody,
    ApiParam,
} from "@nestjs/swagger"
import { AuthGuard } from "@nestjs/passport"

// Local files
import {
    CreateCommentDto,
    CreateCommentResponseDto,
    DeleteCommentResponseDto,
    GetCommentDto,
} from "../dto"
import { CommentService } from "../service/comment.service"
import { jwtManipulationService } from "src/shared/services/jwt.manipulation.service"

@ApiTags("v1/comment")
@Controller("v1/comment")
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post("/")
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({ summary: "댓글 작성" })
    @ApiCreatedResponse({
        type: CreateCommentResponseDto,
        description: "댓글 작성 성공",
    })
    @ApiBody({ type: CreateCommentDto })
    async createMedia(
        @Body() body: CreateCommentDto,
        @Headers("authorization") bearer: string,
    ) {
        return this.commentService.createComment(
            body,
            jwtManipulationService.decodeJwtToken(bearer, "id"),
        )
    }

    @Delete("/:commentId")
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOperation({ summary: "댓글 삭제" })
    @ApiOkResponse({
        description: "정상적으로 삭제되었습니다",
        type: DeleteCommentResponseDto,
    })
    @ApiParam({ name: "commentId", type: "string", required: true })
    async deleteComment(
        @Param("commentId") commentId: string,
        @Headers("authorization") bearer: string,
    ) {
        return this.commentService.deleteComment(
            commentId,
            jwtManipulationService.decodeJwtToken(bearer, "id"),
        )
    }

    @Get("/:mediaId")
    @ApiOperation({ summary: "댓글 목록" })
    @ApiOkResponse({
        description: "정상적으로 가져왔습니다",
        type: GetCommentDto,
    })
    @ApiParam({ name: "mediaId", type: "string", required: true })
    async getComment(@Param("mediaId") mediaId: string) {
        return this.commentService.getCommentByMediaId(mediaId)
    }
}
