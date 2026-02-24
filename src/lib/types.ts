import type { DateTime } from "luxon";
import type { Lift } from "./database/Workout";

export interface WorkoutPlan {
    type: "A" | "B";
    lastPerformed: DateTime;
    exerciseA: PlanExercise;
    exerciseB: PlanExercise;
    exerciseC: PlanExercise;
}

export interface PlanExercise {
    lift: Lift;
    sets: string;
    weight: number;
}
