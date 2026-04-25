<script lang="ts">
    import type { Lift } from "$lib/database/Workout.svelte";
    import { liftDisplayName } from "$lib/utils";

    interface Props {
        prs: Map<Lift, number>;
        allLifts: Lift[];
        colors: Record<Lift, string>;
    }

    let { prs, allLifts, colors }: Props = $props();
</script>

{#if prs.size > 0}
    <div class="bg-base-100 rounded-box p-4 shadow-sm">
        <h3 class="text-base-content/50 mb-3 text-xs font-bold uppercase tracking-wider">
            Personal Records
        </h3>
        <div class="grid grid-cols-2 gap-3">
            {#each allLifts as lift}
                {@const pr = prs.get(lift)}
                {#if pr}
                    <div class="flex items-center gap-2.5">
                        <div
                            class="h-3 w-3 shrink-0 rounded-full"
                            style="background-color: {colors[lift]};"
                        ></div>
                        <div class="min-w-0">
                            <p class="text-base-content/50 truncate text-xs">
                                {liftDisplayName(lift)}
                            </p>
                            <p class="font-mono text-sm font-bold">{pr} lbs</p>
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
{/if}
