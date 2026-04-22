<script lang="ts">
    import { ui } from '$lib/shared.svelte';
    import { formatTimer } from '$lib/timer-format';
    const formattedTimer = $derived.by(() => {
        return formatTimer(ui.timer);
    });
</script>


<div class="absolute z-70 text-[19pt] bottom-0 text-center w-full font-['Courier_Prime']">
    {formattedTimer}
</div>