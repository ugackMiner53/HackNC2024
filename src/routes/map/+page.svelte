<script lang="ts">
  import { page } from '$app/stores';
  import Map from '$lib/components/Map.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { onMount } from 'svelte';
  import type { PublicRecord, PublicRoute } from '$lib/server/database';
  import { fade } from 'svelte/transition';
  import {
    INTERACTIVITY_STATES,
    interactivityState,
    createRecordMarker,
    lastClick,
    activeRecord,
    viewingImages
  } from '$lib/maphandler';
  import Modal from '$lib/components/Modal.svelte';
  import type { UUID } from "crypto";

  let showToolbar = false;

  let recordName: string;
  let recordDesc: string;

  let profanityTriggered = false;

  let currImageI = 0;

  onMount(async () => {
    const routeUUID = $page.url.searchParams.get('route');
    if (routeUUID) {
      const route: PublicRoute = await (await fetch(`/api/route/${routeUUID}`)).json();
    }
  });

  async function submitRecord(name: string, desc: string, lat: number, lon: number) {
    console.log(`${name}, ${desc}, ${lat}, ${lon}`);
    const searchParams = new URLSearchParams(
      Object.entries({
        name,
        desc,
        lat: lat.toString(),
        lon: lon.toString()
      })
    );
    try {
      $interactivityState = INTERACTIVITY_STATES.ADD_DETAILS_SUBMITTING;
      const record: PublicRecord = await (
        await fetch('/api/record?' + searchParams, {
          method: 'POST'
        })
      ).json();
      createRecordMarker(record);
      recordName = '';
      recordDesc = '';
      $interactivityState = INTERACTIVITY_STATES.DEFAULT;
    } catch (err) {
      console.warn(
        'Request Rejected!\nThis is likely because your message was deemed harmful or inappropriate. Please be kinder.'
      );
      console.warn(err);

      profanityTriggered = true;

      $interactivityState = INTERACTIVITY_STATES.ADD_DETAILS;
    }
  }

    function hideToolbar(event : MouseEvent & {currentTarget: EventTarget & HTMLButtonElement}) {
        if (event.currentTarget.parentElement)
            event.currentTarget.parentElement.style.minWidth = '0';
    }

    async function imageSubmitEvent(event : SubmitEvent, uuid: UUID) {
        const formData = new FormData(<HTMLFormElement>event.target);
        const response = await fetch(`/api/image?id=${uuid}`, {
            method: "POST",
            body: formData
        })
        return false;
    }
</script>

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

{#if $interactivityState == INTERACTIVITY_STATES.VIEW_IMAGES}
  <Modal
    closeButton={true}
    notScuffed={false}
    on:close={() => {
      $interactivityState = INTERACTIVITY_STATES.DEFAULT;
    }}
  >
    <div class="imageview-container">
      <button on:click={() => currImageI--} class="image-scroll-l"><span>〈</span></button>
      <section class="image-container">
        <img
          src={viewingImages === undefined ? '' : viewingImages[currImageI].path}
          class="image-image"
          alt={$activeRecord?.name}
        />
      </section>
      <button on:click={() => currImageI++} class="image-scroll-r"><span>〉</span></button>
    </div></Modal
  >

  {#if currImageI === 0}
    <style>
      .image-scroll-l {
        visibility: hidden;
      }
    </style>
  {/if}
  {#if viewingImages === undefined || currImageI >= viewingImages.length - 1}
    <style>
      .image-scroll-r {
        visibility: hidden;
      }
    </style>
  {/if}
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
        <h1 class="record-name">{$activeRecord.name}</h1>
        {#if $activeRecord.images != undefined && $activeRecord.images.length > 0}
            {#await $activeRecord.images[Math.floor(Math.random()*$activeRecord.images.length)] then imageUUID}
                <img class="record-image" src={`/images/bucket/${imageUUID}.png`}>
                <p>woah image</p>
            {/await}
        {:else}
            <p>no image</p>
        {/if}
        <p class="record-description">{$activeRecord.desc}</p>
    </Sidebar>
{:else}
    <div transition:fade={{delay: 300, duration: 100}} class="menu">
        <button on:click={() => {showToolbar = true}}>&gt;</button>
    </div>
{/if}

<!-- Search bar -->

<Map />

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

  .record-name {
    position: fixed;
  }

  .record-description {
    word-wrap: break-word;
    width: 100%;
  }

  .record-image {
  }

  .imageview-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  .imageview-container > * {
    height: 100%;
  }
  .image-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .image-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .image-scroll-l,
  .image-scroll-r {
    font-size: 10vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: hsl(0, 0%, 10%);
    background-color: transparent;
    border: none;
  }
  .image-scroll-l {
    justify-content: left;
  }
  .image-scroll-r {
    justify-content: right;
  }
  :where(.image-scroll-l, .image-scroll-r) * {
    transition:
      margin-left 0.3s,
      margin-right 0.3s,
      padding-left 0.3s,
      padding-right 0.3s,
      color 0.3s;
  }
  .image-scroll-l:hover *,
  .image-scroll-r:hover * {
    color: hsl(0, 0%, 20%);
  }
  .image-scroll-l:active *,
  .image-scroll-r:active * {
    color: hsl(0, 0%, 30%);
  }
  .image-scroll-l:hover * {
    margin-left: -3vw;
    padding-right: 3vw;
  }
  .image-scroll-r:hover * {
    margin-right: -3vw;
    padding-left: 3vw;
  }
</style>
