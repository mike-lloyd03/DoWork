import type { PageLoad } from "./$types";
import database from "$lib/database/DB.svelte";
import { Workout } from "$lib/database/Workout";

export const load: PageLoad = async () => {
    const db = await database.conn();

    let activeWorkout = await Workout.getActive(db);

    if (activeWorkout == null) {
        const nextWorkout = await Workout.createNext(db);
        return { nextWorkout };
    } else {
        return {
            activeWorkout,
        };
    }
};
