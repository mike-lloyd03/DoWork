<script lang="ts">
	import { Dumbbell } from '@lucide/svelte';
	// import { Haptics, ImpactStyle } from '@capacitor/haptics'; // Uncomment when running on device

	let {
		name = 'Exercise',
		weight = 45,
		sets = $bindable([null, null, null, null, null])
	} = $props();

	// Logic: Empty -> 5 -> 4 -> 3... -> 0 -> Empty
	function toggleSet(index: number) {
		// Haptics.impact({ style: ImpactStyle.Light }); // Trigger vibration

		const current = sets[index];

		if (current === null) {
			sets[index] = 5; // Default to Success (5 reps)
		} else if (current > 0) {
			sets[index] = current - 1; // Decrement on failure
		} else {
			sets[index] = null; // Reset to empty
		}
	}

	// Helper for bubble styling
	function getBubbleClass(reps: number | null) {
		if (reps === null) return 'btn-ghost bg-base-200 text-base-content/20'; // Empty
		if (reps === 5) return 'btn-success text-success-content shadow-lg shadow-success/20'; // Success
		return 'btn-warning text-warning-content'; // Failure (anything less than 5)
	}
</script>

<div class="card bg-base-100 shadow-sm border border-base-200">
	<div class="card-body p-4">
		<div class="flex justify-between items-center mb-4">
			<div class="flex items-center gap-3">
				<div class="p-2 bg-primary/10 rounded-lg text-primary">
					<Dumbbell size={20} />
				</div>
				<h3 class="font-bold text-lg">{name}</h3>
			</div>
			<div class="text-xl font-black font-mono tracking-tight">
				{weight} <span class="text-xs font-normal text-base-content/60">lbs</span>
			</div>
		</div>

		<div class="flex justify-between items-center gap-1">
			{#each sets as reps, i (i)}
				<button
					class="btn btn-circle btn-lg text-xl font-black transition-all duration-200 border-none {getBubbleClass(
						reps
					)}"
					onclick={() => toggleSet(i)}
				>
					{reps === null ? '' : reps}
				</button>
			{/each}
		</div>
	</div>
</div>
