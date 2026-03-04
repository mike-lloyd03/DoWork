<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import ExerciseRow from "$lib/components/workout/ExerciseRow.svelte";
    import type { PageProps } from "./$types";
    import { Workout, type WorkoutModel } from "$lib/database/Workout";
    import database from "$lib/database/DB.svelte";
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
    let workout: WorkoutModel = $state(data.workout!);

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
        let db = await database.conn();
        if (workout.id) {
            let del = await Workout.get(db, workout.id);
            if (del) {
                del.delete(db);
            }
        }
        goto("/history");
    }

    async function updateWorkout() {
        let db = await database.conn();
        if (workout.id) {
            let updatedWorkout = new Workout(workout);
            updatedWorkout.update(db);
        }
        await invalidate(`data:workout/${workout.id}`);
        editMode = false;
    }

    async function cancelUpdate() {
        await invalidate(`data:workout/${workout.id}`);
        editMode = false;
    }
</script>

<div class="bg-base-200 min-h-screen pb-32">
    <Header workoutType={workout.type} />

    <div class="space-y-4 p-4">
        {#if workout}
            {#each workout.exercises as _, i (i)}
                <ExerciseRow bind:exercise={workout.exercises[i]} {editMode} />
            {/each}
        {/if}

        <AddNote />
    </div>

    <Footer>
        <div class="flex justify-between gap-2">
            {#if showDelete}
                <FooterButton
                    text="Yes"
                    icon="octagonX"
                    color="error"
                    onclick={deleteWorkoutConfirm}
                />
                <FooterButton text="Cancel" icon="x" onclick={() => (showDelete = false)} />
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
