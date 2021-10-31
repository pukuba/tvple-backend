import { InjectRepository } from "@nestjs/typeorm"
import { PassportStrategy } from "@nestjs/passport"
import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    ConsoleLogger,
} from "@nestjs/common"

import { ExtractJwt, Strategy } from "passport-jwt"

import { UserRepository } from "src/shared/repositories/user.repository"
import { configService } from "src/shared/services/config.service"
import { UserEntity } from "src/shared/entities/user.entity"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getEnv("JWT_TOKEN"),
            ignoreExpiration: false,
        })
    }

    async validate({ iat, exp, id }): Promise<any> {
        const timeDiff = exp - iat
        if (timeDiff <= 0) {
            throw new UnauthorizedException()
        }
        try {
            const user = await this.userRepository.findOneOrFail({ id })
            return {
                id: user.id,
                username: user.username,
            }
        } catch {
            throw new UnauthorizedException()
        }
    }
}
