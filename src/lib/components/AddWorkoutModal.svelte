<script lang="ts">
    import { Workout, type WorkoutType } from "$lib/database/Workout.svelte";
    import { DateTime } from "luxon";
    import { goto } from "$app/navigation";

    interface Props {
        open: boolean;
    }

    let { open = $bindable() }: Props = $props();

    let workoutType = $state<WorkoutType>("A");
    let date = $state(DateTime.now().toFormat("yyyy-MM-dd"));
    let startTime = $state(DateTime.now().toFormat("HH:mm"));
    let endTime = $state(DateTime.now().toFormat("HH:mm"));
    let loading = $state(false);

    async function handleSubmit() {
        loading = true;
        try {
            const startDateTime = DateTime.fromISO(`${date}T${startTime}`);
            const endDateTime = DateTime.fromISO(`${date}T${endTime}`);

            const workout = await Workout.generateWorkout(workoutType);
            workout.data.startTime = startDateTime;
            workout.data.endTime = endDateTime;
            await workout.create();

            goto(`/workout/${workout.data.id}`, { state: { editMode: true } });
        } finally {
            loading = false;
        }
    }

    function closeModal() {
        open = false;
    }
</script>

<dialog {open} class="modal is-active z-50">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Add Workout</h3>

        <div class="form-control mt-4 space-y-4">
            <div>
                <label class="label">
                    <span class="label-text font-medium">Workout Type</span>
                </label>
                <div class="flex gap-2">
                    <button
                        class="btn flex-1"
                        class:btn-primary={workoutType === "A"}
                        class:btn-ghost={workoutType !== "A"}
                        onclick={() => (workoutType = "A")}
                    >
                        Workout A
                    </button>
                    <button
                        class="btn flex-1"
                        class:btn-primary={workoutType === "B"}
                        class:btn-ghost={workoutType !== "B"}
                        onclick={() => (workoutType = "B")}
                    >
                        Workout B
                    </button>
                </div>
            </div>

            <div>
                <label class="label">
                    <span class="label-text font-medium">Date</span>
                </label>
                <input type="date" class="input input-bordered w-full" bind:value={date} />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="label">
                        <span class="label-text font-medium">Start Time</span>
                    </label>
                    <input type="time" class="input input-bordered w-full" bind:value={startTime} />
                </div>
                <div>
                    <label class="label">
                        <span class="label-text font-medium">End Time</span>
                    </label>
                    <input type="time" class="input input-bordered w-full" bind:value={endTime} />
                </div>
            </div>
        </div>

        <div class="modal-action">
            <button class="btn btn-ghost" onclick={closeModal}>Cancel</button>
            <button class="btn btn-primary" onclick={handleSubmit} disabled={loading}>
                {#if loading}
                    <span class="loading loading-spinner loading-sm"></span>
                {:else}
                    Create Workout
                {/if}
            </button>
        </div>
    </div>

    <button class="modal-backdrop" aria-label="Close modal" onclick={closeModal}></button>
</dialog>
