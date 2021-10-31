import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
    Request,
    Response,
} from "@nestjs/common"
import { RedisService } from "../services/redis.service"

@Injectable()
export class BlacklistMiddleware implements NestMiddleware {
    constructor(private readonly redisService: RedisService) {}

    async use(@Request() req, @Response() _res, next: Function) {
        const token = req.headers.authorization.split(" ")[1]
        const isTokenDead = await this.redisService.getData(
            `blacklist-${token}`,
        )

        if (isTokenDead !== null) {
            throw new UnauthorizedException()
        }
        next()
    }
}
