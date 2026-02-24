import type { PageLoad } from "../new/$types";
import database from "$lib/database/DB.svelte";
import { Workout } from "$lib/database/Workout";

export const load: PageLoad = async () => {
    const db = await database.conn();
    try {
        let workout = await Workout.getActive(db);
        if (workout == null) {
            workout = await Workout.createNext(db);
        }

        return {
            workout,
        };
    } catch (e) {
        console.error(`Error setting up new workout: ${e}`);
    }
};
