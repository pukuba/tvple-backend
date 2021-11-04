import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { JwtModule } from "@nestjs/jwt"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthController } from "./controller/auth.controller"
import { UserEntity } from "../../shared/entities/user.entity"
import { AuthService } from "./service/auth.service"
import { PassportModule } from "@nestjs/passport"
import { UserRepository } from "src/shared/repositories/user.repository"
import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { configService } from "src/shared/services/config.service"
import { MessageService } from "src/shared/services/message.service"
import { RedisService } from "src/shared/services/redis.service"
import { JwtStrategy } from "./strategy/jwt.strategy"
import { JwtAuthGuard } from "src/shared/guards/role.guard"
import { BlacklistMiddleware } from "src/shared/middleware/blacklist.middleware"
@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserRepository]),
        PassportModule,
        JwtModule.register({
            secret: configService.getEnv("JWT_TOKEN"),
        }),
    ],
    providers: [
        AuthService,
        RedisService,
        MessageService,
        JwtManipulationService,
        JwtStrategy,
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(BlacklistMiddleware).forRoutes({
            path: "v1/auth/sign-out",
            method: RequestMethod.DELETE,
        })
    }
}
