<script lang="ts">
	import { resolve } from '$app/paths';
	import { CircleCheck, Clock, Trophy } from '@lucide/svelte';

	let history = $state([
		{
			id: 102,
			date: new Date('2023-10-27T18:30:00'),
			name: 'Workout A',
			duration: '48m',
			exercises: [
				{ code: 'SQ', weight: 225, success: true },
				{ code: 'BP', weight: 135, success: true },
				{ code: 'BR', weight: 140, success: false } // Failed 5x5
			]
		},
		{
			id: 101,
			date: new Date('2023-10-25T07:00:00'),
			name: 'Workout B',
			duration: '42m',
			exercises: [
				{ code: 'SQ', weight: 220, success: true },
				{ code: 'OHP', weight: 95, success: true },
				{ code: 'DL', weight: 245, success: true }
			]
		},
		{
			id: 100,
			date: new Date('2023-10-23T07:00:00'),
			name: 'Workout A',
			duration: '45m',
			exercises: [
				{ code: 'SQ', weight: 215, success: true },
				{ code: 'BP', weight: 130, success: true },
				{ code: 'BR', weight: 135, success: true }
			]
		}
	]);

	// Helpers for date formatting
	const getDay = (d: Date) => d.getDate();
	const getMonth = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' });
	const getDayName = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short' });
</script>

<div class="p-4 space-y-4 pb-24">
	<div class="navbar bg-base-100 rounded-box shadow-sm min-h-[4rem]">
		<div class="flex-1">
			<h1 class="text-xl font-black tracking-tighter text-primary uppercase px-2">History</h1>
		</div>
		<div class="flex-none text-sm text-base-content/60 font-mono">
			{history.length} Workouts
		</div>
	</div>

	{#if history.length === 0}
		<div class="hero min-h-[50vh] bg-base-200 rounded-box">
			<div class="hero-content text-center">
				<div class="max-w-md">
					<Trophy size={48} class="mx-auto text-base-content/20 mb-4" />
					<h1 class="text-2xl font-bold">No workouts yet</h1>
					<p class="py-6 text-base-content/60">
						Complete your first session to see your progress here.
					</p>
					<a href={resolve('/workout/new')} class="btn btn-primary">Start Now</a>
				</div>
			</div>
		</div>
	{:else}
		{#each history as session (session.id)}
			<div class="card card-side bg-base-100 shadow-sm border border-base-200">
				<div
					class="flex flex-col items-center justify-center w-20 bg-base-200/50 rounded-l-xl border-r border-base-200"
				>
					<span class="text-xs font-bold text-base-content/50 uppercase"
						>{getMonth(session.date)}</span
					>
					<span class="text-2xl font-black text-primary">{getDay(session.date)}</span>
					<span class="text-xs text-base-content/40">{getDayName(session.date)}</span>
				</div>

				<div class="card-body p-4 gap-1">
					<div class="flex justify-between items-start">
						<h2 class="font-bold text-lg">{session.name}</h2>
						<div class="flex items-center text-xs text-base-content/50 gap-1">
							<Clock size={12} />
							{session.duration}
						</div>
					</div>

					<div class="flex flex-wrap gap-2 mt-2">
						{#each session.exercises as lift (lift.code)}
							<div
								class="badge badge-lg gap-2 h-auto py-1 pl-1.5 pr-2.5
								{lift.success ? 'badge-neutral' : 'badge-error badge-outline'}"
							>
								{#if lift.success}
									<CircleCheck size={12} class="text-success" />
								{:else}
									<div class="w-3 h-3 rounded-full bg-error"></div>
								{/if}

								<div class="flex flex-col items-start leading-none gap-0.5">
									<span class="text-[10px] opacity-70 font-bold tracking-wide">{lift.code}</span>
									<span class="text-xs font-mono font-bold">{lift.weight}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>
