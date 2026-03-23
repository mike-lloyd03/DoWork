<script lang="ts">
    import { DateTime } from "luxon";
    import { Calendar, Clock } from "@lucide/svelte";
    import { formatDuration } from "$lib/utils";

    interface Props {
        startTime: DateTime | undefined;
        endTime: DateTime | undefined;
        editMode?: boolean;
        tempStartTime?: string;
        tempEndTime?: string;
    }

    let {
        startTime,
        endTime,
        editMode = false,
        tempStartTime = $bindable(""),
        tempEndTime = $bindable(""),
    }: Props = $props();

    function formatDate(dt: DateTime | undefined): string {
        return dt?.toFormat("EEEE, MMMM d, yyyy") ?? "";
    }

    function formatTime(dt: DateTime | undefined): string {
        return dt?.toFormat("h:mm a") ?? "";
    }
</script>

<div class="card bg-base-100 shadow-sm">
    {#if editMode}
        <div class="card-body gap-3">
            <div>
                <label class="label py-1">
                    <span class="label-text text-xs font-medium tracking-wide uppercase opacity-70"
                        >Start</span
                    >
                </label>
                <input
                    type="datetime-local"
                    class="input input-bordered w-full"
                    bind:value={tempStartTime}
                />
            </div>
            <div>
                <label class="label py-1">
                    <span class="label-text text-xs font-medium tracking-wide uppercase opacity-70"
                        >End</span
                    >
                </label>
                <input
                    type="datetime-local"
                    class="input input-bordered w-full"
                    bind:value={tempEndTime}
                />
            </div>
        </div>
    {:else}
        <div class="card-body">
            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3">
                    <div class="bg-primary/10 rounded-full p-2">
                        <Calendar size={18} class="text-primary" />
                    </div>
                    <div class="flex-1">
                        <div class="text-xs font-medium tracking-wide uppercase opacity-60">
                            Date
                        </div>
                        <div class="font-semibold">{formatDate(startTime)}</div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="bg-primary/10 rounded-full p-2">
                        <Clock size={18} class="text-primary" />
                    </div>
                    <div class="flex-1">
                        <div class="text-xs font-medium tracking-wide uppercase opacity-60">
                            Time
                        </div>
                        <div class="font-semibold">
                            {formatTime(startTime)} – {formatTime(endTime)}
                            <span class="text-primary ml-2"
                                >({formatDuration(startTime, endTime)})</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
