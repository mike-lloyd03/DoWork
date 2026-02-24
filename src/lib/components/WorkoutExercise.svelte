<script lang="ts">
    import type { Exercise } from "$lib/database/Workout";
    import { liftDisplayName } from "$lib/utils";
    import { Dumbbell } from "@lucide/svelte";

    interface Props {
        exercise: Exercise
    }
    
    let {exercise}: Props = $props();

function calculateSets(): string {
    let nSets = 0
    let nReps = 0
    if (exercise.workingSets && exercise.workingSets.length > 0) {
        const firstReps = exercise.workingSets[0].targetReps;
        if (exercise.workingSets.every(s => s.targetReps == firstReps)) {
            nSets = exercise.workingSets.length
            nReps = firstReps
            return `${nSets}x${nReps}`
        } else  {
            return "varied"
        }
    } else {
        return "none"
    }
}

</script>

<tr class="border-b-0">
    <td class="w-10 p-2">
        <div class="bg-base-100 p-2 rounded-lg text-primary">
            <Dumbbell size={18} />
        </div>
    </td>
    <td class="font-bold text-base">{liftDisplayName(exercise.lift)}</td>
    <td class="text-right">
        <div class="font-mono font-black text-lg">
            {exercise.workingWeight}<span class="text-xs font-normal text-base-content/60 ml-1"
                >lb</span
            >
        </div>
        <div class="text-xs text-base-content/50">{calculateSets()}</div>
    </td>
</tr>
