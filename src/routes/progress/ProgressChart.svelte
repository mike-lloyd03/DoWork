<script module lang="ts">
    import { DateTime } from "luxon";
    import type { Lift } from "$lib/database/Workout.svelte";

    export interface DataPoint {
        date: DateTime;
        weight: number;
    }
</script>

<script lang="ts">
    import { TrendingUp } from "@lucide/svelte";

    interface Props {
        data: Map<Lift, DataPoint[]>;
        enabledLifts: Set<Lift>;
        allLifts: Lift[];
        colors: Record<Lift, string>;
    }

    let { data, enabledLifts, allLifts, colors }: Props = $props();

    const PAD = { top: 12, right: 16, bottom: 32, left: 48 };
    const W = 360;
    const H = 240;
    const PW = W - PAD.left - PAD.right;
    const PH = H - PAD.top - PAD.bottom;

    const chartBounds = $derived.by(() => {
        let minDateMs = Infinity;
        let maxDateMs = -Infinity;
        let minWeight = Infinity;
        let maxWeight = -Infinity;
        let hasData = false;

        data.forEach((points, lift) => {
            if (!enabledLifts.has(lift)) return;
            points.forEach((p) => {
                hasData = true;
                const ms = p.date.toMillis();
                if (ms < minDateMs) minDateMs = ms;
                if (ms > maxDateMs) maxDateMs = ms;
                if (p.weight < minWeight) minWeight = p.weight;
                if (p.weight > maxWeight) maxWeight = p.weight;
            });
        });

        if (!hasData) return null;

        const weightSpan = maxWeight - minWeight;
        const weightPad = Math.max(10, weightSpan * 0.12);
        const dateSpanMs = maxDateMs - minDateMs;
        const datePadMs = Math.max(86400000, dateSpanMs * 0.05);

        return {
            minDateMs: minDateMs - datePadMs,
            maxDateMs: maxDateMs + datePadMs,
            minWeight: Math.floor((minWeight - weightPad) / 5) * 5,
            maxWeight: Math.ceil((maxWeight + weightPad) / 5) * 5,
        };
    });

    function scaleX(ms: number): number {
        if (!chartBounds) return PAD.left;
        const range = chartBounds.maxDateMs - chartBounds.minDateMs;
        if (range === 0) return PAD.left + PW / 2;
        return PAD.left + ((ms - chartBounds.minDateMs) / range) * PW;
    }

    function scaleY(weight: number): number {
        if (!chartBounds) return PAD.top + PH / 2;
        const range = chartBounds.maxWeight - chartBounds.minWeight;
        if (range === 0) return PAD.top + PH / 2;
        return PAD.top + PH - ((weight - chartBounds.minWeight) / range) * PH;
    }

    function makePath(points: DataPoint[]): string {
        if (points.length === 0) return "";
        return points
            .map(
                (p, i) =>
                    `${i === 0 ? "M" : "L"} ${scaleX(p.date.toMillis()).toFixed(1)} ${scaleY(p.weight).toFixed(1)}`,
            )
            .join(" ");
    }

    const yTicks = $derived.by(() => {
        if (!chartBounds) return [];
        return Array.from({ length: 5 }, (_, i) => {
            const weight =
                chartBounds.minWeight + ((chartBounds.maxWeight - chartBounds.minWeight) * i) / 4;
            return { weight: Math.round(weight), y: scaleY(weight) };
        });
    });

    const xTicks = $derived.by(() => {
        if (!chartBounds) return [];
        return Array.from({ length: 5 }, (_, i) => {
            const ms =
                chartBounds.minDateMs +
                ((chartBounds.maxDateMs - chartBounds.minDateMs) * i) / 4;
            return { label: DateTime.fromMillis(ms).toFormat("M/d"), x: scaleX(ms) };
        });
    });

    const hasAnyData = $derived.by(() => {
        for (const [lift, points] of data) {
            if (enabledLifts.has(lift) && points.length > 0) return true;
        }
        return false;
    });
</script>

<div class="bg-base-100 rounded-box overflow-hidden shadow-sm">
    {#if hasAnyData}
        <svg viewBox="0 0 {W} {H}" width="100%" role="img" aria-label="Lift progress chart">
            <!-- Horizontal grid lines + y-axis labels -->
            {#each yTicks as tick}
                <line
                    x1={PAD.left}
                    y1={tick.y}
                    x2={W - PAD.right}
                    y2={tick.y}
                    stroke="currentColor"
                    stroke-opacity="0.08"
                    stroke-width="1"
                />
                <text
                    x={PAD.left - 6}
                    y={tick.y}
                    text-anchor="end"
                    dominant-baseline="middle"
                    font-size="10"
                    fill="currentColor"
                    fill-opacity="0.45">{tick.weight}</text
                >
            {/each}

            <!-- X-axis labels (skip edges to avoid clipping) -->
            {#each xTicks as tick, i}
                {#if i > 0 && i < xTicks.length - 1}
                    <text
                        x={tick.x}
                        y={H - PAD.bottom + 14}
                        text-anchor="middle"
                        font-size="9"
                        fill="currentColor"
                        fill-opacity="0.45">{tick.label}</text
                    >
                {/if}
            {/each}

            <!-- Axis lines -->
            <line
                x1={PAD.left}
                y1={PAD.top}
                x2={PAD.left}
                y2={PAD.top + PH}
                stroke="currentColor"
                stroke-opacity="0.15"
                stroke-width="1"
            />
            <line
                x1={PAD.left}
                y1={PAD.top + PH}
                x2={W - PAD.right}
                y2={PAD.top + PH}
                stroke="currentColor"
                stroke-opacity="0.15"
                stroke-width="1"
            />

            <!-- Lines per lift -->
            {#each allLifts as lift}
                {@const points = data.get(lift) ?? []}
                {#if enabledLifts.has(lift) && points.length > 1}
                    <path
                        d={makePath(points)}
                        fill="none"
                        stroke={colors[lift]}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        opacity="0.85"
                    />
                {/if}
            {/each}

            <!-- Dots per lift -->
            {#each allLifts as lift}
                {@const points = data.get(lift) ?? []}
                {#if enabledLifts.has(lift)}
                    {#each points as point}
                        <circle
                            cx={scaleX(point.date.toMillis())}
                            cy={scaleY(point.weight)}
                            r="3"
                            fill={colors[lift]}
                            opacity="0.9"
                        />
                    {/each}
                {/if}
            {/each}
        </svg>
    {:else}
        <div class="flex flex-col items-center justify-center gap-3 py-16">
            <TrendingUp size={40} class="text-base-content/20" />
            <p class="text-base-content/40 text-sm">No data in this time range</p>
        </div>
    {/if}
</div>
