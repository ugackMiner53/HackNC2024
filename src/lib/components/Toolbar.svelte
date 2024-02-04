<script lang="ts">
    import { INTERACTIVITY_STATES, interactivityState } from "$lib/maphandler";
    import { slide, type SlideParams } from "svelte/transition";

    export let showToolbar : boolean;

    function slideMinWidth(node : HTMLElement, properties : SlideParams) {
        const result = slide(node, properties);
        setTimeout(() => {
            node.style.minWidth = '200px';
        }, properties.duration ?? 0);
        return result;
    }

    function hideToolbar(event : MouseEvent & {currentTarget: EventTarget & HTMLButtonElement}) {
        if (event.currentTarget.parentElement)
            event.currentTarget.parentElement.style.minWidth = '0';
        showToolbar = false;
    }
</script>
<style>
    .toolbar {
        width: max(20%, 200px);
        /* min-width: 200px; */
        white-space: nowrap;
        max-width: 390px;
        height: 100%;
        background-color: white;
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
    }
    
    .toolbar-item {
        cursor: pointer;
    }
</style>

<div transition:slideMinWidth={{duration: 300, axis: "x"}} class="toolbar">
    <button on:click={hideToolbar} class="toolbar-item"> 
        <!-- Temporary -->
        <h1>Go back</h1>
    </button>
    <button on:click={(event) => {$interactivityState = INTERACTIVITY_STATES.ADD; hideToolbar(event);}} class="toolbar-item">
        <h1>Add Site</h1>
    </button>
    <button class="toolbar-item">
        <h1>Map</h1>
    </button>
    <button class="toolbar-item">
        <h1>Routes</h1>
    </button>
</div>