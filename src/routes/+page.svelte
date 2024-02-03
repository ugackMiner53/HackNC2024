<script lang="ts">
    import image from "$lib/assets/national museum.webp"
    import { goto } from "$app/navigation";
</script>
<style>
    p {text-align: center;}
    p {font-size: 20px;}
</style>
<h1 style="font-family:'Papyrus'">A Walk Through History</h1>
<p>Locations of places are at the button called Go to App</p>
<img src={image} alt="National Museum of African American History and Culture" width = "50%" height = "50%">
<p>&nbsp</p>
<button on:click={() => goto("./map")}>Go to App</button>

