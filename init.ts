import * as fs from "fs"
import * as env from "dotenv"
env.config()

const data = {
    type: "mysql",
    host: process.env.DB_HOST || "127.0.0.1",
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "test",
    keepConnectionAlive: process.env.NODE_ENV === "test",
    port: process.env.DB_PORT || "3306",
    entities: [
        process.env.NODE_ENV === "dev"
            ? "dist/**/*.entity{.ts,.js}"
            : "src/**/*.entity{.ts,.js}",
    ],
    synchronize: true,
}

fs.writeFileSync("./ormconfig.json", JSON.stringify(data), "utf-8")
