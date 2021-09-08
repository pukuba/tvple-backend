import * as Redis from "ioredis"

import { configService } from "./config.service"

export class RedisService {
    private redisConnection() {
        return new Redis({
            host: configService.getEnv("REDIS_HOST") || "127.0.0.1",
        })
    }

    async setData(key: string, value: string, expireTime?: number) {
        if (expireTime) {
            await this.redisConnection().set(key, value, "EX", expireTime)
        } else {
            await this.redisConnection().set(key, value)
        }
    }

    async setOnlyKey(key: string, expireTime?: number) {
        if (expireTime) {
            await this.redisConnection().set(key, null, "EX", expireTime)
        } else {
            await this.redisConnection().set(key, null)
        }
    }

    async getData(key: string) {
        return await this.redisConnection().get(key)
    }

    async deleteData(key: string) {
        await this.redisConnection().del(key)
    }
}
