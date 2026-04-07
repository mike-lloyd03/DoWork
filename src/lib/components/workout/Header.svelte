<script lang="ts">
    import { Workout } from "$lib/database/Workout.svelte";
    import { ArrowLeft } from "@lucide/svelte";
    import HamburgerMenu from "$lib/components/HamburgerMenu.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { goto } from "$app/navigation";

    interface Props {
        workout: Workout;
        editMode?: boolean;
    }

    let { workout = $bindable(), editMode = $bindable() }: Props = $props();

    let hamburgerMenu = $state<HamburgerMenu>();
    let modalOpen = $state(false);
    let modalTitle = $state("");
    let modalMessage = $state("");
    let pendingAction = $state<(() => void) | null>(null);
    let workoutIsComplete = $derived(workout.data.endTime !== undefined);

    const inProgressMenuItems = [
        {
            text: "Switch Workout Type",
            action: () => {
                modalTitle = "Switch Workout Type?";
                modalMessage = `Change to Workout ${workout.data.type === "A" ? "B" : "A"}? Your current progress will be lost.`;
                pendingAction = () => {
                    const nextType = workout.data.type === "A" ? "B" : "A";
                    Workout.generateWorkout(nextType).then((w) => {
                        w.data.id = workout.data.id;
                        w.data.startTime = workout.data.startTime;
                        w.data.notes = workout.data.notes;
                        workout.data = w.data;
                    });
                };
                modalOpen = true;
            },
        },
        {
            text: "Discard Workout",
            action: () => {
                modalTitle = "Discard Workout?";
                modalMessage = "This will permanently delete this workout. Are you sure?";
                pendingAction = () => {
                    workout.delete().then(() => goto("/"));
                };
                modalOpen = true;
            },
        },
    ];

    const historyMenuItems = [
        {
            text: "Edit Workout",
            action: () => {
                editMode = true;
            },
        },
        {
            text: "Delete Workout",
            action: () => {
                modalTitle = "Delete Workout?";
                modalMessage = "This will permanently delete this workout. Are you sure?";
                pendingAction = () => {
                    workout.delete().then(() => goto("/"));
                };
                modalOpen = true;
            },
        },
    ];

    function handleConfirm() {
        pendingAction?.();
        pendingAction = null;
    }

    function handleCancel() {
        pendingAction = null;
    }
</script>

<div class="navbar bg-base-100 sticky top-[env(safe-area-inset-top)] z-50 shadow-sm">
    <div class="flex-none">
        <button class="btn btn-ghost btn-circle" onclick={() => history.back()}>
            <ArrowLeft size={24} />
        </button>
    </div>

    <div class="flex-1">
        <h1 class="px-2 text-lg font-bold">Workout {workout.data.type}</h1>
    </div>

    <HamburgerMenu
        id="workoutMenu"
        bind:this={hamburgerMenu}
        items={workoutIsComplete ? historyMenuItems : inProgressMenuItems}
    />
</div>

<Modal
    bind:open={modalOpen}
    title={modalTitle}
    message={modalMessage}
    onConfirm={handleConfirm}
    onCancel={handleCancel}
/>
