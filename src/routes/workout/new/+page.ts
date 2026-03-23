import type { PageLoad } from "../new/$types";
import { Workout } from "$lib/database/Workout.svelte";
import { DateTime } from "luxon";
import { goto } from "$app/navigation";

export const load: PageLoad = async () => {
    try {
        let workout = await Workout.getActive();
        if (!workout) {
            workout = await Workout.createNext();
            if (!workout) {
                workout = await Workout.generateWorkout("A");
            }
            workout.data.startTime = DateTime.now();
            await workout.create();
        }

        goto(`/workout/${workout.data.id}`);
    } catch (e) {
        console.error(`Error setting up new workout: ${e}`);
        goto("/");
    }
};
