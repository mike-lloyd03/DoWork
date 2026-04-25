<script lang="ts">
    import "../app.css";
    import { page } from "$app/state";
    import { Dumbbell, CalendarDays, Settings, TrendingUp } from "@lucide/svelte";
    import { resolve } from "$app/paths";
    import Toast from "$lib/components/Toast.svelte";

    let { children } = $props();

    function isActive(path: string) {
        return page.url.pathname === path;
    }

    let showDock = $derived(!page.url.pathname.startsWith("/workout"));
</script>

<div class="bg-base-200 fixed inset-x-0 top-0 z-50 h-[env(safe-area-inset-top)]"></div>

<main class="bg-base-200 text-base-content min-h-screen pt-[env(safe-area-inset-top)] pb-20">
    {@render children?.()}
</main>

{#if showDock}
    <div class="dock">
        <a href={resolve("/")} class:dock-active={isActive("/")}>
            <Dumbbell size={24} strokeWidth={isActive("/") ? 2.5 : 2} />
            <span class="dock-label">Workout</span>
        </a>

        <a href={resolve("/history")} class:dock-active={isActive("/history")}>
            <CalendarDays size={24} strokeWidth={isActive("/history") ? 2.5 : 2} />
            <span class="dock-label">History</span>
        </a>

        <a href={resolve("/progress")} class:dock-active={isActive("/progress")}>
            <TrendingUp size={24} strokeWidth={isActive("/progress") ? 2.5 : 2} />
            <span class="dock-label">Progress</span>
        </a>

        <a href={resolve("/settings")} class:dock-active={isActive("/settings")}>
            <Settings size={24} strokeWidth={isActive("/settings") ? 2.5 : 2} />
            <span class="dock-label">Settings</span>
        </a>
    </div>
{/if}

<div class="bg-base-100 fixed inset-x-0 bottom-0 z-50 h-[env(safe-area-inset-bottom)]"></div>

<Toast />
