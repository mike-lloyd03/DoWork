import type { PageLoad } from "./$types";
import { Workout } from "$lib/database/Workout.svelte";

export const load: PageLoad = async () => {
    try {
        let activeWorkout = await Workout.getActive();

        if (activeWorkout === null) {
            let nextWorkout = await Workout.createNext();

            if (nextWorkout === null) {
                nextWorkout = await Workout.generateWorkout("A");
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
