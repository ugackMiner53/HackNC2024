<script lang="ts">
    import { page } from "$app/stores";
    import Map from "$lib/components/Map.svelte";
    import Toolbar from "$lib/components/Toolbar.svelte";
    import { onMount } from "svelte";
    import type { PublicRoute } from "$lib/server/database"
    import { fade } from "svelte/transition";

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
</style>

{#if showToolbar}
    <Toolbar bind:showToolbar={showToolbar} />
{:else}
    <div transition:fade={{delay: 300, duration: 100}} class="menu">
        <button on:click={() => {showToolbar = true;}}>&gt;</button>
    </div>
{/if}

<!-- Search bar -->

<Map />