import { Workout } from "./Workout";
import { DateTime } from "luxon";
import Database from "@tauri-apps/plugin-sql";

export async function insertTestData(db: Database) {
    const testData1 = new Workout({
        startTime: DateTime.local(2025, 10, 3, 6, 31),
        endTime: DateTime.local(2025, 10, 3, 7, 39),
        type: "A",
        exercises: [
            {
                lift: "squat",
                workingWeight: 135,
                warmupSets: [
                    { weight: 45, targetReps: 5, completedReps: 5 },
                    { weight: 45, targetReps: 5, completedReps: 5 },
                    { weight: 95, targetReps: 5, completedReps: 5 },
                    { weight: 105, targetReps: 5, completedReps: 5 },
                    { weight: 115, targetReps: 5, completedReps: 5 },
                ],
                workingSets: [
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 4 },
                ],
                success: false,
            },
            {
                lift: "benchPress",
                workingWeight: 185,
                warmupSets: [
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 165, targetReps: 5, completedReps: 5 },
                    { weight: 175, targetReps: 5, completedReps: 5 },
                ],
                workingSets: [
                    { weight: 185, targetReps: 5, completedReps: 5 },
                    { weight: 185, targetReps: 5, completedReps: 5 },
                    { weight: 185, targetReps: 5, completedReps: 5 },
                    { weight: 185, targetReps: 5, completedReps: 5 },
                    { weight: 185, targetReps: 5, completedReps: 5 },
                ],
                success: true,
            },
            {
                lift: "barbellRow",
                workingWeight: 135,
                warmupSets: [
                    { weight: 95, targetReps: 5, completedReps: 5 },
                    { weight: 115, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                ],
                workingSets: [
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                ],
                success: true,
            },
        ],
        notes: "TESTDATA",
    });

    const testData2 = new Workout({
        startTime: DateTime.local(2025, 10, 5, 6, 27),
        endTime: DateTime.local(2025, 10, 5, 7, 22),
        type: "B",
        exercises: [
            {
                lift: "squat",
                workingWeight: 135,
                warmupSets: [
                    { weight: 45, targetReps: 5, completedReps: 5 },
                    { weight: 65, targetReps: 5, completedReps: 5 },
                    { weight: 95, targetReps: 5, completedReps: 5 },
                ],
                workingSets: [
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 135, targetReps: 5, completedReps: 5 },
                ],
                success: true,
            },
            {
                lift: "ohp",
                workingWeight: 115,
                warmupSets: [
                    { weight: 45, targetReps: 5, completedReps: 5 },
                    { weight: 65, targetReps: 5, completedReps: 5 },
                    { weight: 95, targetReps: 5, completedReps: 5 },
                ],
                workingSets: [
                    { weight: 115, targetReps: 5, completedReps: 5 },
                    { weight: 115, targetReps: 5, completedReps: 5 },
                    { weight: 115, targetReps: 5, completedReps: 5 },
                    { weight: 115, targetReps: 5, completedReps: 5 },
                    { weight: 115, targetReps: 5, completedReps: 5 },
                ],
                success: true,
            },
            {
                lift: "deadlift",
                workingWeight: 285,
                warmupSets: [
                    { weight: 135, targetReps: 5, completedReps: 5 },
                    { weight: 185, targetReps: 5, completedReps: 5 },
                    { weight: 205, targetReps: 5, completedReps: 5 },
                    { weight: 225, targetReps: 5, completedReps: 5 },
                    { weight: 255, targetReps: 5, completedReps: 5 },
                ],
                workingSets: [{ weight: 285, targetReps: 5, completedReps: 5 }],
                success: true,
            },
        ],
        notes: "TESTDATA",
    });

    await db.execute("DELETE FROM workouts WHERE notes = 'TESTDATA'");
    await testData1.create(db);
    await testData2.create(db);
}
