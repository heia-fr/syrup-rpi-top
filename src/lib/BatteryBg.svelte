<!--
SPDX-FileCopyrightText: 2026 Jacques Supcik <jacques.supci@hefr.ch>

SPDX-License-Identifier: MIT
-->

<script lang="ts">
	import { ui } from '$lib/shared.svelte';
</script>

<div class="absolute z-50">
	<img
		src={`/media/pile-${ui.n_bikes}.png`}
		alt="Battery Background"
		class="h-full w-full object-cover"
	/>
</div>
