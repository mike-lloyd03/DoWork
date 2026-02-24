<script lang="ts">
    import type { Exercise } from "$lib/database/Workout";
    import { liftDisplayName } from "$lib/utils";
    import { Dumbbell } from "@lucide/svelte";
    import EditWeightModal from "./EditWeightModal.svelte";

    interface Props {
        exercise: Exercise;
        editMode?: boolean;
    }

    let { exercise = $bindable(), editMode }: Props = $props();

    let showEditWeightModal = $state(false);

    function toggleSet(index: number) {
        if (!editMode) {
            return;
        }

        if (index > 0 && exercise.workingSets.length > index - 1) {
            if (exercise.workingSets[index - 1].completedReps === 0) {
                return;
            }
        }

        const current = exercise.workingSets[index].completedReps;

        if (current === 0) {
            exercise.workingSets[index].completedReps = 5;
        } else if (current > 0) {
            exercise.workingSets[index].completedReps = current - 1;
        } else {
            exercise.workingSets[index].completedReps = 0;
        }
    }

    function getBubbleClass(reps: number) {
        if (reps == 0) return "btn-ghost bg-base-200 text-base-content/20";
        if (reps == 5) return "btn-success text-success-content shadow-lg shadow-success/20";
        return "btn-warning text-warning-content";
    }

    function showEditWeightModalCheck() {
        if (editMode) {
            showEditWeightModal = true;
        }
    }
</script>

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

        <div class="flex items-center justify-between gap-1">
            {#each exercise.workingSets as set, i (i)}
                <button
                    class="btn btn-circle btn-lg border-none text-xl font-black transition-all duration-200 {getBubbleClass(
                        set.completedReps,
                    )}"
                    onclick={() => toggleSet(i)}
                >
                    {set.completedReps}
                </button>
            {/each}
        </div>
    </div>
</div>

<EditWeightModal bind:show={showEditWeightModal} {exercise} />
