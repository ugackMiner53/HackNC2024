<script lang="ts">
    import { page } from "$app/stores";
    import Map from "$lib/components/Map.svelte";
    import Toolbar from "$lib/components/Toolbar.svelte";
    import { onMount } from "svelte";
    import type { PublicRoute } from "$lib/server/database"
    import { fade } from "svelte/transition";
    import { INTERACTIVITY_STATES, interactivityState } from "$lib/maphandler";
    import Modal from "$lib/components/Modal.svelte";

    let showToolbar = false;

    onMount(async () => {
        const routeUUID = $page.url.searchParams.get("route");
        if (routeUUID) {
            const route : PublicRoute = await (await fetch(`/api/route/${routeUUID}`)).json();
            
        }
    })
</script>


<style>
    .menu {
        z-index: 1;
        position: fixed;
        margin: 10px;
        top: 0;
        left: 0;
    }

    .menu > button {
        width: 10vh;
        height: 10vh;
        font-size: 10vh;
        background: none;
        font-weight: bold;
        text-align: center;
        cursor: pointer;
        border: none;
    }

    textarea {
        width: 90%;
        height: 40%;
        resize: none;
    }
</style>

{#if $interactivityState == INTERACTIVITY_STATES.ADD_DETAILS }
    <Modal closeButton={true} closeFunction={() => {$interactivityState = INTERACTIVITY_STATES.DEFAULT}}>
        <h2>Enter the Landmark!</h2>

        <label for="name">Name</label>
        <input type="text" name="name">

        <label for="desc">Description</label>
        <textarea name="desc" />

        <button>Submit</button>
    </Modal>
{/if}


{#if showToolbar}
    <Toolbar bind:showToolbar={showToolbar} />
{:else}
    <div transition:fade={{delay: 300, duration: 100}} class="menu">
        <button on:click={() => {showToolbar = true}}>&gt;</button>
    </div>
{/if}

<!-- Search bar -->

<Map />