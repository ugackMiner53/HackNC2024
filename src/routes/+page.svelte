
<script lang="ts">
    import image from "$lib/assets/national museum.webp"
    import { goto } from "$app/navigation";
</script>
<style>
    .buttons{
        margin-top: 444px;
        padding: 9px 14px;
        border-radius: 22px;
        color: white;
        background-color: rgb(24, 27, 47);
        font-weight: bold;
        font-size: 23px;    
        margin: 0 3px;
        cursor: pointer;
    }
    h1 {font-size: 25px;}
    h2 {font-size: 20px;}
</style>
<h1 style="font-family:'Papyrus'">A Walk Through History</h1>
<h2>You don't have to be in a museum to walk through history</h2>
<br>
<button class="buttons" type="button" on:click={() => goto("./contacts")}>Contact Us</button>
<button class="buttons" type="button" on:click={() => goto("./about")}>About Us</button>
<button class="buttons" type="button" on:click={() => goto("./map")}>Go to App</button>
<p>&nbsp</p>
<a href="https://nmaahc.si.edu/" target="_blank"><img src={image} alt="National Museum of African American History and Culture" width = "50%" height = "50%"></a>
<br>