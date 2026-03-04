<script lang="ts">
    import { Workout, type Exercise } from "$lib/database/Workout";
    import { liftDisplayName } from "$lib/utils";

    interface Props {
        show: boolean;
        exercise: Exercise;
    }

    let { show = $bindable(), exercise = $bindable() }: Props = $props();

    let recalcWarmups = $state(true);

    // svelte-ignore state_referenced_locally
    let tempWeight = $state(exercise.workingWeight);

    function closeModal() {
        show = false;
    }

    function saveWeight() {
        exercise.workingWeight = tempWeight;
        exercise.workingSets = Workout.generateWorkingSets(exercise.lift, tempWeight);

        if (recalcWarmups) {
            exercise.warmupSets = Workout.generateWarmupSets(exercise.lift, tempWeight);
        }

        closeModal();
    }
</script>

<dialog open={show} class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3 class="text-lg font-bold">{liftDisplayName(exercise.lift)}</h3>
        <div class="mb-4">Working Weight</div>

        <div class="form-control">
            <div class="flex justify-around gap-6">
                <button
                    class="btn btn-secondary join-item text-lg"
                    onclick={() => (tempWeight -= 5)}>-5</button
                >

                <input
                    type="number"
                    bind:value={tempWeight}
                    class="input input-bordered join-item rounded-full text-center font-mono text-2xl font-black"
                />

                <button
                    class="btn btn-secondary join-item text-lg"
                    onclick={() => (tempWeight += 5)}>+5</button
                >
            </div>
        </div>

        <label class="label mt-4">
            <input type="checkbox" class="checkbox" bind:checked={recalcWarmups} />
            Recalculate warmup sets
        </label>

        <div class="modal-action mt-6">
            <button class="btn" onclick={closeModal}>Cancel</button>
            <button class="btn btn-primary px-8" onclick={saveWeight}>Save</button>
        </div>
    </div>
</dialog>
