<script lang="ts">
	import { ui } from '$lib/shared.svelte';
	import needle from './Needle.assets/needle.png';

	const angles = $derived(ui.power.map((power) => Math.max(0, Math.min(100, power)) * 1.75 - 90));
</script>

<div class="absolute bottom-8.25 z-70 h-full w-full">
	{#if ui.n_bikes > 1}
		<div
			class="absolute bottom-0 left-[calc(25%+4px)] h-[63px] w-[63px] -translate-x-1/2"
			style:rotate={`${angles[0]}deg`}
		>
			<img src={needle} alt="Needle" />
		</div>
		<div
			class="absolute bottom-0 left-[calc(75%+4px)] h-[63px] w-[63px] -translate-x-1/2"
			style:rotate={`${angles[1]}deg`}
		>
			<img src={needle} alt="Needle" />
		</div>
	{:else}
		<div
			class="absolute bottom-0 left-[calc(50%+1px)] -translate-x-1/2"
			style:rotate={`${angles[0]}deg`}
		>
			<img src={needle} alt="Needle" />
		</div>
	{/if}
</div>
