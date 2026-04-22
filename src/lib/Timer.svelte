<script lang="ts">
	import { ui } from '$lib/shared.svelte';
	import { formatTimer } from '$lib/timer-format';
	const formattedTimer = $derived.by(() => {
		return formatTimer(ui.timer);
	});
</script>

<div class="absolute bottom-0 z-70 w-full text-center font-['Courier_Prime'] text-[19pt]">
	{formattedTimer}
</div>
