import * as dotenv from "dotenv"
dotenv.config()

export default {
    PHONE_NUMBER: process.env.PHONE_NUMBER,
    NCP_SECRET_KEY: process.env.NCP_SECRET_KEY,
    NCP_ACCESS_KEY: process.env.NCP_ACCESS_KEY,
    NCP_SMS_KEY: process.env.NCP_SMS_KEY,
    REDIS_HOST: process.env.REDIS_HOST || "redis://127.0.0.1",
    JWT_TOKEN: process.env.JWT_TOKEN || "apple/heap",
}
