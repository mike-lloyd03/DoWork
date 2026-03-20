<script lang="ts">
    import { Menu } from "@lucide/svelte";

    interface Props {
        items: { text: string; action: () => void }[];
    }

    let { items }: Props = $props();

    let popoverElement: HTMLUListElement | undefined = $state();

    export function close() {
        popoverElement?.hidePopover();
    }
</script>

<button class="btn" popovertarget="popover-1" style="anchor-name:--anchor-1">
    <Menu />
</button>
<ul
    bind:this={popoverElement}
    class="dropdown menu rounded-box bg-base-100 w-52 shadow-sm"
    popover
    id="popover-1"
    style="position-anchor:--anchor-1"
>
    {#each items as item}
        <li>
            <button
                onclick={() => {
                    item.action();
                    popoverElement?.hidePopover();
                }}>{item.text}</button
            >
        </li>
    {/each}
</ul>
