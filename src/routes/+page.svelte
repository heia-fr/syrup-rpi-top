<script lang="ts">
	import Video from '$lib/Video.svelte';
	import Game from '$lib/Game.svelte';
</script>

<div class="flex">
	<div class="h-96 w-[256px]">
		<Game />
	</div>
	<div class="h-96 w-[768px]">
		<Video url="/media/HEIA-FR-Panels-768x384-FR-DE.mp4" />
	</div>
</div>
