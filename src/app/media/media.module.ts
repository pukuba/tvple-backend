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
import { RedisService } from "src/shared/services/redis.service"
import { configService } from "src/shared/services/config.service"
import { BlacklistMiddleware } from "src/shared/middleware/blacklist.middleware"
@Module({
    imports: [
        TypeOrmModule.forFeature([
            MediaEntity,
            MediaRepository,
            UserRepository,
        ]),
    ],
    controllers: [MediaController],
    providers: [MediaService, AwsService, RedisService],
    exports: [MediaService],
})
export class MediaModule {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer.apply(BlacklistMiddleware).forRoutes({
    //         path: "v1/auth/sign-out",
    //         method: RequestMethod.DELETE,
    //     })
    // }
}
