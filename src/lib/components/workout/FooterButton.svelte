<script lang="ts">
    import { CircleCheck, SquarePen, OctagonX, Check, Save, X } from "@lucide/svelte";

    interface Props {
        text: string;
        icon?: "circleCheck" | "squarePen" | "octagonX" | "check" | "save" | "x";
        color?: "primary" | "warning" | "error" | "success";
        onclick: () => void;
    }

    let { text, icon, color = "primary", onclick }: Props = $props();

    function btnColor() {
        switch (color) {
            case "primary":
                return "btn-primary";
            case "warning":
                return "btn-warning";
            case "error":
                return "btn-error";
            case "success":
                return "btn-success";
        }
    }
</script>

<button class="btn {btnColor()} btn-lg grow gap-3 text-xl shadow-lg" {onclick}>
    {#if icon == "circleCheck"}
        <CircleCheck size={24} strokeWidth={2.5} />
    {:else if icon == "squarePen"}
        <SquarePen size={24} strokeWidth={2.5} />
    {:else if icon == "octagonX"}
        <OctagonX size={24} strokeWidth={2.5} />
    {:else if icon == "check"}
        <Check size={24} strokeWidth={2.5} />
    {:else if icon == "save"}
        <Save size={24} strokeWidth={2.5} />
    {:else if icon == "x"}
        <X size={24} strokeWidth={2.5} />
    {/if}
    {text}
</button>
