<!--
SPDX-FileCopyrightText: 2026 Jacques Supcik <jacques.supci@hefr.ch>

SPDX-License-Identifier: MIT
-->

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	onMount(() => {
		console.log('CountDown component mounted, starting animation');
		void playFromStart();
	});

	onDestroy(() => {
		clearPendingTimers();
		console.log('CountDown component destroyed, clearing pending timers');
	});

	const url = '/media/Panel-256x384-COMPTEUR-START.mp4';
	const duration = 5500;

	let video: HTMLVideoElement | undefined;

	const fadeDuration = 500;
	let stopTimeout: ReturnType<typeof setTimeout> | undefined;
	let fadeTimeout: ReturnType<typeof setTimeout> | undefined;
	let opacity = $state(1);

	function clearPendingTimers() {
		if (stopTimeout) {
			clearTimeout(stopTimeout);
			stopTimeout = undefined;
		}

		if (fadeTimeout) {
			clearTimeout(fadeTimeout);
			fadeTimeout = undefined;
		}
	}

	function scheduleStop() {
		clearPendingTimers();

		if (!video || duration <= 0) {
			return;
		}

		const fadeDelay = Math.max(duration - fadeDuration, 0);
		stopTimeout = setTimeout(() => {
			opacity = 0;
			fadeTimeout = setTimeout(() => {
				video?.pause();
			}, fadeDuration);
		}, fadeDelay);
	}

	async function playFromStart() {
		if (!video) {
			return;
		}

		clearPendingTimers();
		opacity = 1;

		video.currentTime = 0;
		try {
			await video.play();
			scheduleStop();
		} catch (error) {
			console.warn('Unable to play animation video:', error);
		}
	}
</script>

<video
	id="count-down-video"
	class="absolute z-500"
	bind:this={video}
	src={url}
	muted
	playsinline
	preload="auto"
	style:opacity
	style:transition={`opacity ${fadeDuration}ms linear`}
>
	Your browser does not support the video tag.
</video>
