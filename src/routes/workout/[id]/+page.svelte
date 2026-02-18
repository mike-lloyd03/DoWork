<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/state'; // To get the ID
	import { ArrowLeft, Timer, CircleCheck } from 'lucide-svelte';
	import ExerciseRow from '$lib/components/ExerciseRow.svelte';

	// 1. STATE MANAGEMENT
	let timer = $state(0);
	let timerInterval: any;

	// Mock Data (In reality, fetch this based on page.params.id)
	let workout = $state({
		name: 'Workout A',
		exercises: [
			{ id: 1, name: 'Squat', weight: 225, sets: [null, null, null, null, null] },
			{ id: 2, name: 'Bench Press', weight: 135, sets: [null, null, null, null, null] },
			{ id: 3, name: 'Barbell Row', weight: 135, sets: [null, null, null, null, null] }
		]
	});

	// 2. TIMER LOGIC
	onMount(() => {
		timerInterval = setInterval(() => {
			timer++;
		}, 1000);
	});

	onDestroy(() => {
		if (timerInterval) clearInterval(timerInterval);
	});

	function formatTime(seconds: number) {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s < 10 ? '0' : ''}${s}`;
	}

	function resetRestTimer() {
		// In a real app, this might start a specific 90s/3min countdown
		// For now, we just highlight it to show interaction
		timer = 0;
	}

	// 3. FINISH LOGIC
	function finishWorkout() {
		// TODO: Save to SQLite
		console.log('Saving workout:', workout);
		// Navigate back
		history.back();
	}
</script>

<div class="min-h-screen bg-base-200 pb-32">
	<div class="navbar bg-base-100 shadow-sm sticky top-0 z-50">
		<div class="flex-none">
			<button class="btn btn-ghost btn-circle" onclick={() => history.back()}>
				<ArrowLeft size={24} />
			</button>
		</div>
		<div class="flex-1">
			<h1 class="text-lg font-bold px-2">{workout.name}</h1>
		</div>
		<div class="flex-none">
			<button class="btn btn-ghost gap-2 font-mono text-lg text-primary" onclick={resetRestTimer}>
				<Timer size={20} class="animate-pulse" />
				{formatTime(timer)}
			</button>
		</div>
	</div>

	<div class="p-4 space-y-4">
		{#each workout.exercises as exercise (exercise.id)}
			<ExerciseRow name={exercise.name} weight={exercise.weight} bind:sets={exercise.sets} />
		{/each}

		<button class="btn btn-ghost btn-block text-base-content/50 dashed border-2 border-base-300">
			+ Add Workout Note
		</button>
	</div>

	<div
		class="fixed bottom-0 left-0 right-0 p-4 bg-base-100 border-t border-base-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40"
	>
		<button
			class="btn btn-primary btn-block btn-lg shadow-lg gap-3 text-xl"
			onclick={finishWorkout}
		>
			<CircleCheck size={24} strokeWidth={2.5} />
			Finish Workout
		</button>
	</div>
</div>
