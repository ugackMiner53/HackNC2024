<script lang="ts">
    import { page } from "$app/stores";
    import Map from "$lib/components/Map.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import { onMount } from "svelte";
    import type {
        PublicImage,
        PublicRecord,
        PublicRoute,
        PublicComment,
    } from "$lib/server/database";
    import { fade } from "svelte/transition";
    import {
        INTERACTIVITY_STATES,
        interactivityState,
        createRecordMarker,
        lastClick,
        activeRecord,
        viewingImages,
        createRoute,
        currRoute,
        markerIcon,
        activeRoute,
        records,
        setActiveRoute,
    } from "$lib/maphandler";
    import Modal from "$lib/components/Modal.svelte";
    import type { UUID } from "crypto";
    import UploadButton from "$lib/components/UploadButton.svelte";

    let showToolbar = false;

    let recordName: string;
    let recordDesc: string;

    let profanityTriggered = false;

    let currImageI = 0;
    let comments: PublicComment[] = [];

    onMount(async () => {
        const routeUUID = $page.url.searchParams.get("route");
        if (routeUUID) {
            const route: PublicRoute = await (
                await fetch(`/api/route/${routeUUID}`)
            ).json();
        }
    });

    async function submitRecord(
        name: string,
        desc: string,
        lat: number,
        lon: number,
    ) {
        console.log(`${name}, ${desc}, ${lat}, ${lon}`);
        const searchParams = new URLSearchParams(
            Object.entries({
                name,
                desc,
                lat: lat.toString(),
                lon: lon.toString(),
            }),
        );
        try {
            $interactivityState = INTERACTIVITY_STATES.ADD_DETAILS_SUBMITTING;
            const record: PublicRecord = await (
                await fetch("/api/record?" + searchParams, {
                    method: "POST",
                })
            ).json();
            createRecordMarker(record);
            recordName = "";
            recordDesc = "";
            $interactivityState = INTERACTIVITY_STATES.DEFAULT;
        } catch (err) {
            console.warn(
                "Request Rejected!\nThis is likely because your message was deemed harmful or inappropriate. Please be kinder.",
            );
            console.warn(err);

            profanityTriggered = true;

            $interactivityState = INTERACTIVITY_STATES.ADD_DETAILS;
        }
    }

    async function submitComment(event: SubmitEvent, uuid: UUID) {
        const searchParams = new URLSearchParams();
        searchParams.set("id", uuid);
        searchParams.set(
            "text",
            new FormData(<HTMLFormElement>event.target).get(
                "comment",
            ) as string,
        );
        const comment = await (
            await fetch("/api/comment?" + searchParams, {
                method: "POST",
            })
        ).json();

        if (comment.uuid) {
            comments.push(comment);
            comments = comments;
            (<HTMLInputElement>(
                (<HTMLFormElement>event.target).querySelector(
                    "input#commentInput",
                )
            )).value = "";
        } else {
            (<HTMLInputElement>(
                (<HTMLFormElement>event.target).querySelector(
                    "input#commentInput",
                )
            )).value =
                "Your content has been blocked for inappropriate or derogatory language.";
        }

        return false;
    }

    async function getAllComments(): Promise<PublicComment[]> {
        if ($activeRecord?.comments.length === 0) return [];
        return (comments = await (
            await fetch(`/api/comment?ids=${$activeRecord?.comments.join(",")}`)
        ).json());
    }

    function hideToolbar(
        event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    ) {
        if (event.currentTarget.parentElement)
            event.currentTarget.parentElement.style.minWidth = "0";
    }

    async function loadImages(imgs: UUID[]): Promise<PublicImage[]> {
        return (await fetch(`/api/image/?ids=${imgs.join(",")}`)).json();
    }
</script>

{#if $interactivityState == INTERACTIVITY_STATES.ADD_DETAILS || $interactivityState == INTERACTIVITY_STATES.ADD_DETAILS_SUBMITTING}
    <Modal
        closeButton={true}
        on:close={() => {
            $interactivityState = INTERACTIVITY_STATES.DEFAULT;
            profanityTriggered = false;
        }}
    >
        <h2>Enter the Landmark!</h2>

        <label for="name">Name</label>
        <input
            disabled={$interactivityState ==
                INTERACTIVITY_STATES.ADD_DETAILS_SUBMITTING}
            type="text"
            bind:value={recordName}
            name="name"
        />

        <label for="desc">Description</label>
        <textarea
            disabled={$interactivityState ==
                INTERACTIVITY_STATES.ADD_DETAILS_SUBMITTING}
            name="desc"
            bind:value={recordDesc}
        />

        {#if profanityTriggered}
            <p class="profanity-warning" transition:fade={{ duration: 500 }}>
                Your content has been blocked for inappropriate or derogatory
                language.
            </p>
        {/if}

        <button
            disabled={$interactivityState ==
                INTERACTIVITY_STATES.ADD_DETAILS_SUBMITTING}
            on:click={() =>
                submitRecord(
                    recordName,
                    recordDesc,
                    lastClick.latlng.lat,
                    lastClick.latlng.lng,
                )}
            >{$interactivityState === INTERACTIVITY_STATES.ADD_DETAILS
                ? "Submit"
                : "Loading..."}</button
        >
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
            <button on:click={() => currImageI--} class="image-scroll-l"
                ><span>〈</span></button
            >
            <section class="image-container" style="flex-grow: 1;">
                <img
                    src={$viewingImages === undefined
                        ? ""
                        : $viewingImages[currImageI].path}
                    class="image-image"
                    alt={$activeRecord?.name}
                />
            </section>
            <button on:click={() => currImageI++} class="image-scroll-r"
                ><span>〉</span></button
            >
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


{#if $interactivityState == INTERACTIVITY_STATES.ROUTING || $interactivityState == INTERACTIVITY_STATES.ROUTE_PLAYBACK}
    <Sidebar onRight={true} hideSidebar={(evn) => {hideToolbar(evn); $interactivityState = INTERACTIVITY_STATES.DEFAULT}}>
        <ul style="padding: 0">
            {#each ($interactivityState == INTERACTIVITY_STATES.ROUTE_PLAYBACK ? activeRoute === undefined ? [] : activeRoute.nodes.map(v => (records.get(v) || {})._record).filter(v => v) : $currRoute.map(v => v._record)) as routeEntry}
                <li style="list-style-type: none; padding: 0; margin: 0;">
                    <div style="display: flex; flex-direction: row; justify-content: flex-start; align-items: stretch; max-width: 100%; flex-wrap: nowrap; column-gap: 5px">
                        {#if $interactivityState == INTERACTIVITY_STATES.ROUTING}
                            <button on:click={() => {
                                const i = $currRoute.findIndex(v => v._record.uuid === routeEntry?.uuid);
                                // @ts-expect-error I hate them
                                records.get(routeEntry.uuid).setIcon(markerIcon);
                                $currRoute.splice(i, 1);
                                $currRoute = $currRoute;
                            }}>✖</button>
                        {/if}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <span on:click={() => {$activeRecord = routeEntry}} style="cursor: pointer; flex-basis: 0; flex-grow: 1; text-overflow: ellipsis; overflow: hidden">{routeEntry?.name}</span>
                    </div>
                </li>
            {/each}
        </ul>
        <button on:click={() => $interactivityState == INTERACTIVITY_STATES.ROUTING ? createRoute() : (setActiveRoute(undefined), $interactivityState = INTERACTIVITY_STATES.DEFAULT) } style="z-index: 5">{$interactivityState == INTERACTIVITY_STATES.ROUTING ? "Publish" : "End Route"}</button>

        {#if $interactivityState == INTERACTIVITY_STATES.ROUTE_PLAYBACK}
        
        <div class="centerme"><h1 style="text-align: center; white-space: break-spaces">{activeRoute?.name}</h1></div>
        
        <div class="centerme">
            <p class="record-description">{activeRoute?.desc}</p>
        </div>
        {/if}
    </Sidebar>
{/if}

{#if showToolbar && $activeRecord === undefined}
    <Sidebar
        hideSidebar={(evn) => {
            hideToolbar(evn);
            showToolbar = false;
        }}
    >
        <button
            on:click={(evn) => {
                $interactivityState = INTERACTIVITY_STATES.ADD;
                hideToolbar(evn);
                showToolbar = false;
            }}
            class="toolbar-item"
        >
            <h1>Add Site</h1>
        </button>
        <button on:click={(evn) => {
            $interactivityState = INTERACTIVITY_STATES.ROUTING;
            hideToolbar(evn);
            showToolbar = false;
        }} class="toolbar-item">
            <h1>Routes</h1>
        </button>
        <button on:click={async (evn) => {
            hideToolbar(evn);
            const routeUUID = prompt("Enter your Route Code");
            const route = await (await fetch(`/api/route/${routeUUID}`)).json();
            await setActiveRoute(route);
            $interactivityState = INTERACTIVITY_STATES.ROUTE_PLAYBACK;
            showToolbar = false;
        }} class="toolbar-item">
            <h1>Import Route</h1>
        </button>
        <button class="toolbar-item">
            <h1>About</h1>
        </button>
    </Sidebar>
{:else if $activeRecord !== undefined}
    <Sidebar
        hideSidebar={(evn) => {
            hideToolbar(evn);
            $activeRecord = undefined;
        }}
    >
        <div class="centerme"><h1 style="text-align: center; white-space: break-spaces">{$activeRecord.name}</h1></div>
        {#if $activeRecord.images !== undefined && $activeRecord.images.length > 0}
            {#await $activeRecord.images[Math.floor(Math.random() * $activeRecord.images.length)] then imageUUID}
                <button
                    on:click={async () => {
                        if ($activeRecord === undefined) return;
                        $viewingImages = await loadImages($activeRecord.images);
                        $interactivityState = INTERACTIVITY_STATES.VIEW_IMAGES;
                    }}
                    class="image-container"
                    style="cursor: pointer"
                >
                    <img
                        class="image-image"
                        src={`/images/bucket/${imageUUID}.png`}
                        alt=""
                    />
                    <UploadButton />
                </button>
            {/await}
        {:else}
            <div class="centerme image-container">
                <p style="padding: 50px 0; user-select: none;">
                    No Images Available
                </p>
                <UploadButton />
            </div>
        {/if}
        <div class="centerme">
            <p class="record-description">{$activeRecord.desc}</p>
        </div>

        <div class="image-container">
            <form
                method="post"
                on:submit|preventDefault={(evn) =>
                    $activeRecord !== undefined &&
                    (submitComment(evn, $activeRecord.uuid), false)}
            >
                <div
                    style="position: flex; flex-direction: row; justify-content: center; align-items: center"
                >
                    <input
                        style="flex-grow: 1"
                        type="text"
                        placeholder="Tell us about your experiences here..."
                        name="comment"
                        id="commentInput"
                        autocomplete="off"
                    />
                    <button style="padding: 5px" type="submit">Post</button>
                </div>
            </form>
        </div>

        <ul class="comment-list">
            {#await getAllComments() then}
                {#each comments as comment}
                    <li class="comment">{comment.text}</li>
                {/each}
            {/await}
        </ul>
    </Sidebar>
{:else}
    <div transition:fade={{ delay: 300, duration: 100 }} class="menu">
        <button
            on:click={() => {
                showToolbar = true;
            }}>&gt;</button
        >
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
        box-sizing: border-box;
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
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
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
    .comment-list {
        position: flex;
        flex-direction: column;
        justify-content: start;
        align-items: stretch;
        row-gap: 5px;
    }
    .comment {
        white-space: break-spaces;
    }
</style>
