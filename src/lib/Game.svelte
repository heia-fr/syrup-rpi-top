<!--
SPDX-FileCopyrightText: 2026 Jacques Supcik <jacques.supci@hefr.ch>

SPDX-License-Identifier: MIT
-->

<script lang="ts">
	import { ui, State } from '$lib/shared.svelte';
	import Idle from './Idle.svelte';
	import BatteryBg from '$lib/BatteryBg.svelte';
	import BatteryLevel from './BatteryLevel.svelte';
	import Timer from './Timer.svelte';
	import Teams from './Teams.svelte';
	import Winner from './Winner.svelte';
	import CountDown from './CountDown.svelte';

	const HUD_DELAY_MS = 1000;
	let showHud = $state(false);
	let hudDelayTimeout: ReturnType<typeof setTimeout> | undefined;

	function clearHudDelay() {
		if (!hudDelayTimeout) {
			return;
		}

		clearTimeout(hudDelayTimeout);
		hudDelayTimeout = undefined;
	}

	$effect(() => {
		const state = ui.state;
		clearHudDelay();

		if (state === State.Running) {
			showHud = false;
			hudDelayTimeout = setTimeout(() => {
				hudDelayTimeout = undefined;
				showHud = true;
			}, HUD_DELAY_MS);
		} else {
			showHud = false;
		}

		return () => {
			clearHudDelay();
		};
	});
</script>

<div class="relative h-full w-full">
	{#if ui.state === State.Idle}
		<Idle />
	{:else if ui.state === State.Running}
		<CountDown />
		{#if showHud}
			<Timer />
			<Teams />
			<BatteryBg />
			<BatteryLevel />
		{/if}
	{:else if ui.state === State.Ready}
		<Timer />
		<Teams />
		<BatteryBg />
		<BatteryLevel />
	{:else if ui.state === State.Finished}
		<Winner />
	{/if}
</div>
