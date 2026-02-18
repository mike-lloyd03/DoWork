<script lang="ts">
	import { resolve } from '$app/paths';
	import { Play, Trophy, Scale, History, Dumbbell } from '@lucide/svelte';

	let nextWorkout = $state({
		id: 'workout-a',
		name: 'Workout A',
		lastPerformed: '3 days ago',
		durationEstimate: '45 min',
		exercises: [
			{ name: 'Squat', sets: '5x5', weight: 225 },
			{ name: 'Bench Press', sets: '5x5', weight: 135 },
			{ name: 'Barbell Row', sets: '5x5', weight: 135 }
		]
	});
	let userStats = $state({
		bodyweight: 185,
		streak: 4
	});
</script>

<div class="p-4 space-y-6 pb-24">
	<div class="navbar bg-base-100 rounded-box shadow-sm min-h-[4rem]">
		<div class="flex-1">
			<a href={resolve('/')} class="btn btn-ghost text-xl font-black tracking-tighter text-primary">
				doWork
			</a>
		</div>
		<div class="flex-none gap-2">
			<div class="avatar placeholder">
				<div class="bg-neutral text-neutral-content rounded-full w-10">
					<span class="text-xs">ME</span>
				</div>
			</div>
		</div>
	</div>

	<div class="card bg-base-100 shadow-xl border-t-4 border-primary">
		<div class="card-body p-6">
			<div class="flex justify-between items-start mb-2">
				<div>
					<h2 class="card-title text-3xl font-bold">{nextWorkout.name}</h2>
					<p class="text-base-content/60 flex items-center gap-1 text-sm mt-1">
						<History size={14} /> Last: {nextWorkout.lastPerformed}
					</p>
				</div>
				<div class="badge badge-primary badge-lg font-bold">NEXT</div>
			</div>

			<div class="overflow-x-auto my-4 bg-base-200/50 rounded-xl p-2">
				<table class="table table-zebra w-full">
					<tbody>
						{#each nextWorkout.exercises as exercise (exercise.name)}
							<tr class="border-b-0">
								<td class="w-10 p-2">
									<div class="bg-base-100 p-2 rounded-lg text-primary">
										<Dumbbell size={18} />
									</div>
								</td>
								<td class="font-bold text-base">{exercise.name}</td>
								<td class="text-right">
									<div class="font-mono font-black text-lg">
										{exercise.weight}<span class="text-xs font-normal text-base-content/60 ml-1"
											>lb</span
										>
									</div>
									<div class="text-xs text-base-content/50">{exercise.sets}</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="card-actions mt-2">
				<a
					href={resolve('/workout/new')}
					class="btn btn-primary btn-lg btn-block shadow-lg gap-3 text-lg group"
				>
					<Play size={24} class="fill-current group-hover:scale-110 transition-transform" />
					Start Workout
				</a>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div class="stats shadow bg-base-100">
			<div class="stat p-4">
				<div class="stat-figure text-secondary">
					<Scale size={32} strokeWidth={1.5} />
				</div>
				<div class="stat-title text-xs font-bold uppercase tracking-wider">Body Weight</div>
				<div class="stat-value text-2xl">{userStats.bodyweight}</div>
				<div class="stat-desc text-secondary">lbs</div>
			</div>
		</div>

		<div class="stats shadow bg-base-100">
			<div class="stat p-4">
				<div class="stat-figure text-accent">
					<Trophy size={32} strokeWidth={1.5} />
				</div>
				<div class="stat-title text-xs font-bold uppercase tracking-wider">Streak</div>
				<div class="stat-value text-2xl">{userStats.streak}</div>
				<div class="stat-desc text-accent">Workouts</div>
			</div>
		</div>
	</div>
</div>
