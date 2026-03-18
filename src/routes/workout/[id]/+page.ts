import type { PageLoad } from "../[id]/$types";
import { Workout } from "$lib/database/Workout.svelte";
import { goto } from "$app/navigation";

export const load: PageLoad = async ({ params, depends }) => {
    depends(`data:workout/${params.id}`);
    try {
        const id = parseInt(params.id);
        let workout = await Workout.get(id);

        if (workout) {
            return {
                workout,
            };
        } else {
            console.error(`Workout ${params.id} not found`);
            goto("/history");
        }
    } catch (e) {
        console.error(`Error fetching workout: ${e}`);
    }
};
