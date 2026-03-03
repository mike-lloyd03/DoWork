import type { PageLoad } from "./$types";
import database from "$lib/database/DB.svelte";
import { Workout } from "$lib/database/Workout";

export const load: PageLoad = async () => {
    const db = await database.conn();

    try {
        let activeWorkout = await Workout.getActive(db);

        if (activeWorkout == null) {
            const nextWorkout = await Workout.createNext(db);

            if (nextWorkout == null) {
                const nextWorkout = await Workout.generateWorkout(db, "A");
                return { nextWorkout };
            }
            return { nextWorkout };
        } else {
            return {
                activeWorkout,
            };
        }
    } catch (e) {
        console.error(`Failed to get next or active workout: ${e}`);
    }
};
