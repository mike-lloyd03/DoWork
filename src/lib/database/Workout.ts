import Database from "@tauri-apps/plugin-sql";

export interface WorkoutModel {
    id?: number;
    date: string;
    type: "A" | "B";
    exercises: {
        lift: Lift;
        type: "warmup" | "working";
        sets: {
            weight: number;
            targetReps: number;
            completedReps: number;
        }[];
    }[];
    notes?: string;
}

export type Lift = "squat" | "benchPress" | "barbellRow" | "ohp" | "deadlift";

export class Workout {
    data: WorkoutModel;

    constructor(data: WorkoutModel) {
        this.data = data;
    }

    static async initTable(db: Database) {
        console.log("Initializing workouts table");

        const sql = `
            CREATE TABLE IF NOT EXISTS workouts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                type TEXT NOT NULL,
                exercise_data TEXT NOT NULL,
                notes TEXT
            );
        `;
        await db.execute(sql);
    }

    async create(db: Database) {
        const stmt =
            "INSERT INTO workouts (date, type, exercise_data, notes) VALUES ($1, $2, $3, $4)";
        await db.execute(stmt, [
            this.data.date,
            this.data.type,
            JSON.stringify(this.data.exercises),
            this.data.notes,
        ]);

        // if (resp.changes && resp.changes.lastId) {
        //     this.data.id = resp.changes.lastId;
        // }
    }

    static async get(db: Database, id: number): Promise<Workout> {
        const stmt = "SELECT * FROM workouts WHERE id = ? LIMIT 1";
        const resp: WorkoutModel[] = await db.select(stmt, [id]);

        if (resp.length > 0) {
            return new Workout(resp[0]);
        }
        throw null;
    }

    static async getAll(db: Database): Promise<Workout[]> {
        const stmt = "SELECT * FROM workouts ORDER BY date DESC";
        const resp: WorkoutModel[] = await db.select(stmt);

        return (resp || []).map((row) => {
            return new Workout(row);
        });
    }

    async update(db: Database) {
        const stmt =
            "UPDATE workouts SET date = ?, type = ?, exercise_data = ?, notes = ? WHERE id = ?";
        await db.execute(stmt, [
            this.data.date,
            this.data.type,
            JSON.stringify(this.data.exercises),
            this.data.notes,
            this.data.id,
        ]);
    }

    async delete(db: Database) {
        const stmt = "DELETE FROM workouts WHERE id = ?";
        db.execute(stmt, [this.data.id]);
    }

    static async getMaxLift(db: Database, liftName: Lift): Promise<number> {
        const sql = `
        SELECT MAX(CAST(sets.value ->> 'weight' AS REAL)) as max_weight
        FROM workouts,
             json_each(workouts.exercise_data) as exercise,
             json_each(exercise.value -> 'sets') as sets
        WHERE 
             exercise.value ->> 'lift' = ? 
             AND sets.value ->> 'completed_reps' = sets.value ->> 'target_reps'
             `;

        const res: { max_weight: number } = await db.select(sql, [liftName]);

        return res.max_weight;
    }
}
