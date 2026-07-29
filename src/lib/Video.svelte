<!--
SPDX-FileCopyrightText: 2026 Jacques Supcik <jacques.supci@hefr.ch>

SPDX-License-Identifier: MIT
-->

<script lang="ts">
	let { url } = $props();
</script>

<video id="video" autoplay muted loop>
	<source src={url} type="video/mp4" />
	Your browser does not support the video tag.
</video>
