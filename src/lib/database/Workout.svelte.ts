import { roundToEasyLoad } from "$lib/utils";
import { DateTime } from "luxon";
import database from "./DB.svelte";

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
    data: WorkoutModel = $state() as WorkoutModel;

    constructor(data: WorkoutModel) {
        this.data = data;
    }

    static async initTable() {
        const db = await database.conn();

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
            endTime: data.endTime ? DateTime.fromISO(data.endTime) : undefined,
            type: data.type,
            notes: data.notes,
            exercises: JSON.parse(data.exerciseData),
        };
        return new Workout(model);
    }

    async create() {
        const db = await database.conn();

        this.checkSuccess();
        const stmt =
            "INSERT INTO workouts (startTime, endTime, type, exerciseData, notes) VALUES (?, ?, ?, ?, ?)";

        const res = await db.execute(stmt, [
            this.data.startTime?.toISO() ?? undefined,
            this.data.endTime?.toISO() ?? undefined,
            this.data.type,
            JSON.stringify(this.data.exercises),
            this.data.notes,
        ]);

        this.data.id = res.lastInsertId;
    }

    static async get(id: number): Promise<Workout | null> {
        const db = await database.conn();

        const stmt = "SELECT * FROM workouts WHERE id = ? LIMIT 1";
        const resp: WorkoutDB[] = await db.select(stmt, [id]);

        if (resp.length > 0) {
            return Workout.fromDB(resp[0]);
        }
        return null;
    }

    static async getAll(): Promise<Workout[]> {
        const db = await database.conn();

        const stmt = "SELECT * FROM workouts ORDER BY startTime DESC";
        const resp: WorkoutDB[] = await db.select(stmt);

        return (resp || []).map((row) => {
            return Workout.fromDB(row);
        });
    }

    async update() {
        const db = await database.conn();
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

    async delete() {
        const db = await database.conn();
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

    static async getMaxLift(liftName: Lift): Promise<number> {
        const db = await database.conn();

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

    static async getMostRecentLift(lift: Lift): Promise<number> {
        const db = await database.conn();

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
        type: WorkoutType | undefined = undefined,
    ): Promise<Workout | null> {
        const db = await database.conn();

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

    static async getActive() {
        const db = await database.conn();

        const stmt =
            "SELECT * FROM workouts WHERE endTime is null ORDER BY startTime DESC LIMIT 1";

        const resp: WorkoutDB[] = await db.select(stmt);

        if (resp.length > 0) {
            return Workout.fromDB(resp[0]);
        }
        return null;
    }

    static async createNext(): Promise<Workout | null> {
        const lastWorkout = await this.getLast();
        if (!lastWorkout) {
            return null;
        }
        const nextWorkoutType = lastWorkout.data.type == "A" ? "B" : "A";
        return this.generateWorkout(nextWorkoutType);
    }

    static async generateWorkout(type: WorkoutType): Promise<Workout> {
        const exercises: Exercise[] = [];

        if (type == "B") {
            const squatSets = await this.generateExercise("squat");
            const ohpSets = await this.generateExercise("ohp");
            const deadliftSets = await this.generateExercise("deadlift");
            exercises.push(squatSets);
            exercises.push(ohpSets);
            exercises.push(deadliftSets);
        } else {
            const squatSets = await this.generateExercise("squat");
            const benchPressSets = await this.generateExercise("benchPress");
            const barbellRowSets = await this.generateExercise("barbellRow");
            exercises.push(squatSets);
            exercises.push(benchPressSets);
            exercises.push(barbellRowSets);
        }

        return new Workout({
            type,
            exercises,
        });
    }

    static async generateExercise(lift: Lift): Promise<Exercise> {
        let mostRecentWeight = await this.getMostRecentLift(lift);
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

    static generateWorkingSets(lift: Lift, workingWeight: number): Set[] {
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
                    weight: roundToEasyLoad(targetWeight, {
                        smallestWeight: 10,
                        tolerancePercent: 0.15,
                    }),
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
                    weight: roundToEasyLoad(targetWeight, {
                        smallestWeight: 10,
                        tolerancePercent: 0.15,
                    }),
                    targetReps: 5,
                    completedReps: null,
                });
            }
        }

        return sets;
    }
}
