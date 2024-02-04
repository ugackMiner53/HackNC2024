<script>
    const navigateToLandingPage = () => {
        window.location.href = 'http://localhost:5173/'; // Change this to your landing page URL
    };
</script>
<div class='bg'>
</div>
<div class="bgtext">
    <h1>About Us</h1>
    <p>Welcome to “Walk Through History”, a groundbreaking web app that seamlessly integrates cutting-edge technologies <br>such as Svelte and OpenStreetMap to redefine the way we engage with Black history. <br><br> Our mission is to illuminate the rich tapestry of Black heritage by guiding users on an immersive journey through <br>significant historical sites, both well-known and hidden gems. <br><br>With meticulous research and curated content, we strive to provide comprehensive descriptions and insights, allowing users to connect deeply with the stories, struggles, and triumphs of the past. <br> <br>Join us as we embark on a transformative exploration of culture, resilience, and the enduring legacy of Black history.</p>
    <button type="button" on:click={navigateToLandingPage} class="back-button">Back to Landing Page</button>
</div>
<style>
    h1{text-align: center;}
    h1{font-family: 'Times New Roman', Times, serif;}
    h1{color: whitesmoke;}
    .bg{
        width:100%;
        height: 100%;
        position:fixed;
        left:0;
        top:0;
        background-image: url(https://www.princeton.edu/sites/default/files/styles/1x_full_2x_half_crop/public/images/2021/02/iStock-1296150964%281%29.jpg?itok=Zl8vBlnw);
        background-attachment: fixed;
        filter: blur(10px);
    }
    .bgtext{
        color: white;
        font-weight: bold;
        position: fixed;
        text-align: center;
    }
    .restricttextwidth{
        max-width:600;
        margin: auto;
    }
    button {
      background-color: #007bff;
      color: #fff;
      padding: 10px 15px;
      cursor: pointer;
      border: none;
      
    }
</style>