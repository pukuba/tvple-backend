import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthController } from "./controller/auth.controller"
import { UserEntity } from "../../shared/entities/users.entity"
import { AuthService } from "./service/auth.service"
import { RedisService } from "src/shared/Services/redis.service"
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [
        AuthService,
        RedisService
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
// implements NestModule {
// public configure(consumer: MiddlewareConsumer) {
//   consumer
//     .apply(AuthMiddleware)
//     .forRoutes({ path: 'user', method: RequestMethod.GET }, { path: 'path', method: RequestMethod.PUT })
// }
// }
