<!--
SPDX-FileCopyrightText: 2026 Jacques Supcik <jacques.supci@hefr.ch>

SPDX-License-Identifier: MIT
-->

<script lang="ts">
	import { ui } from '$lib/shared.svelte';

	const backgrounds = import.meta.glob('./BatteryBg.assets/pile-power-*.png', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as Record<string, string>;
</script>

<div class="absolute z-50">
	<img
		src={backgrounds[`./BatteryBg.assets/pile-power-${ui.n_bikes}.png`]}
		alt="Battery Background"
		class="h-full w-full object-cover"
	/>
</div>
