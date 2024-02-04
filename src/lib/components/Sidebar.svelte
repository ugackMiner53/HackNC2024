<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";
    import { slide, type SlideParams } from "svelte/transition";


    export let hideSidebar : MouseEventHandler<HTMLButtonElement>;

    function slideMinWidth(node : HTMLElement, properties : SlideParams) {
        const result = slide(node, properties);
        setTimeout(() => {
            node.style.minWidth = '200px';
        }, properties.duration ?? 0);
        return result;
    }


</script>
<style>
    .sidebar {
        width: max(20%, 200px);
        /* min-width: 200px; */
        white-space: nowrap;
        max-width: 390px;
        height: 100%;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>

<div transition:slideMinWidth={{duration: 300, axis: "x"}} class="sidebar">
    <button on:click={hideSidebar} style="position: sticky; top: 0%"> 
        <!-- Temporary -->
        <h1>Go back</h1>
    </button>
    <slot />
</div>