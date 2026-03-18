import type { PageLoad } from "./$types";
import { Workout } from "$lib/database/Workout.svelte";

export const load: PageLoad = async () => {
    try {
        let activeWorkout = await Workout.getActive();

        if (activeWorkout == null) {
            const nextWorkout = await Workout.createNext();

            if (nextWorkout == null) {
                const nextWorkout = await Workout.generateWorkout("A");
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
