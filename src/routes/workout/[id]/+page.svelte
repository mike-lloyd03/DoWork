<script lang="ts">
    import ExerciseRow from "$lib/components/workout/ExerciseRow.svelte";
    import type { PageProps } from "./$types";
    import { Workout } from "$lib/database/Workout.svelte";
    import { DateTime } from "luxon";
    import Footer from "$lib/components/workout/Footer.svelte";
    import AddNote from "$lib/components/workout/AddNote.svelte";
    import Header from "$lib/components/workout/Header.svelte";
    import FooterButton from "$lib/components/workout/FooterButton.svelte";
    import WorkoutSummary from "$lib/components/workout/WorkoutSummary.svelte";
    import { showToast } from "$lib/appState.svelte";
    import { page } from "$app/state";

    let { data }: PageProps = $props();

    let workout: Workout = $state(data.workout!);
    let isComplete = $derived(workout.data.endTime !== undefined);
    let editMode = $state(page.state?.editMode ?? !isComplete);

    let tempStartTime = $state("");
    let tempEndTime = $state("");

    $effect(() => {
        tempStartTime = workout.data.startTime?.toFormat("yyyy-MM-dd'T'HH:mm") ?? "";
        tempEndTime = workout.data.endTime?.toFormat("yyyy-MM-dd'T'HH:mm") ?? "";
    });

    $effect(() => {
        const _ = $state.snapshot(workout.data);
        const timer = setTimeout(() => workout.update(), 500);
        return () => clearTimeout(timer);
    });

    function validate(): boolean {
        const start = tempStartTime ? DateTime.fromISO(tempStartTime) : null;
        const end = tempEndTime ? DateTime.fromISO(tempEndTime) : null;

        if (!start?.isValid) {
            showToast("Invalid start time", "error");
            return false;
        }
        if (!end?.isValid) {
            showToast("Invalid end time", "error");
            return false;
        }
        if (end <= start) {
            showToast("End time must be after start time", "error");
            return false;
        }
        return true;
    }

    async function finishWorkout() {
        workout.data.endTime = DateTime.now();
        await workout.update();
        history.back();
    }

    async function saveChanges() {
        if (!validate()) return;

        workout.data.startTime = tempStartTime ? DateTime.fromISO(tempStartTime) : undefined;
        workout.data.endTime = tempEndTime ? DateTime.fromISO(tempEndTime) : undefined;
        await workout.update();
        editMode = false;
    }
</script>

<div class="bg-base-200 min-h-screen pb-32">
    <Header bind:workout bind:editMode />

    <div class="space-y-4 p-4">
        {#if workout}
            {#if isComplete}
                <WorkoutSummary
                    startTime={workout.data.startTime}
                    endTime={workout.data.endTime}
                    {editMode}
                    bind:tempStartTime
                    bind:tempEndTime
                />
            {/if}
            {#each workout.data.exercises as _, i (i)}
                <ExerciseRow bind:exercise={workout.data.exercises[i]} {editMode} />
            {/each}
        {/if}

        {#if editMode}
            <AddNote />
        {:else if workout.data.notes}
            <div class="card bg-base-100 shadow-sm">
                <div class="card-body">
                    <div class="mb-1 text-xs font-medium tracking-wide uppercase opacity-60">
                        Notes
                    </div>
                    <div>{workout.data.notes}</div>
                </div>
            </div>
        {/if}
    </div>

    {#if !isComplete}
        <Footer>
            <FooterButton text="Finish Workout" onclick={finishWorkout} />
        </Footer>
    {/if}
    {#if isComplete && editMode}
        <Footer>
            <FooterButton text="Save Changes" onclick={saveChanges} />
        </Footer>
    {/if}
</div>
