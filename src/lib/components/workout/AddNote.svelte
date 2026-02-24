<script lang="ts">
    interface Props {
        onclick?: ()=>void
    }
    
    let { onclick }: Props = $props();
</script>

		<button class="btn btn-ghost btn-block text-base-content/50 dashed border-2 border-base-300" {onclick}>
			+ Add Workout Note
		</button>
