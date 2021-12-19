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
} from "@nestjs/swagger"
import { AuthGuard } from "@nestjs/passport"

// Local files
import { CreateCommentDto, CreateCommentResponseDto } from "../dto"
import { JwtAuthGuard } from "src/shared/guards/role.guard"
import { CommentService } from "../service/comment.service"
import { jwtManipulationService } from "src/shared/services/jwt.manipulation.service"

@ApiTags("v1/comment")
@Controller("v1/comment")
export class AuthController {
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
}
