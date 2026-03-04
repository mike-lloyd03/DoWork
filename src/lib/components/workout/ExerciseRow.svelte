<script lang="ts">
    import type { Exercise, Set } from "$lib/database/Workout";
    import { liftDisplayName } from "$lib/utils";
    import { Dumbbell } from "@lucide/svelte";
    import EditWeightModal from "./EditWeightModal.svelte";
    import Card from "../Card.svelte";

    interface Props {
        exercise: Exercise;
        editMode?: boolean;
    }

    let { exercise = $bindable(), editMode }: Props = $props();

    let showEditWeightModal = $state(false);

    function toggleSet(index: number, setType: "working" | "warmup") {
        if (!editMode) {
            return;
        }

        let current;
        let target;

        if (setType == "working") {
            current = exercise.workingSets[index].completedReps;
            target = exercise.workingSets[index].targetReps;

            if (index > 0 && exercise.workingSets.length > index - 1) {
                if (exercise.workingSets[index - 1].completedReps === null) {
                    return;
                }
            }
        } else {
            current = exercise.warmupSets[index].completedReps;
            target = exercise.warmupSets[index].targetReps;

            if (index > 0 && exercise.warmupSets.length > index - 1) {
                if (exercise.warmupSets[index - 1].completedReps === null) {
                    return;
                }
            }
        }

        let completedReps = null;

        if (current === null) {
            completedReps = target;
        } else if (current > 0) {
            completedReps = current - 1;
        } else if (current === 0) {
            completedReps = null;
        } else {
            completedReps = 0;
        }

        if (setType == "working") {
            exercise.workingSets[index].completedReps = completedReps;
        } else {
            exercise.warmupSets[index].completedReps = completedReps;
        }
    }

    function getBubbleClass(reps: number | null) {
        if (reps == null) return "btn-ghost bg-base-200 text-base-content/20";
        if (reps == 0) return "btn-error bg-error text-base-content/20";
        if (reps == 5) return "btn-success text-success-content shadow-lg shadow-success/20";
        return "btn-warning text-warning-content";
    }

    function showEditWeightModalCheck() {
        if (editMode) {
            showEditWeightModal = true;
        }
    }
</script>

{#snippet exerciseButton(set: Set, i: number, setType: "working" | "warmup")}
    <button
        class="btn btn-circle btn-lg border-none text-xl font-black transition-all duration-200 {getBubbleClass(
            set.completedReps,
        )}"
        onclick={() => toggleSet(i, setType)}
    >
        {set.completedReps}
    </button>
{/snippet}

<div class="card bg-base-100 border-base-200 border shadow-sm">
    <div class="card-body p-4">
        <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="bg-primary/10 text-primary rounded-lg p-2">
                    <Dumbbell size={20} />
                </div>
                <h3 class="text-lg font-bold">{liftDisplayName(exercise.lift)}</h3>
            </div>

            <button
                class="hover:bg-base-200 -mr-3 rounded-lg px-3 py-1 font-mono text-xl font-black tracking-tight transition-colors {editMode
                    ? 'active:bg-base-300'
                    : ''}"
                onclick={showEditWeightModalCheck}
            >
                {exercise.workingWeight}
                <span class="text-base-content/60 ml-1 text-xs font-normal">lbs</span>
            </button>
        </div>

        {#if exercise.warmupSets.length > 0}
            <Card title="Warmup" icon="flame" bgColor="base-300">
                <div class="flex justify-between">
                    {#each exercise.warmupSets as warmupSet, i (i)}
                        <div class="flex flex-col items-center gap-2">
                            <span class="text-base-content">{warmupSet.weight}</span>
                            {@render exerciseButton(warmupSet, i, "warmup")}
                        </div>
                    {/each}
                </div>
            </Card>
        {/if}

        <Card title="Working" icon="dumbbell" bgColor="base-300">
            <div class="flex items-center justify-between gap-1">
                {#each exercise.workingSets as set, i (i)}
                    {@render exerciseButton(set, i, "working")}
                {/each}
            </div>
        </Card>
    </div>
</div>

<EditWeightModal bind:show={showEditWeightModal} bind:exercise />
