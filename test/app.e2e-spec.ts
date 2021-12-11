import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import * as request from "supertest"
import { ApplicationModule } from "./../src/app.module"

describe("AppController (e2e)", () => {
    let app: INestApplication

    before(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ApplicationModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    describe("NestHealth", () => {
        it("/ (GET)", async () => {
            await request(app.getHttpServer())
                .get("/")
                .expect(200)
                .expect("Server Running")
        })
    })
})
