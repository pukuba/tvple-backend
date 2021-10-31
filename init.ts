import * as fs from "fs"
import * as env from "dotenv"
env.config()

const data = {
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    username: process.env.USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "test",
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/migrations/**/*{.js,.ts}"],
    synchronize: true,
}

fs.writeFileSync("./ormconfig.json", JSON.stringify(data), "utf-8")
