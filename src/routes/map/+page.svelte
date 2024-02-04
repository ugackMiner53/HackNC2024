<script lang="ts">
  import { page } from '$app/stores';
  import Map from '$lib/components/Map.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { onMount } from 'svelte';
  import type { PublicImage, PublicRecord, PublicRoute } from '$lib/server/database';
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

    async function imageSubmitEvent(node : HTMLFormElement, uuid: UUID) {
        const formData = new FormData(node);
        const response = await fetch(`/api/image?id=${uuid}`, {
            method: "POST",
            body: formData
        })
        $activeRecord = await (await fetch(`./api/record/${uuid}`)).json();
        return false;
    }

    async function loadImages(imgs: UUID[]): Promise<PublicImage[]> {
        const res = await Promise.allSettled(imgs.map(v => fetch(`/api/image/${v}`)));
        const res2 = res.map(v => v.status === 'fulfilled' ? v.value.json() : undefined).filter(v => v);
        return (await Promise.allSettled(res2)).map(v => v.status === 'fulfilled' ? v.value : undefined).filter(v => v);
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
    }}>
    <div class="imageview-container">
      <button on:click={() => currImageI--} class="image-scroll-l"><span>〈</span></button>
      <section class="image-container">
        <img
          src={$viewingImages === undefined ? '' : $viewingImages[currImageI].path}
          class="image-image"
          alt={$activeRecord?.name}
        />
      </section>
      <button on:click={() => currImageI++} class="image-scroll-r"><span>〉</span></button>
    </div>
</Modal>

  {#if currImageI === 0}
    <style>
      .image-scroll-l {
        visibility: hidden;
      }
    </style>
  {/if}
  {#if $viewingImages === undefined || currImageI >= $viewingImages.length - 1}
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
        <div class="centerme"><h1>{$activeRecord.name}</h1></div>
        {#if $activeRecord.images !== undefined && $activeRecord.images.length > 0}
            {#await $activeRecord.images[Math.floor(Math.random()*$activeRecord.images.length)] then imageUUID}
                <button on:click={async () => {
                    if ($activeRecord === undefined) 
                        return; 
                    $viewingImages = await loadImages($activeRecord.images);
                    $interactivityState = INTERACTIVITY_STATES.VIEW_IMAGES;
                }} class="image-container" style="flex-grow: 0; cursor: pointer">
                    <img class="image-image" src={`/images/bucket/${imageUUID}.png`} alt="">
                    <form enctype="multipart/form-data" method="post">
                        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <label for="imageToUpload" style="cursor: pointer" on:click|stopPropagation={(evn) => {}}>
                            <svg name="image" class="image-overlay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
                            <input type="file" name="imageToUpload" id="imageToUpload" accept=".png" required style="display: none" on:change={evn => evn.currentTarget.parentElement?.parentElement instanceof HTMLFormElement && $activeRecord !== undefined && imageSubmitEvent(evn.currentTarget.parentElement?.parentElement, $activeRecord.uuid)}>
                        </label>
                        
                    </form>
                </button>
            {/await}
        {:else}
            <div class="centerme"><p>no image</p></div>
        {/if}
        <div class="centerme"><p class="record-description">{$activeRecord.desc}</p></div>
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

  .record-description {
    word-wrap: break-word;
    max-width: 100%;
    min-width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    white-space: break-spaces;
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
    position:relative;
    background-color: transparent;
    border: none;
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

  .centerme {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .image-overlay {
    position: absolute;
    z-index: 2;
    width: 20%;
    top: 5%;
    right: 5%;
  }
</style>