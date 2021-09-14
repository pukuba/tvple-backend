import {
    Module,
    Global,
    MiddlewareConsumer,
    RequestMethod,
} from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppController } from "./app.controller"
import { Connection } from "typeorm"
import { AuthModule } from "./app/auth/auth.module"
import { ConfigModule } from "@nestjs/config"
import { AuthService } from "./app/auth/service/auth.service"
import { RedisService } from "./shared/Services/redis.service"
import { BlacklistMiddleware } from "src/shared/Middleware/blacklist.middleware"
@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [RedisService],
})
export class ApplicationModule {
    constructor(private readonly connection: Connection) {}
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(BlacklistMiddleware).forRoutes({
            path: "v1/auth/sign-out",
            method: RequestMethod.DELETE,
        })
    }
}
