/* src/utils/testing-helpers/createMemDB.js */
import { createConnection, EntitySchema } from "typeorm"
type Entity = Function | string | EntitySchema<any>

export async function createMemDB(entities: Entity[]) {
    return createConnection({
        // name, // let TypeORM manage the connections
        type: "mysql",
        database: "test",
        username: "travis",
        entities,
        dropSchema: true,
        synchronize: true,
        logging: false,
    })
}
