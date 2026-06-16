<script lang="ts">
    import type { PageProps } from "./$types";
    import { DateTime } from "luxon";
    import type { Lift } from "$lib/database/Workout.svelte";
    import PageTitle from "$lib/components/PageTitle.svelte";
    import ProgressChart, { type DataPoint } from "./ProgressChart.svelte";
    import PersonalRecords from "./PersonalRecords.svelte";
    import LiftFilter from "./LiftFilter.svelte";
    import TimeRangeFilter, { type TimeRange } from "./TimeRangeFilter.svelte";

    let { data }: PageProps = $props();

    const ALL_LIFTS: Lift[] = ["squat", "benchPress", "barbellRow", "ohp", "deadlift"];

    const LIFT_COLORS: Record<Lift, string> = {
        squat: "#3b82f6",
        benchPress: "#f97316",
        barbellRow: "#22c55e",
        ohp: "#a855f7",
        deadlift: "#ef4444",
    };

    let timeRange = $state<TimeRange>("ALL");
    let enabledLifts = $state<Set<Lift>>(new Set(ALL_LIFTS));

    const allLiftData = $derived.by(() => {
        const result = new Map<Lift, DataPoint[]>();
        ALL_LIFTS.forEach((lift) => result.set(lift, []));

        data.workouts.forEach((workout) => {
            if (!workout.data.startTime || !workout.data.endTime) return;

            workout.data.exercises.forEach((exercise) => {
                if (exercise.success === true) {
                    result.get(exercise.lift)?.push({
                        date: workout.data.startTime!,
                        weight: exercise.workingWeight,
                    });
                }
            });
        });

        ALL_LIFTS.forEach((lift) => {
            result.get(lift)!.sort((a, b) => a.date.toMillis() - b.date.toMillis());
        });

        return result;
    });

    const filteredData = $derived.by(() => {
        const now = DateTime.now();
        const cutoffs: Record<TimeRange, DateTime | null> = {
            "1M": now.minus({ months: 1 }),
            "3M": now.minus({ months: 3 }),
            "6M": now.minus({ months: 6 }),
            "1Y": now.minus({ years: 1 }),
            ALL: null,
        };
        const cutoff = cutoffs[timeRange];

        const result = new Map<Lift, DataPoint[]>();
        allLiftData.forEach((points, lift) => {
            result.set(
                lift,
                cutoff
                    ? points.filter((p) => p.date.toMillis() >= cutoff.toMillis())
                    : [...points],
            );
        });
        return result;
    });

    const prs = $derived.by(() => {
        const result = new Map<Lift, number>();
        allLiftData.forEach((points, lift) => {
            if (points.length > 0) {
                result.set(lift, Math.max(...points.map((p) => p.weight)));
            }
        });
        return result;
    });

    function toggleLift(lift: Lift) {
        const next = new Set(enabledLifts);
        if (next.has(lift)) {
            if (next.size > 1) next.delete(lift);
        } else {
            next.add(lift);
        }
        enabledLifts = next;
    }
</script>

<div class="space-y-4 p-4 pb-24">
    <PageTitle title="Progress" altText="{data.workouts.length} Workouts" />

    <TimeRangeFilter value={timeRange} onchange={(v) => (timeRange = v)} />

    <LiftFilter allLifts={ALL_LIFTS} {enabledLifts} colors={LIFT_COLORS} ontoggle={toggleLift} />

    <ProgressChart data={filteredData} {enabledLifts} allLifts={ALL_LIFTS} colors={LIFT_COLORS} />

    <PersonalRecords {prs} allLifts={ALL_LIFTS} colors={LIFT_COLORS} />
</div>
