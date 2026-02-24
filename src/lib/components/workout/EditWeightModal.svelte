<script lang="ts">
    import type { Exercise } from "$lib/database/Workout";
    import { liftDisplayName } from "$lib/utils";

    interface Props {
        show: boolean;
        exercise: Exercise;
    }

    let { show = $bindable(), exercise = $bindable() }: Props = $props();

    // svelte-ignore state_referenced_locally
    let tempWeight = $state(exercise.workingWeight);

    function closeModal() {
        show = false;
    }
    function saveWeight() {
        exercise.workingWeight = tempWeight;
        closeModal();
    }
</script>

<dialog open={show} class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <h3 class="text-lg font-bold">{liftDisplayName(exercise.lift)}</h3>
        <div class="mb-4">Working Weight</div>

        <div class="form-control w-full">
            <div class="join w-full">
                <button class="btn join-item text-lg" onclick={() => (tempWeight -= 5)}>-5</button>

                <input
                    type="number"
                    bind:value={tempWeight}
                    class="input input-bordered join-item w-full text-center font-mono text-2xl font-black"
                />

                <button class="btn join-item text-lg" onclick={() => (tempWeight += 5)}>+5</button>
            </div>
        </div>

        <div class="modal-action mt-6">
            <button class="btn btn-ghost" onclick={closeModal}>Cancel</button>
            <button class="btn btn-primary px-8" onclick={saveWeight}>Save</button>
        </div>
    </div>
</dialog>
