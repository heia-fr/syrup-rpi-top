<script lang="ts">
	import Video from '$lib/Video.svelte';
    import Game from '$lib/Game.svelte';
</script>

<div class="flex">
    <div class="w-[256px] h-96">
        <Game n={2} />
    </div>
    <div class="w-[768px] h-96">
        <Video url="/media/HEIA-FR-Panels-768x384-FR-DE.mp4" />
    </div>
</div>


