<script>
    const navigateToLandingPage = () => {
        window.location.href = 'http://localhost:5173/'; // Change this to your landing page URL
    };
    import image2 from "$lib/assets/image.webp"
    import image3 from "$lib/assets/image2.webp"
</script>
<div class='bg'>
</div>
<div class="bgtext strokeme">
    <div style="display:flex; justify-content:flex-end; width:100%; padding:-10;">
        <button type="button" on:click={navigateToLandingPage} class="back-button">Back to Home Page</button>
    </div>
    <h1>About Us</h1>
    <div class="strokeme">
        <p>Welcome to “Walk Through History”, a groundbreaking web app that seamlessly integrates cutting-edge technologies <br>
        such as Svelte and OpenStreetMap to redefine the way we engage with Black history. <br><br> 
        Our mission is to illuminate the rich tapestry of Black heritage by guiding users on an immersive journey through <br>
        significant historical sites, both well-known and hidden gems. <br><br>With meticulous research and curated content, we strive to provide comprehensive descriptions and insights, allowing users to connect deeply with the stories, struggles, and triumphs of the past. <br> <br>Join us as we embark on a transformative exploration of culture, resilience, and the enduring legacy of Black history.</p>
    </div>
    <div class="image123">
        <div style="float:left;margin-right:5px;">
            <img src={image2} height="300" width="350"  />
        </div>
        <div style="float:left;margin-right:5px;">
            <img src={image3} height="300" width="350" />
        </div>
    </div>
    <div class="scroll strokeme">
        <h1>Inspiration</h1>
        <p>Our inspiration for this project came from a statistical analysis we ran on the number of people who have visited the National Museum of African Art. 
            <br><br>We have seen a scary downward trend and have attributed it to the fact that people prefer the ease of access of simply using their phone to find information and that Museums cost money. 
            <br><br>Our solution is to incorporate the fact people want to use their phones to read information, with the cost of 0$ to appreciate landmarks of black history. </p>
    </div>
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
    button {
      background-color: #69bb22;
      color: #fff;
      padding: 10px 15px;
      cursor: pointer;
      border: none;
    }
    .strokeme
    {
        color: white;
        text-shadow:
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;  
    }
</style>