import { roundToEasyLoad } from "$lib/utils";
import Database from "@tauri-apps/plugin-sql";
import { DateTime } from "luxon";

export interface WorkoutDB {
    id?: number;
    startTime: string;
    endTime?: string;
    type: WorkoutType;
    exerciseData: string;
    notes?: string;
}

export interface WorkoutModel {
    id?: number;
    startTime?: DateTime;
    endTime?: DateTime;
    type: WorkoutType;
    exercises: Exercise[];
    notes?: string;
}

export interface Exercise {
    lift: Lift;
    warmupSets: Set[];
    workingSets: Set[];
    workingWeight: number;
    success?: boolean;
}

export interface Set {
    weight: number;
    targetReps: number;
    completedReps: number | null;
}

export type Lift = "squat" | "benchPress" | "barbellRow" | "ohp" | "deadlift";
export type WorkoutType = "A" | "B";

export class Workout {
    data: WorkoutModel;

    constructor(data: WorkoutModel) {
        this.data = data;
    }

    static async initTable(db: Database) {
        console.log("Initializing workouts table");
        // await db.execute("DROP TABLE workouts");

        const sql = `
            CREATE TABLE IF NOT EXISTS workouts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                startTime TEXT,
                endTime TEXT,
                type TEXT NOT NULL,
                exerciseData TEXT NOT NULL,
                notes TEXT
            );
        `;
        await db.execute(sql);
    }

    static fromDB(data: WorkoutDB) {
        const model: WorkoutModel = {
            id: data.id,
            startTime: DateTime.fromISO(data.startTime),
            endTime: data.endTime
                ? DateTime.fromISO(data.startTime)
                : undefined,
            type: data.type,
            notes: data.notes,
            exercises: JSON.parse(data.exerciseData),
        };
        return new Workout(model);
    }

    async create(db: Database) {
        this.checkSuccess();
        const stmt =
            "INSERT INTO workouts (startTime, endTime, type, exerciseData, notes) VALUES (?, ?, ?, ?, ?)";
        await db.execute(stmt, [
            this.data.startTime?.toISO() ?? undefined,
            this.data.endTime?.toISO() ?? undefined,
            this.data.type,
            JSON.stringify(this.data.exercises),
            this.data.notes,
        ]);

        // if (resp.changes && resp.changes.lastId) {
        //     this.data.id = resp.changes.lastId;
        // }
    }

    static async get(db: Database, id: number): Promise<Workout | null> {
        const stmt = "SELECT * FROM workouts WHERE id = ? LIMIT 1";
        const resp: WorkoutDB[] = await db.select(stmt, [id]);

        if (resp.length > 0) {
            return Workout.fromDB(resp[0]);
        }
        return null;
    }

    static async getAll(db: Database): Promise<Workout[]> {
        const stmt = "SELECT * FROM workouts ORDER BY startTime DESC";
        const resp: WorkoutDB[] = await db.select(stmt);

        return (resp || []).map((row) => {
            return Workout.fromDB(row);
        });
    }

    async update(db: Database) {
        this.checkSuccess();
        const stmt =
            "UPDATE workouts SET startTime = ?, endTime = ?, type = ?, exerciseData = ?, notes = ? WHERE id = ?";
        await db.execute(stmt, [
            this.data.startTime?.toISO() ?? undefined,
            this.data.endTime?.toISO() ?? undefined,
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

    checkSuccess() {
        this.data.exercises.forEach((e, i) => {
            this.data.exercises[i].success = e.workingSets.every(
                (s) => s.completedReps === s.targetReps,
            );
        });
    }

    static async getMaxLift(db: Database, liftName: Lift): Promise<number> {
        const sql = `
    SELECT MAX(CAST(sets.value ->> 'weight' AS REAL)) as max_weight
    FROM workouts,
         json_each(workouts.exerciseData) as exercise,
         json_each(exercise.value -> 'workingSets') as sets
    WHERE 
         exercise.value ->> 'lift' = $1 
         AND sets.value ->> 'completedReps' = sets.value ->> 'targetReps'
    `;

        const res: { max_weight: number }[] = await db.select(sql, [liftName]);

        if (res && res.length > 0 && res[0].max_weight) {
            return res[0].max_weight;
        }

        return 0;
    }

    static async getMostRecentLift(db: Database, lift: Lift): Promise<number> {
        const sql = `
    SELECT CAST(exercise.value ->> 'workingWeight' AS REAL) as recent_weight
    FROM workouts,
         json_each(workouts.exerciseData) as exercise
    WHERE 
         exercise.value ->> 'lift' = $1 
         AND exercise.value ->> 'success' = 1
    ORDER BY workouts.startTime DESC
    LIMIT 1
    `;

        const res: { recent_weight: number }[] = await db.select(sql, [lift]);

        if (res && res.length > 0) {
            return res[0].recent_weight;
        }

        return 0;
    }

    static async getLast(
        db: Database,
        type: WorkoutType | undefined = undefined,
    ): Promise<Workout | null> {
        if (type) {
            const stmt =
                "SELECT * FROM workouts WHERE type = ? ORDER BY startTime DESC LIMIT 1";

            const resp: WorkoutDB[] = await db.select(stmt, [type]);

            if (resp.length > 0) {
                return Workout.fromDB(resp[0]);
            }
        } else {
            const stmt =
                "SELECT * FROM workouts ORDER BY startTime DESC LIMIT 1";

            const resp: WorkoutDB[] = await db.select(stmt);

            if (resp.length > 0) {
                return Workout.fromDB(resp[0]);
            }
        }
        return null;
    }

    static async getActive(db: Database) {
        const stmt =
            "SELECT * FROM workouts WHERE endTime is null ORDER BY startTime DESC LIMIT 1";

        const resp: WorkoutDB[] = await db.select(stmt);

        if (resp.length > 0) {
            return Workout.fromDB(resp[0]);
        }
        return null;
    }

    static async createNext(db: Database): Promise<Workout | null> {
        const lastWorkout = await this.getLast(db);
        if (!lastWorkout) {
            return null;
        }
        const nextWorkoutType = lastWorkout.data.type == "A" ? "B" : "A";
        return this.generateWorkout(db, nextWorkoutType);
    }

    static async generateWorkout(
        db: Database,
        type: WorkoutType,
    ): Promise<Workout> {
        const exercises: Exercise[] = [];

        if (type == "B") {
            const squatSets = await this.generateExercise(db, "squat");
            const ohpSets = await this.generateExercise(db, "ohp");
            const deadliftSets = await this.generateExercise(db, "deadlift");
            exercises.push(squatSets);
            exercises.push(ohpSets);
            exercises.push(deadliftSets);
        } else {
            const squatSets = await this.generateExercise(db, "squat");
            const benchPressSets = await this.generateExercise(
                db,
                "benchPress",
            );
            const barbellRowSets = await this.generateExercise(
                db,
                "barbellRow",
            );
            exercises.push(squatSets);
            exercises.push(benchPressSets);
            exercises.push(barbellRowSets);
        }

        return new Workout({
            type,
            exercises,
        });
    }

    static async generateExercise(db: Database, lift: Lift): Promise<Exercise> {
        let mostRecentWeight = await this.getMostRecentLift(db, lift);
        let workingWeight = mostRecentWeight + 5;

        const workingSets = this.generateWorkingSets(lift, workingWeight);
        const warmupSets = this.generateWarmupSets(lift, workingWeight);

        return {
            lift,
            warmupSets,
            workingSets,
            workingWeight,
        };
    }

    static generateWorkingSets(
        lift: Lift,

        workingWeight: number,
    ): Set[] {
        let sets = [];
        let nSets = 5;
        if (lift == "deadlift") {
            nSets = 1;
        }

        for (let i = 0; i < nSets; i++) {
            sets.push({
                weight: workingWeight,
                targetReps: 5,
                completedReps: null,
            });
        }
        return sets;
    }

    static generateWarmupSets(lift: Lift, workingWeight: number): Set[] {
        let startingWeight: number;
        let sets: Set[] = [];

        switch (lift) {
            case "squat":
            case "benchPress":
            case "barbellRow":
            case "ohp":
                startingWeight = 45;
                break;
            case "deadlift":
                startingWeight = 135;
                break;
        }

        sets.push({
            weight: startingWeight,
            targetReps: 5,
            completedReps: null,
        });

        if (lift == "deadlift") {
            const increment = 0.25;
            for (let i = 1; i < 4; i++) {
                const targetWeight =
                    startingWeight +
                    (workingWeight - startingWeight) * increment * i;
                sets.push({
                    weight: roundToEasyLoad(targetWeight, 10),
                    targetReps: 5,
                    completedReps: null,
                });
            }
        } else {
            const increment = 0.3;
            for (let i = 0; i < 4; i++) {
                const targetWeight =
                    startingWeight +
                    (workingWeight - startingWeight) * increment * i;
                sets.push({
                    weight: roundToEasyLoad(targetWeight, 10),
                    targetReps: 5,
                    completedReps: null,
                });
            }
        }

        return sets;
    }
}
