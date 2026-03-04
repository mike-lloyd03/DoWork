<script lang="ts">
    import { resolve } from "$app/paths";
    import { Play, Trophy, Scale, History } from "@lucide/svelte";
    import type { PageProps } from "./$types";
    import type { WorkoutModel } from "$lib/database/Workout";
    import WorkoutExercise from "$lib/components/WorkoutExercise.svelte";

    let { data }: PageProps = $props();

    let nextWorkout: WorkoutModel | undefined = $derived(
        data.nextWorkout?.data ?? data.activeWorkout?.data,
    );
    let activeWorkout = $derived(data.activeWorkout != undefined);

    let userStats = $state({
        bodyweight: 185,
        streak: 4,
    });
</script>

<div class="space-y-6 p-4 pb-24">
    <div class="navbar bg-base-100 rounded-box min-h-16 shadow-sm">
        <div class="flex-1">
            <a
                href={resolve("/")}
                class="btn btn-ghost text-primary text-xl font-black tracking-tighter"
            >
                DoWork
            </a>
        </div>
        <div class="flex-none gap-2">
            <div class="avatar placeholder">
                <div class="bg-neutral text-neutral-content w-10 rounded-full">
                    <span class="text-xs">ME</span>
                </div>
            </div>
        </div>
    </div>

    {#if nextWorkout}
        <div class="card bg-base-100 border-primary border-t-4 shadow-xl">
            <div class="card-body p-6">
                <div class="mb-2 flex items-start justify-between">
                    <div>
                        <h2 class="card-title text-3xl font-bold">
                            Workout {nextWorkout.type}
                        </h2>
                        <p class="text-base-content/60 mt-1 flex items-center gap-1 text-sm">
                            <History size={14} /> Last: {123456}
                        </p>
                    </div>
                    <div class="badge badge-primary badge-lg font-bold">
                        {activeWorkout ? "In Progress" : "Next"}
                    </div>
                </div>

                <div class="bg-base-200/50 my-4 overflow-x-auto rounded-xl p-2">
                    <table class="table-zebra table w-full">
                        <tbody>
                            {#each nextWorkout.exercises as exercise, i (i)}
                                <WorkoutExercise {exercise} />
                            {/each}
                        </tbody>
                    </table>
                </div>

                <div class="card-actions mt-2">
                    <a
                        href={resolve("/workout/new")}
                        class="btn btn-primary btn-lg btn-block group gap-3 text-lg"
                    >
                        <Play
                            size={24}
                            class="fill-current transition-transform group-hover:scale-110"
                        />
                        {activeWorkout ? "Resume" : "Start"} Workout
                    </a>
                </div>
            </div>
        </div>
    {/if}

    <div class="grid grid-cols-2 gap-4">
        <div class="stats bg-base-100 shadow">
            <div class="stat p-4">
                <div class="stat-figure text-secondary">
                    <Scale size={32} strokeWidth={1.5} />
                </div>
                <div class="stat-title text-xs font-bold tracking-wider uppercase">Body Weight</div>
                <div class="stat-value text-2xl">{userStats.bodyweight}</div>
                <div class="stat-desc text-secondary">lbs</div>
            </div>
        </div>

        <div class="stats bg-base-100 shadow">
            <div class="stat p-4">
                <div class="stat-figure text-accent">
                    <Trophy size={32} strokeWidth={1.5} />
                </div>
                <div class="stat-title text-xs font-bold tracking-wider uppercase">Streak</div>
                <div class="stat-value text-2xl">{userStats.streak}</div>
                <div class="stat-desc text-accent">Workouts</div>
            </div>
        </div>
    </div>
</div>
