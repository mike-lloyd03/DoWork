import { Workout } from "./Workout";
import { DateTime } from "luxon";
import Database from "@tauri-apps/plugin-sql";

export async function insertTestData(db: Database) {
    const testData1 = new Workout({
        date: DateTime.local(2025, 10, 3, 6, 30).toISO()!,
        type: "A",
        exercises: [
            {
                lift: "squat",
                type: "warmup",
                sets: [
                    { weight: 45, targetReps: 5, completedReps: 5 },
                    { weight: 65, targetReps: 5, completedReps: 5 },
                    { weight: 95, targetReps: 5, completedReps: 5 },
                ],
            },
            {
                lift: "squat",
                type: "working",
                sets: [
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                ],
            },
            {
                lift: "benchPress",
                type: "warmup",
                sets: [
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 165, targetReps: 5, completedReps: 5 },
                    { weight: 175, targetReps: 5, completedReps: 5 },
                ],
            },
            {
                lift: "benchPress",
                type: "working",
                sets: [
                    { weight: 185, targetReps: 5, completedReps: 5 },
                    { weight: 185, targetReps: 5, completedReps: 5 },
                    { weight: 185, targetReps: 5, completedReps: 5 },
                    { weight: 185, targetReps: 5, completedReps: 5 },
                    { weight: 185, targetReps: 5, completedReps: 5 },
                ],
            },
            {
                lift: "barbellRow",
                type: "warmup",
                sets: [
                    { weight: 95, targetReps: 5, completedReps: 5 },
                    { weight: 115, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                ],
            },
            {
                lift: "barbellRow",
                type: "working",
                sets: [
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                ],
            },
        ],
        notes: "TESTDATA",
    });

    const testData2 = new Workout({
        date: DateTime.local(2025, 10, 5, 6, 27).toISO()!,
        type: "B",
        exercises: [
            {
                lift: "squat",
                type: "warmup",
                sets: [
                    { weight: 45, targetReps: 5, completedReps: 5 },
                    { weight: 65, targetReps: 5, completedReps: 5 },
                    { weight: 95, targetReps: 5, completedReps: 5 },
                ],
            },
            {
                lift: "squat",
                type: "working",
                sets: [
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                ],
            },
            {
                lift: "ohp",
                type: "warmup",
                sets: [
                    { weight: 45, targetReps: 5, completedReps: 5 },
                    { weight: 65, targetReps: 5, completedReps: 5 },
                    { weight: 95, targetReps: 5, completedReps: 5 },
                ],
            },
            {
                lift: "ohp",
                type: "working",
                sets: [
                    { weight: 115, targetReps: 5, completedReps: 5 },
                    { weight: 115, targetReps: 5, completedReps: 5 },
                    { weight: 115, targetReps: 5, completedReps: 5 },
                    { weight: 115, targetReps: 5, completedReps: 5 },
                    { weight: 115, targetReps: 5, completedReps: 5 },
                ],
            },
            {
                lift: "deadlift",
                type: "warmup",
                sets: [
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 185, targetReps: 5, completedReps: 5 },
                    { weight: 205, targetReps: 5, completedReps: 5 },
                    { weight: 225, targetReps: 5, completedReps: 5 },
                    { weight: 255, targetReps: 5, completedReps: 5 },
                ],
            },
            {
                lift: "deadlift",
                type: "working",
                sets: [{ weight: 285, targetReps: 5, completedReps: 5 }],
            },
        ],
        notes: "TESTDATA",
    });

    await db.execute("DELETE FROM workouts WHERE notes = 'TESTDATA'");
    await testData1.create(db);
    await testData2.create(db);
}
