<script lang="ts">
	import { resolve } from '$app/paths';
	import { CircleCheck, Clock, Trophy, Loader} from '@lucide/svelte';
	import type { PageProps } from './$types';
    import { DateTime } from "luxon";

	let { data }: PageProps = $props();

	// UI Model for the view
	interface HistoryItem {
		id: number;
		date: DateTime;
		name: string;
		duration: string;
		exercises: {
			code: string;
			weight: number;
			success: boolean;
		}[];
	}

    let history: HistoryItem[] = $derived(
        data.workouts.map(w => {
            let duration = ""
            if (w.data.endTime) {
                const d = w.data.endTime.diff(w.data.startTime);    
                const mins = Math.round(d.minutes);
                duration = `${mins}m`
            }
            return {
                id: w.data.id ?? 0,
                date: w.data.startTime,
                name: `Workout ${w.data.type}`,
                duration,
                exercises: w.data.exercises.map(e => ({
                    code: abbreviations[e.lift],
                    weight: e.workingWeight,
                    success: e.success ?? false,
                }))
            }
        })
    )

	const abbreviations: Record<string, string> = {
		'squat': 'SQ',
		'benchPress': 'BP',
		'barbellRow': 'ROW',
		'ohp': 'OHP',
		'deadlift': 'DL'
	};

	// Helpers for date formatting
	const getDay = (d: DateTime) => d.day;
	const getMonth = (d: DateTime) => d.toFormat("MMM");
	const getDayName = (d: DateTime) => d.toFormat("ccc");
</script>

<div class="p-4 space-y-4 pb-24">
	<div class="navbar bg-base-100 rounded-box shadow-sm min-h-16">
		<div class="flex-1">
			<h1 class="text-xl font-black tracking-tighter text-primary uppercase px-2">History</h1>
		</div>
		<div class="flex-none text-sm text-base-content/60 font-mono">
				{history.length} Workouts
		</div>
	</div>

	{#if history.length == 0}
		<div class="flex justify-center items-center h-[50vh]">
			<Loader class="animate-spin text-primary" size={48} />
		</div>
	{:else if history.length === 0}
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
    <a href={resolve(`/workout/${session.id}`)} class="card card-side bg-base-100 shadow-sm border border-base-200">
				<div class="flex flex-col items-center justify-center w-20 bg-base-200/50 rounded-l-xl border-r border-base-200">
					<span class="text-xs font-bold text-base-content/50 uppercase">
						{getMonth(session.date)}
					</span>
					<span class="text-2xl font-black text-primary">
						{getDay(session.date)}
					</span>
					<span class="text-xs text-base-content/40">
						{getDayName(session.date)}
					</span>
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
						{#each session.exercises as lift}
							<div class="badge badge-lg gap-2 h-auto py-1 pl-1.5 pr-2.5 
								{lift.success ? 'badge-neutral' : 'badge-error badge-outline'}">
								
								{#if lift.success}
									<CircleCheck size={12} class="text-success" />
								{:else}
									<div class="w-3 h-3 rounded-full bg-error"></div>
								{/if}

								<div class="flex flex-col items-start leading-none gap-0.5">
									<span class="text-[10px] opacity-70 font-bold tracking-wide">
										{lift.code}
									</span>
									<span class="text-xs font-mono font-bold">
										{lift.weight}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</a>
		{/each}
	{/if}
</div>
