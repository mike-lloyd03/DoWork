<script lang="ts">
    import { onMount, onDestroy } from "svelte";
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

    // 1. STATE MANAGEMENT
    let timer = $state(0);
    let timerInterval: any;

    // svelte-ignore state_referenced_locally
    let workout: WorkoutModel = $state(data.workout!.data);

    // 2. TIMER LOGIC
    onMount(() => {
        timerInterval = setInterval(() => {
            timer++;
        }, 1000);
    });

    onDestroy(() => {
        if (timerInterval) clearInterval(timerInterval);
    });

    function formatTime(seconds: number) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    }

    function resetRestTimer() {
        // In a real app, this might start a specific 90s/3min countdown
        // For now, we just highlight it to show interaction
        timer = 0;
    }

    // 3. FINISH LOGIC
    async function finishWorkout() {
        workout.endTime = DateTime.now();
        workout.exercises.forEach((e) => {
            e.success = e.workingSets.every((s) => s.completedReps >= s.targetReps);
        });
        let newWorkout = new Workout(workout);
        let db = await database.conn();
        newWorkout.create(db);
        history.back();
    }
</script>

<div class="bg-base-200 min-h-screen pb-32">
    <Header workoutType={workout.type} />

    <div class="space-y-4 p-4">
        {#if workout}
            {#each workout.exercises as _, i (i)}
                <ExerciseRow bind:exercise={workout.exercises[i]} />
            {/each}
        {/if}

        <AddNote />
    </div>

    <Footer>
        <FooterButton text="Finish Workout" onclick={finishWorkout} />
    </Footer>
</div>
