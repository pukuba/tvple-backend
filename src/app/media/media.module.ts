// Nest dependencies
import { APP_GUARD } from "@nestjs/core"
import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

// Local files
import { MediaController } from "./controller/media.controller"
import { UserEntity } from "../../shared/entities/user.entity"
import { MediaService } from "./service/media.service"
import { UserRepository } from "src/shared/repositories/user.repository"
import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { AwsService } from "src/shared/services/aws.service"
import { JwtAuthGuard } from "src/shared/guards/role.guard"
import { MediaRepository } from "src/shared/repositories/media.repository"
import { MediaEntity } from "src/shared/entities/media.entity"
import { LikeRepository } from "src/shared/repositories/like.repository"
import { RedisService } from "src/shared/services/redis.service"
import { configService } from "src/shared/services/config.service"
import { BlacklistMiddleware } from "src/shared/middleware/blacklist.middleware"
@Module({
    imports: [
        TypeOrmModule.forFeature([
            MediaEntity,
            MediaRepository,
            UserRepository,
            LikeRepository,
        ]),
    ],
    controllers: [MediaController],
    providers: [MediaService, AwsService, RedisService],
    exports: [MediaService],
})
export class MediaModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(BlacklistMiddleware).forRoutes(
            {
                path: "v1/media/like/:mediaId",
                method: RequestMethod.POST,
            },
            {
                path: "v1/media/upload",
                method: RequestMethod.POST,
            },
            {
                path: "v1/media/:mediaId",
                method: RequestMethod.DELETE,
            },
            {
                path: "v1/media/:mediaId",
                method: RequestMethod.PATCH,
            },
            {
                path: "v1/like/list/:page",
                method: RequestMethod.GET,
            },
        )
    }
}
