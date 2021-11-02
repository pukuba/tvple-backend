// Nest dependencies
import { TypeOrmModule } from "@nestjs/typeorm"
import { Test, TestingModule } from "@nestjs/testing"

// Other dependencies

import { Connection, Repository } from "typeorm"
import { deepStrictEqual as equal } from "assert"
// Local files
import { MediaService } from "./media.service"
import { MediaController } from "../controller/media.controller"
import { JwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { MessageService } from "src/shared/services/message.service"
import { RedisService } from "src/shared/Services/redis.service"
import { MediaModule } from "../media.module"
import { UserRepository } from "src/shared/repositories/user.repository"
describe("UserService", () => {
    let service: MediaService
    let userDb: UserRepository
    let token: string
    before(async () => {
        const module = await Test.createTestingModule({
            imports: [
                MediaModule,
                TypeOrmModule.forRoot({
                    type: "mysql",
                    username: "travis",
                    database: "test",
                    entities: ["./**/*.entity.ts"],
                    synchronize: true,
                }),
            ],
        }).compile()
        service = module.get<MediaService>(MediaService)
        userDb = module.get<UserRepository>(UserRepository)
    })
})
