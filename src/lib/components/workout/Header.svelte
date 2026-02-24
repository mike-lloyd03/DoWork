<script lang="ts">
    import type { WorkoutType } from "$lib/database/Workout";
    import { ArrowLeft, Timer } from "@lucide/svelte";

    interface Props {
        workoutType: WorkoutType
    }
    
    let { workoutType }: Props = $props();

	function formatTime(seconds: number) {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s < 10 ? '0' : ''}${s}`;
	}
</script>

<div class="navbar bg-base-100 shadow-sm sticky top-0 z-50">
    <div class="flex-none">
        <button class="btn btn-ghost btn-circle" onclick={() => history.back()}>
            <ArrowLeft size={24} />
        </button>
    </div>

    <div class="flex-1">
        <h1 class="text-lg font-bold px-2">Workout {workoutType}</h1>
    </div>

    <div class="flex-none">
        <button class="btn btn-ghost gap-2 font-mono text-lg text-primary">
            <Timer size={20} class="animate-pulse" />
            0:00
        </button>
    </div>
</div>
