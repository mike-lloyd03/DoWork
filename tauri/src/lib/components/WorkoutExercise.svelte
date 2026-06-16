<script lang="ts">
    import type { Exercise } from "$lib/database/Workout.svelte";
    import { liftDisplayName } from "$lib/utils";
    import { Dumbbell } from "@lucide/svelte";

    interface Props {
        exercise: Exercise;
    }

    let { exercise }: Props = $props();

    function calculateSets(): string {
        let nSets = 0;
        let nReps = 0;
        if (exercise.workingSets && exercise.workingSets.length > 0) {
            const firstReps = exercise.workingSets[0].targetReps;
            if (exercise.workingSets.every((s) => s.targetReps == firstReps)) {
                nSets = exercise.workingSets.length;
                nReps = firstReps;
                return `${nSets}x${nReps}`;
            } else {
                return "varied";
            }
        } else {
            return "none";
        }
    }
</script>

<tr class="border-b-0">
    <td class="w-10 p-2">
        <div class="bg-base-100 text-primary rounded-lg p-2">
            <Dumbbell size={18} />
        </div>
    </td>
    <td class="text-base font-bold">{liftDisplayName(exercise.lift)}</td>
    <td class="text-right">
        <div class="font-mono text-lg font-black">
            {exercise.workingWeight}<span class="text-base-content/60 ml-1 text-xs font-normal"
                >lb</span
            >
        </div>
        <div class="text-base-content/50 text-xs">{calculateSets()}</div>
    </td>
</tr>
