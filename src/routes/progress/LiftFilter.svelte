<script lang="ts">
    import type { Lift } from "$lib/database/Workout.svelte";
    import { liftDisplayName } from "$lib/utils";

    interface Props {
        allLifts: Lift[];
        enabledLifts: Set<Lift>;
        colors: Record<Lift, string>;
        ontoggle: (lift: Lift) => void;
    }

    let { allLifts, enabledLifts, colors, ontoggle }: Props = $props();
</script>

<div class="bg-base-100 rounded-box p-4 shadow-sm">
    <div class="flex flex-wrap gap-2">
        {#each allLifts as lift}
            <button
                class="inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-bold transition-opacity {enabledLifts.has(
                    lift,
                )
                    ? ''
                    : 'opacity-25'}"
                style="border-color: {colors[lift]}; color: {colors[lift]}; background-color: {colors[lift]}18;"
                onclick={() => ontoggle(lift)}
            >
                <span class="h-2 w-2 rounded-full" style="background-color: {colors[lift]};"></span>
                {liftDisplayName(lift)}
            </button>
        {/each}
    </div>
</div>
