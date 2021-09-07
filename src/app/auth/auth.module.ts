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
    providers: [AuthService, RedisService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
