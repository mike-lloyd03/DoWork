<script lang="ts">
    import { Menu } from "@lucide/svelte";

    interface Props {
        items: { text: string; action: () => void }[];
    }

    let { items }: Props = $props();
</script>

<!-- change popover-1 and --anchor-1 names. Use unique names for each dropdown -->
<button class="btn" popovertarget="popover-1" style="anchor-name:--anchor-1"> <Menu /> </button>
<ul
    class="dropdown menu rounded-box bg-base-100 w-52 shadow-sm"
    popover
    id="popover-1"
    style="position-anchor:--anchor-1"
>
    {#each items as item}
        <li><button onclick={item.action}>{item.text}</button></li>
    {/each}
</ul>
