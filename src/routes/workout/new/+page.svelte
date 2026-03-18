<script lang="ts">
    import ExerciseRow from "$lib/components/workout/ExerciseRow.svelte";
    import type { PageProps } from "./$types";
    import { Workout } from "$lib/database/Workout.svelte";
    import { DateTime } from "luxon";
    import Footer from "$lib/components/workout/Footer.svelte";
    import AddNote from "$lib/components/workout/AddNote.svelte";
    import Header from "$lib/components/workout/Header.svelte";
    import FooterButton from "$lib/components/workout/FooterButton.svelte";

    let { data }: PageProps = $props();

    // svelte-ignore state_referenced_locally
    let workout: Workout = $state(data.workout!);

    $effect(() => {
        // triggers the effect on every update to workout
        const _ = $state.snapshot(workout.data);

        const timer = setTimeout(() => {
            workout.update();
        }, 500);

        return () => clearTimeout(timer);
    });

    async function finishWorkout() {
        workout.data.endTime = DateTime.now();
        workout.update();
        history.back();
    }
</script>

<div class="bg-base-200 min-h-screen pb-32">
    <Header {workout} />

    <div class="space-y-4 p-4">
        {#if workout}
            {#each workout.data.exercises as _, i (i)}
                <ExerciseRow bind:exercise={workout.data.exercises[i]} editMode />
            {/each}
        {/if}

        <AddNote />
    </div>

    <Footer>
        <FooterButton text="Finish Workout" onclick={finishWorkout} />
    </Footer>
</div>
