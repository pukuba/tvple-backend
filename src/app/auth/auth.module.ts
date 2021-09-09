import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common"
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthController } from "./controller/auth.controller"
import { UserEntity } from "../../shared/entities/users.entity"
import { AuthService } from "./service/auth.service"
import { PassportModule } from '@nestjs/passport'
import { UserRepository } from "src/shared/repositories/user.repository"
import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { configService } from 'src/shared/Services/config.service'
import { MessageService } from "src/shared/services/message.service"
import { RedisService } from "src/shared/Services/redis.service"
@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserRepository]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: () => {
                return {
                    secret: configService.getEnv('JWT_TOKEN'),
                }
            },
        }),
    ],
    providers: [
        AuthService,
        RedisService,
        MessageService,
        JwtManipulationService,
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
