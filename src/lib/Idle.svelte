<!--
SPDX-FileCopyrightText: 2026 Jacques Supcik <jacques.supci@hefr.ch>

SPDX-License-Identifier: MIT
-->

<script lang="ts">
	import { page } from '$app/state';
	import frenchBackground from './Idle.assets/machine-a-sirops.png';
	import germanBackground from './Idle.assets/sirup-maschine.png';

	const background = $derived(
		page.url.searchParams.get('lang')?.toLowerCase().startsWith('de')
			? germanBackground
			: frenchBackground
	);
</script>

<img class="absolute z-500 h-full w-full" src={background} alt="Syrup machine" />
