
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
<body style="background-color:#ffcc33">
</body>
<h1 style="font-family:'Papyrus'">A Walk Through History</h1>
<h2 style="font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif">You don't have to be in a museum to walk through history</h2>
<br>
<button class="buttons" type="button" on:click={() => goto("./contacts")}>Contact Us</button>
<button class="buttons" type="button" on:click={() => goto("./about")}>About Us</button>
<button class="buttons" type="button" on:click={() => goto("./map")}>Go to App</button>
<p style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">National Museum of African American History and Culture in Washington, DC</p>
<a href="https://nmaahc.si.edu/" target="_blank"><img src={image} alt="National Museum of African American History and Culture" width = "50%" height = "50%"></a>
<br>
<p style="position: fixed; bottom: 10px; right: 10px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">Proud to be GPT-Free</p>