// Nest dependencies
import { APP_GUARD } from "@nestjs/core"
import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

// Local files
import { CommentController } from "./controller/comment.controller"
import { UserEntity } from "../../shared/entities/user.entity"
import { CommentService } from "./service/comment.service"
import { UserRepository } from "src/shared/repositories/user.repository"
import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { AwsService } from "src/shared/services/aws.service"
import { JwtAuthGuard } from "src/shared/guards/role.guard"
import { MediaRepository } from "src/shared/repositories/media.repository"
import { MediaEntity } from "src/shared/entities/media.entity"
import { LikeRepository } from "src/shared/repositories/like.repository"
import { RedisService } from "src/shared/services/redis.service"
import { CommentRepository } from "src/shared/repositories/comment.repository"
import { BlacklistMiddleware } from "src/shared/middleware/blacklist.middleware"
import { CommentEntity } from "src/shared/entities/comment.entity"
@Module({
    imports: [
        TypeOrmModule.forFeature([
            MediaRepository,
            UserRepository,
            CommentEntity,
            CommentRepository,
        ]),
    ],
    controllers: [CommentController],
    providers: [CommentService, RedisService],
    exports: [CommentService],
})
export class CommentModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(BlacklistMiddleware).forRoutes(
            {
                path: "v1/comment/:mediaId",
                method: RequestMethod.POST,
            },
            {
                path: "v1/comment/:commentId",
                method: RequestMethod.DELETE,
            },
        )
    }
}
