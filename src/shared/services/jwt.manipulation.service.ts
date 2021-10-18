import { UnauthorizedException, BadRequestException } from "@nestjs/common"

import * as jwt from "jsonwebtoken"

import { configService } from "./config.service"
import { IGenerateJwtToken } from "./type"
export class JwtManipulationService {
    decodeJwtToken(token: string, property = "all") {
        try {
            if (!token) throw new Error()
            try {
                const decodedJwtData = jwt.verify(
                    token.split(" ")[1],
                    configService.getEnv("JWT_TOKEN"),
                ) as jwt.JwtPayload
                if (property === "all") return decodedJwtData
                else return decodedJwtData[property]
            } catch (err) {
                throw new BadRequestException("Token signature is not valid")
            }
        } catch {
            throw new UnauthorizedException()
        }
    }

    generateJwtToken(tokenInfo: IGenerateJwtToken) {
        return jwt.sign(tokenInfo, configService.getEnv("JWT_TOKEN"))
    }
}

const jwtManipulationService = new JwtManipulationService()

export { jwtManipulationService }
