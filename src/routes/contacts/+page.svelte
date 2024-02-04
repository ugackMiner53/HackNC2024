<script>
    import ContactUs from "$lib/components/ContactUs.svelte";
    import image from "$lib/assets/bg.webp";
</script>
  
<div class="bg">
    <h1>Contact Us</h1>
    <ContactUs />
</div>
<style>
    h1{text-align: center;}
    h1{font-family: 'Times New Roman', Times, serif;}
    h1{color: whitesmoke;}
    .bg {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-image: url("https://jobs.globalpayments.com/media/sowbjwkj/gpn_brand-mastheads_netspend-nextep-xenial.jpg?anchor=center&mode=crop&width=1600&height=900&mode=crop&quality=75"); 
        background-size: 100% 100%; 
        background-attachment: fixed;
    }
</style>