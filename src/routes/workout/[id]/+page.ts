import type { PageLoad } from "../[id]/$types";
import { Workout } from "$lib/database/Workout.svelte";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async ({ params, depends }) => {
    depends(`data:workout/${params.id}`);

    const id = parseInt(params.id);
    const workout = await Workout.get(id);

    if (!workout) {
        redirect(307, "/history");
    }

    return { workout };
};
