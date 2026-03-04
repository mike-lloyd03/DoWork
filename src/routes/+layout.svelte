<script lang="ts">
    import "../app.css";
    import { page } from "$app/state";
    import { Dumbbell, CalendarDays, Settings } from "@lucide/svelte";
    import { resolve } from "$app/paths";

    let { children } = $props();

    function isActive(path: string) {
        return page.url.pathname === path;
    }
</script>

<div class="bg-base-200 fixed inset-x-0 top-0 z-100 h-[env(safe-area-inset-top)]"></div>
<main class="bg-base-200 text-base-content min-h-screen pt-[env(safe-area-inset-top)] pb-20">
    {@render children()}
</main>

<div class="dock pb-[env(safe-area-inset-bottom)]">
    <a href={resolve("/")} class:dock-active={isActive("/")}>
        <Dumbbell size={24} strokeWidth={isActive("/") ? 2.5 : 2} />
        <span class="dock-label">Workout</span>
    </a>

    <a href={resolve("/history")} class:dock-active={page.url.pathname.startsWith("/history")}>
        <CalendarDays size={24} strokeWidth={page.url.pathname.startsWith("/history") ? 2.5 : 2} />
        <span class="dock-label">History</span>
    </a>

    <a href={resolve("/settings")} class:dock-active={page.url.pathname.startsWith("/settings")}>
        <Settings size={24} strokeWidth={page.url.pathname.startsWith("/settings") ? 2.5 : 2} />
        <span class="dock-label">Settings</span>
    </a>
</div>
