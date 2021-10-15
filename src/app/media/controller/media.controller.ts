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
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { JwtAuthGuard } from "src/shared/guards/role.guard"
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger"
import * as concat from "concat-stream"
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
    @ApiOperation({ summary: "upload media" })
    async uploadMedia(@Headers("authorization") bearer: string, @Req() req) {
        return new Promise((resolve, reject) => {
            const payload: any = {}
            let media: Buffer

            const fileHandler = async (
                _field,
                file,
                _filename,
                _encoding,
                mimetype,
            ) => {
                if (mimetype !== "video/mp4") {
                    reject(new BadRequestException("File must be mp4"))
                    return
                }
                file.pipe(concat((buffer) => (media = buffer)))
            }

            const mpForm = req.multipart(fileHandler, async (error) => {
                if (error) {
                    reject(
                        new BadRequestException("Not valid multipart request"),
                    )
                }
                try {
                    const id = jwtManipulationService.decodeJwtToken(
                        bearer,
                        "id",
                    )
                    this.mediaService.uploadMedia(id, payload, media)
                } catch (e) {
                    reject(e)
                }
            })

            mpForm.on("field", (key, value) => {
                payload[key] = value
            })
        })
    }
}
