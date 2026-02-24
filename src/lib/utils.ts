import database from "./database/DB.svelte";
import { type WorkoutModel, type Lift, Workout } from "./database/Workout";
import type { PlanExercise, WorkoutPlan } from "./types";

export function calculateNextWorkout(lastWorkout: WorkoutModel) {
    const type = lastWorkout.type == "A" ? "B" : "A";
    const exercises = [];
    switch (type) {
        case "A":
            exercises.push({ lift: "squat", weight: 200 });
        case "B":
    }
    return {
        name: `Workout ${type}`,
        lastPerformed: lastWorkout.startTime,
        durationEstimate: "45 min",
        exercises: [
            { name: "Squat", sets: "5x5", weight: 225 },
            { name: "Bench Press", sets: "5x5", weight: 135 },
            { name: "Barbell Row", sets: "5x5", weight: 135 },
        ],
    };
}

function getNextWeight(lastWorkout: Workout, lift: Lift): number {
    return (
        lastWorkout.data.exercises
            .filter((e) => e.lift == lift && e.type == "working")
            .map((e) => {
                let previousWeight = 46;
                if (e.workingSets.length > 0) {
                    previousWeight = e.workingSets[0].weight;
                }
                return e.success ? previousWeight + 5 : previousWeight;
            })
            .pop() ?? 0
    );
}

export async function getNextWorkoutPlan(
    type: "A" | "B",
): Promise<WorkoutPlan> {
    const db = await database.conn();
    const lastForType = await Workout.getLast(db, type);

    const exALift: Lift = "squat";
    const exBLift: Lift = type == "A" ? "benchPress" : "ohp";
    const exCLift: Lift = type == "A" ? "barbellRow" : "deadlift";

    const exAWeight = getNextWeight(lastForType, exALift);
    const exBWeight = getNextWeight(lastForType, exBLift);
    const exCWeight = getNextWeight(lastForType, exCLift);

    const exerciseA: PlanExercise = {
        lift: exALift,
        sets: "5x5",
        weight: exAWeight ?? 0,
    };
    const exerciseB: PlanExercise = {
        lift: type == "A" ? "benchPress" : "ohp",
        sets: "5x5",
        weight: exBWeight,
    };
    const exerciseC: PlanExercise = {
        lift: type == "A" ? "barbellRow" : "deadlift",
        sets: type == "A" ? "5x5" : "1x5",
        weight: exCWeight,
    };

    return {
        type,
        lastPerformed: lastForType.data.startTime,
        exerciseA,
        exerciseB,
        exerciseC,
    };
}

export function liftDisplayName(lift: Lift): string {
    switch (lift) {
        case "squat":
            return "Squat";
        case "benchPress":
            return "Bench Press";
        case "barbellRow":
            return "Barbell Row";
        case "ohp":
            return "Overhead Press";
        case "deadlift":
            return "Deadlift";
    }
}
