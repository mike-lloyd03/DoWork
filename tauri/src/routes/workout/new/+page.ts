import type { PageLoad } from "../new/$types";
import { Workout } from "$lib/database/Workout.svelte";
import { DateTime } from "luxon";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async () => {
    let workout = await Workout.getActive();

    if (!workout) {
        workout = await Workout.createNext();

        if (!workout) {
            workout = await Workout.generateWorkout("A");
        }

        workout.data.startTime = DateTime.now();
        await workout.create();
    }

    redirect(307, `/workout/${workout.data.id}`);
};
