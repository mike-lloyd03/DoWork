<script lang="ts">
    import ExerciseRow from "$lib/components/workout/ExerciseRow.svelte";
    import type { PageProps } from "./$types";
    import { Workout, type WorkoutModel } from "$lib/database/Workout";
    import { DateTime } from "luxon";
    import database from "$lib/database/DB.svelte";
    import Footer from "$lib/components/workout/Footer.svelte";
    import AddNote from "$lib/components/workout/AddNote.svelte";
    import Header from "$lib/components/workout/Header.svelte";
    import FooterButton from "$lib/components/workout/FooterButton.svelte";

    let { data }: PageProps = $props();

    // svelte-ignore state_referenced_locally
    let workout: WorkoutModel = $state(data.workout!.data);

    async function finishWorkout() {
        workout.endTime = DateTime.now();
        let newWorkout = new Workout(workout);
        let db = await database.conn();
        await newWorkout.update(db);
        history.back();
    }

    async function updateWorkout() {
        let newWorkout = new Workout(workout);
        let db = await database.conn();
        await newWorkout.update(db);
    }
</script>

<div class="bg-base-200 min-h-screen pb-32">
    <Header workoutType={workout.type} />

    <div class="space-y-4 p-4">
        {#if workout}
            {#each workout.exercises as _, i (i)}
                <ExerciseRow bind:exercise={workout.exercises[i]} editMode {updateWorkout} />
            {/each}
        {/if}

        <AddNote />
    </div>

    <Footer>
        <FooterButton text="Finish Workout" onclick={finishWorkout} />
    </Footer>
</div>
