import Database from "@tauri-apps/plugin-sql";

import { Workout } from "./Workout.svelte";

export class DB {
    db?: Database = $state(undefined);

    constructor() {}

    async conn(): Promise<Database> {
        if (!this.db) {
            await this.init();
        }
        return this.db!;
    }

    async init() {
        try {
            this.db = await Database.load("sqlite:data.db");

            await Workout.initTable();
            // await insertTestData(this.db);
        } catch (err) {
            console.error("Error initializing DB:", err);
        }
    }
}

const database = new DB();
database.init();
export default database;
