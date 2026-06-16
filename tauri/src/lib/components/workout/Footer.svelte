<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
</script>

<div
    class="bg-base-100 border-base-300 fixed right-0 bottom-[env(safe-area-inset-bottom)] left-0 z-40 border-t p-4 pb-[env(safe-area-inset-bottom)]"
>
    <div class="flex justify-around">
        {@render children()}
    </div>
</div>
