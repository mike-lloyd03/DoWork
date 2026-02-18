import Database from "@tauri-apps/plugin-sql";

import { Workout } from "./Workout";
import { insertTestData } from "./testData";

export class DB {
    private db: Database | null = null;

    constructor() {}

    conn(): Database {
        if (!this.db) {
            this.init();
        }
        return this.db!;
    }

    async init() {
        try {
            this.db = await Database.load("sqlite:data.db");

            await Workout.initTable(this.db);
            insertTestData(this.db);
        } catch (err) {
            console.error("Error initializing DB:", err);
        }
    }
}

const database = new DB();
database.init();
export default database;
