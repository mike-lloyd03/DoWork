<script lang="ts">
    import PageTitle from "$lib/components/PageTitle.svelte";
    import {
        User,
        Dumbbell,
        Scale,
        Database,
        Moon,
        Sun,
        ChevronRight,
        TriangleAlert,
    } from "@lucide/svelte";
    import { DateTime } from "luxon";
    import { Workout } from "$lib/database/Workout.svelte";
    import { showToast } from "$lib/appState.svelte";
    import { invoke } from "@tauri-apps/api/core";

    // Mock Settings State
    let settings = $state({
        bodyweight: 185,
        units: "lbs", // 'lbs' | 'kg'
        incrementSquat: 5,
        incrementBench: 5,
        incrementRow: 5,
        incrementOHP: 2.5, // Often lower for OHP
        incrementDeadlift: 10,
        restTimer: 90, // seconds
        darkMode: false,
    });

    let exporting = $state(false);

    async function exportData() {
        exporting = true;
        try {
            const workouts = await Workout.getAll();
            const payload = workouts.map((w) => w.data);
            const json = JSON.stringify(payload, null, 2);
            const fileName = `dowork-export-${DateTime.now().toFormat("yyyy-MM-dd")}.json`;

            // The save dialog + write happen on the Rust side via
            // tauri-plugin-android-fs so the bytes actually land in the
            // SAF-selected file (plugin-fs writes 0 bytes to content:// URIs).
            const saved = await invoke<boolean>("export_workouts", { fileName, json });
            if (!saved) return; // user cancelled

            showToast(`Exported ${workouts.length} workouts`, "success");
        } catch (e) {
            console.error("Export error:", e);
            showToast(`Export failed: ${e}`, "error");
        } finally {
            exporting = false;
        }
    }

    // Theme Toggle Logic (Simple version)
    function toggleTheme() {
        settings.darkMode = !settings.darkMode;
        // In a real app, you'd save this to localStorage and update the <html> tag
        document.documentElement.setAttribute("data-theme", settings.darkMode ? "dark" : "light");
    }
</script>

<div class="space-y-6 p-4 pb-24">
    <PageTitle title="Settings" />

    <div class="space-y-2">
        <h2 class="text-base-content/50 ml-2 text-xs font-bold tracking-widest uppercase">
            Profile
        </h2>
        <div class="bg-base-100 rounded-box divide-base-200 divide-y overflow-hidden shadow-sm">
            <div class="flex items-center justify-between p-4">
                <div class="flex items-center gap-3">
                    <div class="bg-base-200 text-primary rounded-lg p-2">
                        <User size={18} />
                    </div>
                    <span class="font-medium">Body Weight</span>
                </div>
                <div class="flex items-center gap-2">
                    <input
                        type="number"
                        bind:value={settings.bodyweight}
                        class="input input-sm input-bordered w-20 text-right font-mono"
                    />
                    <span class="text-base-content/50 text-xs font-bold">{settings.units}</span>
                </div>
            </div>

            <div class="flex items-center justify-between p-4">
                <div class="flex items-center gap-3">
                    <div class="bg-base-200 text-secondary rounded-lg p-2">
                        <Scale size={18} />
                    </div>
                    <span class="font-medium">Units</span>
                </div>
                <div class="join">
                    <button
                        class="join-item btn btn-sm {settings.units === 'lbs'
                            ? 'btn-primary'
                            : 'btn-ghost'}"
                        onclick={() => (settings.units = "lbs")}>lbs</button
                    >
                    <button
                        class="join-item btn btn-sm {settings.units === 'kg'
                            ? 'btn-primary'
                            : 'btn-ghost'}"
                        onclick={() => (settings.units = "kg")}>kg</button
                    >
                </div>
            </div>
        </div>
    </div>

    <div class="space-y-2">
        <h2 class="text-base-content/50 ml-2 text-xs font-bold tracking-widest uppercase">
            Weight Increments
        </h2>
        <div class="bg-base-100 rounded-box divide-base-200 divide-y overflow-hidden shadow-sm">
            <div class="flex items-center justify-between p-4">
                <div class="flex items-center gap-3">
                    <div class="bg-base-200 text-accent rounded-lg p-2">
                        <Dumbbell size={18} />
                    </div>
                    <div class="flex flex-col">
                        <span class="font-medium">Squat / Deadlift</span>
                        <span class="text-base-content/50 text-xs">Larger muscles</span>
                    </div>
                </div>
                <select
                    class="select select-bordered select-sm font-mono"
                    bind:value={settings.incrementSquat}
                >
                    <option value={2.5}>2.5 {settings.units}</option>
                    <option value={5}>5.0 {settings.units}</option>
                    <option value={10}>10.0 {settings.units}</option>
                </select>
            </div>

            <div class="flex items-center justify-between p-4">
                <div class="flex items-center gap-3">
                    <div class="bg-base-200 text-accent rounded-lg p-2">
                        <Dumbbell size={18} />
                    </div>
                    <div class="flex flex-col">
                        <span class="font-medium">Press / Row</span>
                        <span class="text-base-content/50 text-xs">Smaller muscles</span>
                    </div>
                </div>
                <select
                    class="select select-bordered select-sm font-mono"
                    bind:value={settings.incrementOHP}
                >
                    <option value={1}>1.0 {settings.units}</option>
                    <option value={2.5}>2.5 {settings.units}</option>
                    <option value={5}>5.0 {settings.units}</option>
                </select>
            </div>
        </div>
        <p class="text-base-content/40 px-2 text-xs">
            Weights will automatically increase by this amount after a successful 5x5.
        </p>
    </div>

    <div class="space-y-2">
        <h2 class="text-base-content/50 ml-2 text-xs font-bold tracking-widest uppercase">App</h2>
        <div class="bg-base-100 rounded-box divide-base-200 divide-y overflow-hidden shadow-sm">
            <label class="flex cursor-pointer items-center justify-between p-4">
                <div class="flex items-center gap-3">
                    <div class="bg-base-200 text-warning rounded-lg p-2">
                        {#if settings.darkMode}
                            <Moon size={18} />
                        {:else}
                            <Sun size={18} />
                        {/if}
                    </div>
                    <span class="font-medium">Dark Mode</span>
                </div>
                <input
                    type="checkbox"
                    class="toggle toggle-primary"
                    checked={settings.darkMode}
                    onchange={toggleTheme}
                />
            </label>

            <button
                class="hover:bg-base-200 flex w-full items-center justify-between p-4 text-left transition-colors disabled:opacity-50"
                onclick={exportData}
                disabled={exporting}
            >
                <div class="flex items-center gap-3">
                    <div class="bg-base-200 text-info rounded-lg p-2">
                        <Database size={18} />
                    </div>
                    <span class="font-medium"
                        >{exporting ? "Exporting…" : "Export Data (JSON)"}</span
                    >
                </div>
                <ChevronRight size={18} class="text-base-content/30" />
            </button>
        </div>
    </div>

    <div class="pt-6">
        <button class="btn btn-outline btn-error btn-block gap-2">
            <TriangleAlert size={18} />
            Reset All Progress
        </button>
        <div class="mt-4 text-center">
            <span class="text-base-content/30 font-mono text-xs">doWork v1.0.0 (Build 24)</span>
        </div>
    </div>
</div>
