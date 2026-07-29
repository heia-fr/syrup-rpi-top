<!--
SPDX-FileCopyrightText: 2026 Jacques Supcik <jacques.supci@hefr.ch>

SPDX-License-Identifier: MIT
-->

<script lang="ts">
	import { ui } from '$lib/shared.svelte';
	import { formatTimer } from '$lib/timer-format';
	import { onMount } from 'svelte';

	const SHOW_TIMER_DELAY_MS = 1400;

	const BLUE_WIN = '/media/Panel-256x384-WINNER-BLUE.mp4';
	const RED_WIN = '/media/Panel-256x384-WINNER-RED.mp4';
	const SOLO_WIN = '/media/Panel-256x384-WINNER-SOLO.mp4';

	let video: HTMLVideoElement | undefined;
	let showTimer = $state(false);
	let timerTimeout: ReturnType<typeof setTimeout> | undefined;

	const formattedTimer = $derived.by(() => {
		return formatTimer(ui.timer);
	});

	async function playFromStart(src: string) {
		if (!video) {
			return;
		}

		if (video.src !== new URL(src, window.location.href).href) {
			video.src = src;
			video.load();
		}

		video.currentTime = 0;
		try {
			await video.play();
		} catch (error) {
			console.warn('Unable to play animation video:', error);
		}
	}

	onMount(() => {
		const state = ui.state;
		const winner = ui.winner;

		console.log('Winner component mounted, current state:', state, 'winner:', winner);

		showTimer = false;
		timerTimeout = setTimeout(() => {
			timerTimeout = undefined;
			showTimer = true;
		}, SHOW_TIMER_DELAY_MS);

		let src: string;
		if (ui.n_bikes == 1) {
			src = SOLO_WIN;
		} else if (winner == 0) {
			src = RED_WIN;
		} else {
			src = BLUE_WIN;
		}
		console.log('Playing winner animation with source:', src);
		void playFromStart(src);

		return () => {
			if (timerTimeout) {
				clearTimeout(timerTimeout);
				timerTimeout = undefined;
			}
		};
	});
</script>

<video id="video-winner" class="absolute z-500" bind:this={video} muted playsinline preload="auto">
	Your browser does not support the video tag.
</video>

<div
	class="absolute bottom-3.5 z-500 w-full text-center font-['Courier_Prime'] text-[24pt]"
	hidden={!showTimer}
>
	{formattedTimer}
</div>
