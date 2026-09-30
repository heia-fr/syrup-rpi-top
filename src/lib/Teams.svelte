<!--
SPDX-FileCopyrightText: 2026 Jacques Supcik <jacques.supci@hefr.ch>

SPDX-License-Identifier: MIT
-->

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
			class="absolute top-0 -right-1.5 z-70 w-1/2 text-center text-[20pt] font-bold"
			style={`color: ${BIKE_BLUE}`}
		>
			Blue
		</div>
		<div class="absolute top-0 left-1 z-70 w-full text-center text-[20pt]">vs.</div>
	{:else}
		<div class="absolute top-0 z-70 w-full text-center text-[20pt] font-bold">Let's go !</div>
	{/if}
</div>
