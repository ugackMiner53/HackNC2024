<script lang="ts">
    import { page } from "$app/stores";
    import Map from "$lib/components/Map.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { onMount } from "svelte";
    import type { PublicRecord, PublicRoute } from "$lib/server/database"
    import { fade } from "svelte/transition";
    import { INTERACTIVITY_STATES, interactivityState, createRecordMarker, lastClick, activeRecord } from "$lib/maphandler";
    import Modal from "$lib/components/Modal.svelte";

    let showToolbar = false;

    let recordName : string;
    let recordDesc : string;

    let profanityTriggered = false;


    onMount(async () => {
        const routeUUID = $page.url.searchParams.get("route");
        if (routeUUID) {
            const route : PublicRoute = await (await fetch(`/api/route/${routeUUID}`)).json();
        }
    })

    async function submitRecord(name : string, desc : string, lat : number, lon : number) {
        console.log(`${name}, ${desc}, ${lat}, ${lon}`);
        const searchParams = new URLSearchParams(Object.entries({
            name,
            desc,
            lat: lat.toString(),
            lon: lon.toString()
        }));
        try {
            $interactivityState = INTERACTIVITY_STATES.ADD_DETAILS_SUBMITTING;
            const record : PublicRecord = await (await fetch("/api/record?" + searchParams, {
                method: "POST",
            })).json();
            createRecordMarker(record);
            recordName = "";
            recordDesc = "";
            $interactivityState = INTERACTIVITY_STATES.DEFAULT;
        } catch (err) {
            console.warn("Request Rejected!\nThis is likely because your message was deemed harmful or inappropriate. Please be kinder.")
            console.warn(err);
            
            profanityTriggered = true;

            $interactivityState = INTERACTIVITY_STATES.ADD_DETAILS;
        }
    }

    function hideToolbar(event : MouseEvent & {currentTarget: EventTarget & HTMLButtonElement}) {
        if (event.currentTarget.parentElement)
            event.currentTarget.parentElement.style.minWidth = '0';
    }
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

    .profanity-warning {
        color: red;
    }

    .toolbar-item {
        cursor: pointer;
    }
</style>

{#if $interactivityState == INTERACTIVITY_STATES.ADD_DETAILS || $interactivityState == INTERACTIVITY_STATES.ADD_DETAILS_SUBMITTING }
    <Modal closeButton={true} on:close={() => {$interactivityState = INTERACTIVITY_STATES.DEFAULT; profanityTriggered=false;}}>
        <h2>Enter the Landmark!</h2>

        <label for="name">Name</label>
        <input disabled={$interactivityState == INTERACTIVITY_STATES.ADD_DETAILS_SUBMITTING} type="text" bind:value={recordName} name="name">

        <label for="desc">Description</label>
        <textarea disabled={$interactivityState == INTERACTIVITY_STATES.ADD_DETAILS_SUBMITTING} name="desc" bind:value={recordDesc} />

        {#if profanityTriggered}
            <p class="profanity-warning" transition:fade={{duration:500}}>Your content has been blocked for inappropriate or derogatory language.</p>
        {/if}

        <button disabled={$interactivityState == INTERACTIVITY_STATES.ADD_DETAILS_SUBMITTING} on:click={() => submitRecord(recordName, recordDesc, lastClick.latlng.lat, lastClick.latlng.lng)}>{$interactivityState === INTERACTIVITY_STATES.ADD_DETAILS ? "Submit" : "Loading..."}</button>
    </Modal>
{/if}


{#if showToolbar && $activeRecord === undefined}
    <Sidebar hideSidebar={(evn) => {hideToolbar(evn); showToolbar = false;}}>
        <button on:click={(evn) => {$interactivityState = INTERACTIVITY_STATES.ADD; hideToolbar(evn); showToolbar = false;}} class="toolbar-item">
            <h1>Add Site</h1>
        </button>
        <button class="toolbar-item">
            <h1>Map</h1>
        </button>
        <button class="toolbar-item">
            <h1>Routes</h1>
        </button>
    </Sidebar>
{:else if $activeRecord !== undefined}
    <Sidebar hideSidebar={(evn) => {hideToolbar(evn); $activeRecord = undefined;}}>
        <h1>{$activeRecord.name}</h1>
        <p>{$activeRecord.desc}</p>
    </Sidebar>
{:else}
    <div transition:fade={{delay: 300, duration: 100}} class="menu">
        <button on:click={() => {showToolbar = true}}>&gt;</button>
    </div>
{/if}

<!-- Search bar -->

<Map />