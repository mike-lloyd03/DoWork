<script lang="ts">
    import { resolve } from "$app/paths";
    import { CircleCheck, Clock, Trophy, Loader } from "@lucide/svelte";
    import type { PageProps } from "./$types";
    import { DateTime } from "luxon";

    let { data }: PageProps = $props();

    interface HistoryItem {
        id: number;
        date: DateTime | undefined;
        name: string;
        duration: string;
        exercises: {
            code: string;
            weight: number;
            success: boolean;
        }[];
    }

    let history: HistoryItem[] = $derived(
        data.workouts.map((w) => {
            let duration = "";
            if (w.data.startTime && w.data.endTime) {
                const d = w.data.endTime.diff(w.data.startTime);
                const mins = Math.round(d.minutes);
                duration = `${mins}m`;
            }

            return {
                id: w.data.id ?? 0,
                date: w.data.startTime,
                name: `Workout ${w.data.type}`,
                duration,
                exercises: w.data.exercises.map((e) => ({
                    code: abbreviations[e.lift],
                    weight: e.workingWeight,
                    success: e.success ?? false,
                })),
            };
        }),
    );

    const abbreviations: Record<string, string> = {
        squat: "SQ",
        benchPress: "BP",
        barbellRow: "ROW",
        ohp: "OHP",
        deadlift: "DL",
    };

    // Helpers for date formatting
    const getDay = (d: DateTime) => d.day;
    const getMonth = (d: DateTime) => d.toFormat("MMM");
    const getDayName = (d: DateTime) => d.toFormat("ccc");
</script>

<div class="space-y-4 p-4 pb-24">
    <div class="navbar bg-base-100 rounded-box min-h-16 shadow-sm">
        <div class="flex-1">
            <h1 class="text-primary px-2 text-xl font-black tracking-tighter uppercase">History</h1>
        </div>
        <div class="text-base-content/60 flex-none font-mono text-sm">
            {history.length} Workouts
        </div>
    </div>

    {#if history.length === 0}
        <div class="hero bg-base-200 rounded-box min-h-[50vh]">
            <div class="hero-content text-center">
                <div class="max-w-md">
                    <Trophy size={48} class="text-base-content/20 mx-auto mb-4" />
                    <h1 class="text-2xl font-bold">No workouts yet</h1>
                    <p class="text-base-content/60 py-6">
                        Complete your first session to see your progress here.
                    </p>
                    <a href={resolve("/workout/new")} class="btn btn-primary">Start Now</a>
                </div>
            </div>
        </div>
    {:else}
        {#each history as session (session.id)}
            <a
                href={resolve(`/workout/${session.id}`)}
                class="card card-side bg-base-100 border-base-200 border shadow-sm"
            >
                {#if session.date}
                    <div
                        class="bg-base-200/50 border-base-200 flex w-20 flex-col items-center justify-center rounded-l-xl border-r"
                    >
                        <span class="text-base-content/50 text-xs font-bold uppercase">
                            {getMonth(session.date)}
                        </span>
                        <span class="text-primary text-2xl font-black">
                            {getDay(session.date)}
                        </span>
                        <span class="text-base-content/40 text-xs">
                            {getDayName(session.date)}
                        </span>
                    </div>
                {/if}

                <div class="card-body gap-1 p-4">
                    <div class="flex items-start justify-between">
                        <h2 class="text-lg font-bold">{session.name}</h2>

                        <div class="text-base-content/50 flex items-center gap-1 text-xs">
                            {#if session.duration}
                                <Clock size={12} />
                                {session.duration}
                            {:else}
                                In Progress
                            {/if}
                        </div>
                    </div>

                    <div class="mt-2 flex flex-wrap gap-2">
                        {#each session.exercises as lift}
                            <div
                                class="badge badge-lg h-auto gap-2 py-1 pr-2.5 pl-1.5
								{lift.success ? 'badge-neutral' : 'badge-error badge-outline'}"
                            >
                                {#if lift.success}
                                    <CircleCheck size={12} class="text-success" />
                                {:else}
                                    <div class="bg-error h-3 w-3 rounded-full"></div>
                                {/if}

                                <div class="flex flex-col items-start gap-0.5 leading-none">
                                    <span class="text-[10px] font-bold tracking-wide opacity-70">
                                        {lift.code}
                                    </span>
                                    <span class="font-mono text-xs font-bold">
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
