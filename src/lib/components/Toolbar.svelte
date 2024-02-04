<script lang="ts">
    import { slide, type SlideParams } from "svelte/transition";

    export let showToolbar : boolean;

    function slideMinWidth(node : HTMLElement, properties : SlideParams) {
        // TODO: fix
        node.style.minWidth = "0";
        const result = slide(node, properties);
        setTimeout(() => {
            node.style.minWidth = "200px";
        }, properties.duration ?? 0  - 5);
        return result;
    }

</script>
<style>
    .toolbar {
        width: 20%;
        min-width: 200px;
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
        border: 3px dotted purple;
        cursor: pointer;
    }
</style>

<div transition:slideMinWidth={{duration: 300, axis: "x"}} class="toolbar">
    <button on:click={() => {showToolbar = false}} class="toolbar-item"> 
        <!-- Temporary -->
        <h1>Go back</h1>
    </button>
    <button class="toolbar-item">
        <h1>Map</h1>
    </button>
    <button class="toolbar-item">
        <h1>Routes</h1>
    </button>
</div>