// Other dependencies
import * as request from "supertest"

// Local files
import { jwtManipulationService } from "src/shared/services/jwt.manipulation.service"
import { configService } from "../src/shared/services/config.service"
export const beforeRegister = async (app) => {
    const verificationToken = jwtManipulationService.generateJwtToken({
        phoneNumber: configService.getEnv("PUKUBA_PHONENUMBER") as string,
        exp: Math.floor(Date.now() / 1000) + 60 * 15,
    })
    const { body } = await request(app.getHttpServer())
        .post("/v1/auth/sign-up")
        .set({ "Content-Type": "application/json" })
        .send({
            phoneNumber: configService.getEnv("PUKUBA_PHONENUMBER") as string,
            verificationToken,
            id: "pukuba",
            password: "test1234!@",
            username: "pukuba",
        })
        .expect(201)
    return `Bearer ${body.accessToken}`
}

export const afterDeleteAccount = async (app, token: string) => {
    await request(app.getHttpServer())
        .delete("/v1/auth/account")
        .set({ "Content-Type": "application/json" })
        .set({ Authorization: token })
        .send({
            id: "pukuba",
            password: "test1234!@",
        })
        .expect(200)
}
