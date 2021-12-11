// Nest dependencies
import { APP_GUARD } from "@nestjs/core"
import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

// Local files
import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { AwsService } from "src/shared/services/aws.service"
import { JwtAuthGuard } from "src/shared/guards/role.guard"
import { configService } from "src/shared/services/config.service"
import { BlacklistMiddleware } from "src/shared/middleware/blacklist.middleware"
import { HealthController } from "./controller/health.controller"
import { RedisService } from "src/shared/services/redis.service"
@Module({
    imports: [TypeOrmModule.forFeature([])],
    controllers: [HealthController],
    providers: [RedisService],
    exports: [],
})
export class HealthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(BlacklistMiddleware).forRoutes({
            path: "v1/health/auth",
            method: RequestMethod.GET,
        })
    }
}
