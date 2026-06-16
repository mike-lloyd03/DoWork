<script module lang="ts">
    export type TimeRange = "1M" | "3M" | "6M" | "1Y" | "ALL";

    export const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
        { value: "1M", label: "1M" },
        { value: "3M", label: "3M" },
        { value: "6M", label: "6M" },
        { value: "1Y", label: "1Y" },
        { value: "ALL", label: "All" },
    ];
</script>

<script lang="ts">
    interface Props {
        value: TimeRange;
        onchange: (value: TimeRange) => void;
    }

    let { value, onchange }: Props = $props();
</script>

<div class="bg-base-100 rounded-box p-3 shadow-sm">
    <div class="join w-full">
        {#each TIME_RANGE_OPTIONS as opt}
            <button
                class="join-item btn btn-sm flex-1 {value === opt.value ? 'btn-primary' : 'btn-ghost'}"
                onclick={() => onchange(opt.value)}
            >
                {opt.label}
            </button>
        {/each}
    </div>
</div>
