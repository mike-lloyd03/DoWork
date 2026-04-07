<script lang="ts">
    import { Menu } from "@lucide/svelte";
    import type { Component } from "svelte";

    interface Props {
        id: string;
        items: { text: string; action: () => void }[];
        Icon?: Component;
        btnClasses?: string;
        disabled?: boolean;
    }

    let { id, items, Icon, btnClasses, disabled }: Props = $props();

    let popoverElement: HTMLUListElement | undefined = $state();

    export function close() {
        popoverElement?.hidePopover();
    }
</script>

<button
    class="btn {btnClasses}"
    popovertarget={disabled ? undefined : `popover-${id}`}
    style={`anchor-name:--anchor-${id}`}
>
    {#if Icon}
        <Icon />
    {:else}
        <Menu />
    {/if}
</button>

<ul
    bind:this={popoverElement}
    class="dropdown menu rounded-box bg-base-100 w-52 shadow-sm"
    popover
    id={`popover-${id}`}
    style={`position-anchor:--anchor-${id}`}
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
