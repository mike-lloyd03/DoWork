import type { PageLoad } from "./$types";
import database from "$lib/database/DB";
import { Workout } from "$lib/database/Workout";

export const load: PageLoad = async () => {
    const db = database.conn();
    const workouts = await Workout.getAll(db);
    return {
        workouts,
    };
};
