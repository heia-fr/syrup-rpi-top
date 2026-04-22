<script lang="ts">
    import { ui, BIKE_BLUE, BIKE_RED } from '$lib/shared.svelte';
</script>

<div class="absolute z-40 bottom-17 left-2 w-[calc(100%-1rem)] h-59">
{#if ui.n_bikes > 1}
    <div 
        class="absolute bottom-0 left-0 w-1/2"
        style={`height: ${ui.level[0]}%; background-color: ${BIKE_RED};`}>
    </div>
    <div
        class="absolute bottom-20 left-0 w-1/2 text-center text-[20pt] font-bold">{ui.level[0]}%
    </div>
    <div
        class="absolute bottom-0 right-0 w-1/2"
        style={`height: ${ui.level[1]}%; background-color: ${BIKE_BLUE};`}>
    </div>
    <div class="absolute bottom-20 right-0 w-1/2 text-center text-[20pt] font-bold">{ui.level[1]}%</div> 
{:else}
    <div
        class="absolute bottom-0 left-0 w-full"
        style={`height: ${ui.level[0]}%; background-color: ${BIKE_RED};`}>
    </div>
    <div
        class="absolute bottom-20 left-0 w-full text-center text-[20pt] font-bold">{ui.level[0]}%
    </div>
{/if}   
</div>