import * as dotenv from "dotenv"
dotenv.config()

class ConfigService {
    public getEnv(key: string): string {
        return process.env[key]
    }
}

export const configService = new ConfigService()
