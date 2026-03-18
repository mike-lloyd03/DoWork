import type { PageLoad } from "../new/$types";
import database from "$lib/database/DB.svelte";
import { Workout } from "$lib/database/Workout.svelte";
import { DateTime } from "luxon";

export const load: PageLoad = async () => {
    try {
        let workout = await Workout.getActive();
        if (workout == null) {
            workout = await Workout.createNext();
            if (!workout) {
                workout = await Workout.generateWorkout("A");
            }
            workout.data.startTime = DateTime.now();
            await workout.create();
        }

        return {
            workout,
        };
    } catch (e) {
        console.error(`Error setting up new workout: ${e}`);
    }
};
