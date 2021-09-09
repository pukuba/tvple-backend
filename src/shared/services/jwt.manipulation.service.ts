import { UnauthorizedException, BadRequestException } from "@nestjs/common"

import * as jwt from "jsonwebtoken"

import { configService } from "./config.service"
import { IGenerateJwtToken } from "./type"
export class JwtManipulationService {
    decodeJwtToken(token: string) {
        try {
            if (!token) throw new Error()
            try {
                const decodedJwtData = jwt.verify(
                    token.split(" ")[1],
                    configService.getEnv("JWT_TOKEN"),
                )
                return decodedJwtData
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
