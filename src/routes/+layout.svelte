<!--
SPDX-FileCopyrightText: 2026 Jacques Supcik <jacques.supci@hefr.ch>

SPDX-License-Identifier: MIT
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { init_client } from '$lib/shared.svelte';

	let { children } = $props();

	onMount(() => {
		const broker_url = page.url.searchParams.get('B');
		const base_topic = page.url.searchParams.get('T');
		init_client(broker_url, base_topic);
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
