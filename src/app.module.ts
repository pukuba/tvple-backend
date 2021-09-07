import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppController } from "./app.controller"
import { Connection } from "typeorm"
import { UserModule } from "./app/user/user.module"
import { ConfigModule } from "@nestjs/config"
import { AuthService } from "./auth/auth.service"
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(),
        UserModule,
    ],
    controllers: [AppController],
    providers: [AuthService],
})
export class ApplicationModule {
    constructor(private readonly connection: Connection) {}
}
