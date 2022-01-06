// Nest dependencies

import { TypeOrmModule } from "@nestjs/typeorm"
import { Test } from "@nestjs/testing"
import {} from "@nestjs/common"

// Other dependencies
import { deepStrictEqual as equal } from "assert"

// Local files
import { UserService } from "./user.service"
import { UserRepository } from "src/shared/repositories/user.repository"
import { UserModule } from "../user.module"
import { jwtManipulationService } from "src/shared/services/jwt.manipulation.service"

describe("UserService", () => {
    let service: UserService
    let userDb: UserRepository
    let token: string
    before(async () => {
        const module = await Test.createTestingModule({
            imports: [
                UserModule,
                TypeOrmModule.forRoot({
                    type: "mysql",
                    username: "travis",
                    database: "test",
                    entities: ["./**/*.entity.ts"],
                    keepConnectionAlive: true,
                    synchronize: true,
                }),
            ],
        }).compile()
        service = module.get<UserService>(UserService)
        userDb = module.get<UserRepository>(UserRepository)
        await userDb.createUser({
            username: "test",
            password: "testtest1@@",
            id: "test",
            phoneNumber: "01000000000",
            verificationToken: "01010101010",
        })
        token = jwtManipulationService.generateJwtToken({
            id: "test",
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        })
    })
    describe("getUserListbyUsername", () => {
        it("should be return http status 200", async () => {
            const user = await service.getUserListbyUsername("test", 1)
            equal(user.count, 1)
            equal(user.data.length, 1)
            equal(user.data[0].id, "test")
        })
    })
    after(async () => {
        await userDb.query("delete from user")
    })
})
