<script lang="ts">
    interface Props {
        open: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        onCancel: () => void;
    }

    let { open = $bindable(), title, message, onConfirm, onCancel }: Props = $props();
</script>

<dialog {open} class="modal is-active z-50">
    <div class="modal-box">
        <h3 class="text-lg font-bold">{title}</h3>
        <p class="py-4">{message}</p>
        <div class="modal-action">
            <button class="btn btn-ghost" onclick={() => (open = false) || onCancel()}>
                Cancel
            </button>
            <button class="btn btn-primary" onclick={() => (open = false) || onConfirm()}>
                Confirm
            </button>
        </div>
    </div>
    <button
        class="modal-backdrop"
        aria-label="Close modal"
        onclick={() => (open = false) || onCancel()}
    ></button>
</dialog>
