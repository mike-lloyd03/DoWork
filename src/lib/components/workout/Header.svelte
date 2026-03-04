<script lang="ts">
    import type { WorkoutType } from "$lib/database/Workout";
    import { ArrowLeft } from "@lucide/svelte";
    import HamburgerMenu from "$lib/components/HamburgerMenu.svelte";

    interface Props {
        workoutType: WorkoutType;
    }

    let { workoutType }: Props = $props();

    const menuItems = [{ text: "Switch Workout Type", action: () => {} }];
</script>

<div class="navbar bg-base-100 sticky top-[env(safe-area-inset-top)] z-50 shadow-sm">
    <div class="flex-none">
        <button class="btn btn-ghost btn-circle" onclick={() => history.back()}>
            <ArrowLeft size={24} />
        </button>
    </div>

    <div class="flex-1">
        <h1 class="px-2 text-lg font-bold">Workout {workoutType}</h1>
    </div>

    <HamburgerMenu items={menuItems}></HamburgerMenu>
</div>
