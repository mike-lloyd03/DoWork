import type { PageLoad } from "./$types";
import { Workout } from "$lib/database/Workout.svelte";

export const load: PageLoad = async () => {
    const workouts = await Workout.getAll();
    return {
        workouts,
    };
};
