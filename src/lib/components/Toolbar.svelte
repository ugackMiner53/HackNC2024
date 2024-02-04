<script lang="ts">
    import { slide, type SlideParams } from "svelte/transition";

    function slideMinWidth(node : HTMLElement, properties : SlideParams) {
        console.log("Setting...");
        console.log(node.style.minWidth);
        node.style.minWidth = "0";
        console.log(node.style.minWidth);
        const result = slide(node, properties);
        setTimeout(() => {
            console.log("Resetting!");
            node.style.minWidth = "200";
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
    <button class="toolbar-item">
        <h1>Map</h1>
    </button>
    <button class="toolbar-item">
        <h1>Routes</h1>
    </button>
</div>