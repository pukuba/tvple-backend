// Nest dependencies
import { APP_GUARD } from "@nestjs/core"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

// Local files
import { JwtModule } from "@nestjs/jwt"
import { MediaController } from "./controller/media.controller"
import { UserEntity } from "../../shared/entities/user.entity"
import { MediaService } from "./service/media.service"
import { PassportModule } from "@nestjs/passport"
import { UserRepository } from "src/shared/repositories/user.repository"
import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { configService } from "src/shared/Services/config.service"
import { MessageService } from "src/shared/services/message.service"
import { RedisService } from "src/shared/Services/redis.service"
import { AwsService } from "src/shared/services/aws.service"
import { JwtAuthGuard } from "src/shared/guards/role.guard"

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    controllers: [MediaController],
    providers: [MediaService, AwsService],
    exports: [MediaService],
})
export class MediaModule {}
