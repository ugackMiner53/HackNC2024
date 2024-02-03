<script lang="ts">
    import { goto } from "$app/navigation";
</script>

<h1>Home Page</h1>
<p>Information about the product would be listed here</p>
<button on:click={() => goto("./map")}>Go to App</button>