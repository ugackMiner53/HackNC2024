<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";
    import { fade } from "svelte/transition";

    export let closeButton = false;
    export let closeFunction : MouseEventHandler<HTMLButtonElement>;
</script>

<style>
    .background {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
        background-color: rgba(0.25, 0.25, 0.25, 0.25);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
    }

    .modal {
        background-color: white;
        width: 60%;
        height: 60%;
        justify-content: space-evenly;
        align-items: center;
        display: flex;
        border-radius: 18px;
        flex-direction: column;
        position: relative;
    }

    .close {
        color: gray;
        font-size: large;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        background: none;
        border: none;
    }

    .close:hover {
        color: darkgray;
    }

    .close:active {
        color: lightgray;
    }

</style>

<div transition:fade={{duration: 500, delay: 30}} class="background">
    <div class="modal">
        <button class="close" on:click={closeFunction}>✖</button>
        <slot />
    </div>
</div>
