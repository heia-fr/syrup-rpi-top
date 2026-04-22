<script lang="ts">
	import { ui, BIKE_BLUE, BIKE_RED } from '$lib/shared.svelte';
</script>

<div class="absolute left-2 z-70 h-full w-[calc(100%-1rem)]">
	{#if ui.n_bikes > 1}
		<div
			class="absolute top-0 left-0 z-70 w-1/2 text-center text-[20pt] font-bold"
			style={`color: ${BIKE_RED}`}
		>
			Red
		</div>
		<div
			class="absolute top-0 right-0 z-70 w-1/2 text-center text-[20pt] font-bold"
			style={`color: ${BIKE_BLUE}`}
		>
			Blue
		</div>
		<div class="absolute top-0 z-70 w-full text-center text-[20pt]">vs.</div>
	{:else}
		<div class="absolute top-0 z-70 w-full text-center text-[20pt] font-bold">Solo</div>
	{/if}
</div>
