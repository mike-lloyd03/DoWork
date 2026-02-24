<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet
    }
    
    let { children }: Props = $props();
</script>

<div
    class="fixed bottom-0 left-0 right-0 p-4 bg-base-100 border-t border-base-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 pb-[env(safe-area-inset-bottom)]"
>
    {@render children()}
</div>
