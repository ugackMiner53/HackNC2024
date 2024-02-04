<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let closeButton = false;
  export let notScuffed = true;

  const dispatch = createEventDispatcher();
</script>

{#if notScuffed}
  <style>
    .background {
      background-color: rgba(0.25, 0.25, 0.25, 0.25);
    }
    .close {
      font-size: 30px;
    }
    .modal {
      background-color: white;
      width: 60%;
      height: 60%;
    }
  </style>
{:else}
  <style>
    .background {
      background-color: rgba(0.25, 0.25, 0.25, 0.75);
    }
    .close {
      font-size: 50px;
    }
    .modal {
      background-color: transparent;
      width: 100%;
      height: 100%;
    }
  </style>
{/if}

<div transition:fade={{ duration: 500, delay: 30 }} class="background">
  <div class="modal">
    <button class="close" on:click={() => dispatch('close')}>✖</button>
    <slot />
  </div>
</div>

<style>
  .background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
  }

  .modal {
    justify-content: space-evenly;
    align-items: center;
    display: flex;
    border-radius: 18px;
    flex-direction: column;
    position: relative;
  }

  .close {
    color: gray;
    position: absolute;
    top: 0.5em;
    right: 1em;
    cursor: pointer;
    background: none;
    border: none;
    vertical-align: baseline;
  }

  .close:hover {
    color: darkgray;
  }

  .close:active {
    color: lightgray;
  }
</style>
