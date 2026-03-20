<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import ExerciseRow from "$lib/components/workout/ExerciseRow.svelte";
    import type { PageProps } from "./$types";
    import { Workout } from "$lib/database/Workout.svelte";
    import Footer from "$lib/components/workout/Footer.svelte";
    import AddNote from "$lib/components/workout/AddNote.svelte";
    import Header from "$lib/components/workout/Header.svelte";
    import FooterButton from "$lib/components/workout/FooterButton.svelte";
    import { goto, invalidate } from "$app/navigation";

    let { data }: PageProps = $props();

    let timer = $state(0);
    let timerInterval: any;
    let showDelete = $state(false);
    let editMode = $state(false);

    // svelte-ignore state_referenced_locally
    let workout: Workout = $state(data.workout!);

    $effect(() => {
        workout = data.workout!;
    });

    // 2. TIMER LOGIC
    onMount(() => {
        timerInterval = setInterval(() => {
            timer++;
        }, 1000);
    });

    onDestroy(() => {
        if (timerInterval) clearInterval(timerInterval);
    });

    function deleteWorkout() {
        showDelete = true;
    }

    async function deleteWorkoutConfirm() {
        if (workout.data.id) {
            await workout.delete();
        }
        goto("/history");
    }

    async function updateWorkout() {
        if (workout.data.id) {
            workout.update();
        }
        await invalidate(`data:workout/${workout.data.id}`);
        editMode = false;
    }

    async function cancelUpdate() {
        await invalidate(`data:workout/${workout.data.id}`);
        editMode = false;
    }
</script>

<div class="bg-base-200">
    <Header bind:workout />

    <div class="space-y-4 p-4">
        {#if workout}
            {#each workout.data.exercises as _, i (i)}
                <ExerciseRow bind:exercise={workout.data.exercises[i]} {editMode} />
            {/each}
        {/if}

        <AddNote />
    </div>

    <Footer>
        <div class="flex justify-between gap-2">
            {#if showDelete}
                <div class="flex flex-col items-center">
                    <div>Are you sure you want to delete this workout?</div>
                    <div>
                        <FooterButton
                            text="Yes"
                            icon="octagonX"
                            color="error"
                            onclick={deleteWorkoutConfirm}
                        />
                        <FooterButton text="Cancel" icon="x" onclick={() => (showDelete = false)} />
                    </div>
                </div>
            {:else if editMode}
                <FooterButton text="Save" icon="save" color="success" onclick={updateWorkout} />
                <FooterButton text="Cancel" icon="octagonX" color="error" onclick={cancelUpdate} />
            {:else}
                <FooterButton
                    text="Edit"
                    icon="squarePen"
                    color="warning"
                    onclick={() => (editMode = true)}
                />
                <FooterButton text="Delete" icon="octagonX" color="error" onclick={deleteWorkout} />
            {/if}
        </div>
    </Footer>
</div>
