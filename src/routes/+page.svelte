
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
    p {text-align: center;}
    p1 {font-size: 20px;}
    p {font-size: 15px;}
</style>
<h1 style="font-family:'Papyrus'">A Walk Through History</h1>
<p1>Easiest website to find your favorite African American History Museum</p1>
<p>&nbsp</p>
<button class="buttons" type="button" on:click={() => goto("./contacts")}>Contact Us</button>
<button class="buttons" type="button" on:click={() => goto("./about")}>About Us</button>

<p>Locations of places are at the button called Go to App</p>
<img src={image} alt="National Museum of African American History and Culture" width = "50%" height = "50%">
<p>&nbsp</p>
<button on:click={() => goto("./map")}>Go to App</button>

