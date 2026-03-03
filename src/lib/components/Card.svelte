<script lang="ts">
    import { Dumbbell, Flame } from "@lucide/svelte";
    import type { Snippet } from "svelte";

    interface Props {
        title: string;
        icon?: "flame" | "dumbbell";
        bgColor?: "neutral" | "base-300";
        children: Snippet;
    }

    let { title, icon, bgColor = "neutral", children }: Props = $props();

    let bgColorClass = $derived(
        bgColor == "neutral" ? "bg-neutral" : bgColor == "base-300" ? "bg-base-300" : "",
    );
</script>

<div class="{bgColorClass} card flex flex-col rounded-md p-4">
    <div class="mb-3 flex items-center gap-2">
        {#if icon}
            <div class="text-base-content/40">
                {#if icon == "flame"}
                    <Flame size={18} />
                {:else if icon == "dumbbell"}
                    <Dumbbell size={18} />
                {/if}
            </div>
        {/if}

        <h3 class="text-base-content/50 text-xs font-bold tracking-widest uppercase">
            {title}
        </h3>
    </div>

    {@render children()}
</div>
