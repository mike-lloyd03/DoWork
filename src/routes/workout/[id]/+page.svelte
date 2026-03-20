<script lang="ts">
    import ExerciseRow from "$lib/components/workout/ExerciseRow.svelte";
    import type { PageProps } from "./$types";
    import { Workout } from "$lib/database/Workout.svelte";
    import { DateTime } from "luxon";
    import Footer from "$lib/components/workout/Footer.svelte";
    import AddNote from "$lib/components/workout/AddNote.svelte";
    import Header from "$lib/components/workout/Header.svelte";
    import FooterButton from "$lib/components/workout/FooterButton.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";

    let { data }: PageProps = $props();

    let workout: Workout = $state(data.workout!);
    let isComplete = $derived(workout.data.endTime !== null);
    let editMode = $derived(isComplete ? page.url.searchParams.get("edit") === "true" : true);

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

    async function finishWorkout() {
        workout.data.endTime = DateTime.now();
        await workout.update();
        history.back();
    }

    async function saveChanges() {
        workout.data.startTime = tempStartTime ? DateTime.fromISO(tempStartTime) : undefined;
        workout.data.endTime = tempEndTime ? DateTime.fromISO(tempEndTime) : undefined;
        await workout.update();
        goto(page.url.pathname, { replaceState: true });
    }
</script>

<div class="bg-base-200 min-h-screen pb-32">
    <Header {workout} />

    <div class="space-y-4 p-4">
        {#if workout}
            {#if isComplete}
                <div class="card">
                    <div>
                        <span class="font-medium">Start:</span>
                        {#if editMode}
                            <input type="datetime-local" class="input" bind:value={tempStartTime} />
                        {:else}
                            <span
                                >{workout.data.startTime?.toLocaleString(
                                    DateTime.DATETIME_SHORT,
                                )}</span
                            >
                        {/if}
                    </div>

                    <div>
                        <span class="font-medium">End:</span>
                        {#if editMode}
                            <input type="datetime-local" class="input" bind:value={tempEndTime} />
                        {:else}
                            <span
                                >{workout.data.endTime?.toLocaleString(
                                    DateTime.DATETIME_SHORT,
                                )}</span
                            >
                        {/if}
                    </div>
                </div>
            {/if}
            {#each workout.data.exercises as _, i (i)}
                <ExerciseRow bind:exercise={workout.data.exercises[i]} {editMode} />
            {/each}
        {/if}

        {#if editMode}
            <AddNote />
        {:else}
            <div>{workout.data.notes}</div>
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
