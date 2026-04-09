<script context="module">
    let idCounter = 0;
</script>

<script lang="ts">
    import { Workout, type Exercise, type Lift } from "$lib/database/Workout.svelte";
    import { liftDisplayName } from "$lib/utils";

    interface Props {
        open: boolean;
        exercise: Exercise;
    }

    let { open = $bindable(), exercise = $bindable() }: Props = $props();

    const instanceId = idCounter++;

    let selectedLift: Lift | undefined = $state();
    let searchFilter = $state("");
    const lifts: Lift[] = ["squat", "benchPress", "barbellRow", "ohp", "deadlift"];
    let filteredLifts = $derived(
        lifts.filter(
            (l) =>
                exercise.lift != l &&
                (l.includes(searchFilter.toLowerCase()) ||
                    liftDisplayName(l).toLowerCase().includes(searchFilter.toLowerCase())),
        ),
    );

    function closeModal() {
        selectedLift = undefined;
        searchFilter = "";
        open = false;
    }

    async function handleSubmit() {
        if (selectedLift) {
            const nextExercise = await Workout.generateExercise(selectedLift);
            exercise = nextExercise;
        }

        closeModal();
    }
</script>

<dialog {open} class="modal is-active z-50">
    <div class="modal-box">
        <h3 class="text-lg font-bold">Replace Exercise</h3>

        <div class="form-control mt-4 space-y-4">
            <input placeholder="Search..." bind:value={searchFilter} class="input w-full" />
            <div class="flex flex-col gap-2 overflow-y-auto">
                {#each filteredLifts as lift}
                    <div class="w-full">
                        <label
                            for="radio-{instanceId}-{lift}"
                            class="btn w-full"
                            class:btn-active={selectedLift !== lift}
                            class:btn-secondary={selectedLift === lift}
                        >
                            <input
                                type="radio"
                                id="radio-{instanceId}-{lift}"
                                name="lift_selection"
                                value={lift}
                                bind:group={selectedLift}
                                class="sr-only"
                            />
                            {liftDisplayName(lift)}
                        </label>
                    </div>
                {/each}
            </div>
        </div>

        <div class="modal-action">
            <button class="btn btn-ghost" onclick={closeModal}>Cancel</button>
            <button class="btn btn-primary" onclick={handleSubmit}>Save</button>
        </div>
    </div>

    <button class="modal-backdrop" aria-label="Close modal" onclick={closeModal}></button>
</dialog>
