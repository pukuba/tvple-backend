// Nest dependencies
import { APP_GUARD } from "@nestjs/core"
import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

// Local files
import { UserController } from "./controller/user.controller"
import { UserEntity } from "../../shared/entities/user.entity"
import { UserService } from "./service/user.service"
import { UserRepository } from "src/shared/repositories/user.repository"
import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { BlacklistMiddleware } from "src/shared/middleware/blacklist.middleware"
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, UserRepository])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer.apply(BlacklistMiddleware).forRoutes()
    // }
}
