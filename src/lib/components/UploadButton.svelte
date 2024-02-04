<script lang="ts">
    import { activeRecord } from "$lib/maphandler";
    import type { UUID } from "crypto";

    async function imageSubmitEvent(node : HTMLFormElement, uuid: UUID) {
        const formData = new FormData(node);
        const response = await fetch(`/api/image?id=${uuid}`, {
            method: "POST",
            body: formData
        })
        $activeRecord = await (await fetch(`./api/record/${uuid}`)).json();
        return false;
    }
</script>

<style>
.image-overlay {
    position: absolute;
    z-index: 2;
    width: 20%;
    aspect-ratio: 1/1;
    max-width: 40%;
    max-height: 40%;
    top: 5%;
    right: 5%;
}
</style>

<form enctype="multipart/form-data" method="post">
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <label for="imageToUpload" style="cursor: pointer" on:click|stopPropagation>
        <svg name="image" class="image-overlay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
        <input type="file" name="imageToUpload" id="imageToUpload" accept=".png" required style="display: none" on:change={evn => 
            evn.currentTarget.parentElement?.parentElement instanceof HTMLFormElement && 
            $activeRecord !== undefined && 
            imageSubmitEvent(evn.currentTarget.parentElement?.parentElement, $activeRecord.uuid)
        }>
    </label>
</form>