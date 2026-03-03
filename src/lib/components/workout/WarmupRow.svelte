<script lang="ts">
    import type { Exercise } from "$lib/database/Workout";
    import { liftDisplayName } from "$lib/utils";
    import { Flame } from "@lucide/svelte";

    interface Props {
        exercise: Exercise;
        editMode?: boolean;
    }

    let { exercise = $bindable(), editMode }: Props = $props();

    function toggleSet(index: number) {
        if (!editMode) {
            return;
        }

        if (index > 0 && exercise.warmupSets.length > index - 1) {
            if (exercise.warmupSets[index - 1].completedReps === 0) {
                return;
            }
        }

        const current = exercise.warmupSets[index].completedReps;
        const target = exercise.warmupSets[index].targetReps;

        if (current === 0) {
            exercise.warmupSets[index].completedReps = target;
        } else if (current > 0) {
            exercise.warmupSets[index].completedReps = current - 1;
        } else {
            exercise.warmupSets[index].completedReps = 0;
        }
    }

    function getBubbleClass(reps: number, target: number) {
        if (reps == 0) return "btn-ghost bg-base-200 text-base-content/20";
        if (reps == target) return "btn-neutral shadow-sm";
        return "btn-warning text-warning-content";
    }
</script>

{#if exercise.warmupSets && exercise.warmupSets.length > 0}
    <div class="card bg-base-100 border-base-200 mb-4 border border-dashed shadow-sm">
        <div class="card-body p-3">
            <div class="mb-3 flex items-center gap-2">
                <div class="text-base-content/40">
                    <Flame size={18} />
                </div>
                <h3 class="text-base-content/50 text-xs font-bold tracking-widest uppercase">
                    Warmup • {liftDisplayName(exercise.lift)}
                </h3>
            </div>

            <div class="flex items-start gap-2 overflow-x-auto pb-1">
                {#each exercise.warmupSets as set, i (i)}
                    <div class="flex min-w-12 flex-col items-center gap-1.5">
                        <button
                            class="btn btn-circle btn-md border-none text-base font-bold transition-all duration-200 {getBubbleClass(
                                set.completedReps,
                                set.targetReps,
                            )}"
                            onclick={() => toggleSet(i)}
                        >
                            {set.completedReps || ""}
                        </button>

                        <span class="font-mono text-[11px] font-bold opacity-60">
                            {set.weight}
                        </span>
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}
