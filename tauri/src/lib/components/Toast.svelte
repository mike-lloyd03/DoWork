<script lang="ts">
    import { getToasts, dismissToast, type ToastMessage } from "$lib/appState.svelte";
    import { fade } from "svelte/transition";

    const typeClasses: Record<string, string> = {
        error: "alert-error",
        warning: "alert-warning",
        success: "alert-success",
        info: "alert-info",
    };

    function handleDismiss(toast: ToastMessage) {
        dismissToast(toast.id);
    }

    $effect(() => {
        const toasts = getToasts();
        const timers: number[] = [];

        for (const toast of toasts) {
            if (toast.duration > 0) {
                const timer = setTimeout(() => dismissToast(toast.id), toast.duration);
                timers.push(timer);
            }
        }

        return () => timers.forEach(clearTimeout);
    });
</script>

{#if getToasts().length > 0}
    <div class="toast toast-top toast-center z-60 mt-[env(safe-area-inset-top)]">
        {#each getToasts() as toast (toast.id)}
            <div
                class="alert {typeClasses[toast.type] ?? typeClasses.info} cursor-pointer"
                onclick={() => handleDismiss(toast)}
                transition:fade
            >
                <span>{toast.message}</span>
            </div>
        {/each}
    </div>
{/if}
