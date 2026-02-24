import type { PageLoad } from "../[id]/$types";
import database from "$lib/database/DB.svelte";
import { Workout } from "$lib/database/Workout";

export const load: PageLoad = async ({ params, depends }) => {
    depends(`data:workout/${params.id}`);
    try {
        const db = await database.conn();
        const id = parseInt(params.id);
        let workout = await Workout.get(db, id);

        return {
            workout: workout.data,
        };
    } catch (e) {
        console.error(`Error fetching workout: ${e}`);
    }
};
