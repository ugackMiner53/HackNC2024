<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  const goodExt = ['.jpg', '.jpeg', '.png', '.webp'];

  export let form: ActionData;
</script>

<svelte:head>
  <title>SvelteKit file upload</title>
</svelte:head>

<main>
  <h1>upload</h1>

  <form method="post" use:enhance enctype="multipart/form-data">
    <label for="file">Upload your file</label>
    <input type="file" id="file" name="fileToUpload" accept={goodExt.join(',')} required />

    <button type="submit">Submit</button>
  </form>

  {#if form?.error}
    boo
  {/if}

  {#if form?.success}
    yay
  {/if}
</main>
