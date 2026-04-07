<script lang="ts">
    interface Props {
        title: string;
        altText?: string;
    }

    let { title, altText }: Props = $props();
</script>

<div class="navbar bg-base-100 rounded-box min-h-16 px-4 shadow-sm">
    <div class="flex-1">
        <h1 class="text-primary text-xl font-black tracking-tighter">{title}</h1>
    </div>

    {#if altText}
        <div class="text-base-content/60 text-md flex-none">
            {altText}
        </div>
    {/if}
</div>
