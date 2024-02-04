<script>
    let name = '';
    let email = '';
    let message = '';
    
    const handleSubmit = () => {
      // Handle form submission logic here
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Comment:', message);
      // You can add additional logic like sending the data to a server
      name = "";
      email = "";
      message = "";
    };
    const navigateToLandingPage = () => {
        window.location.href = 'http://localhost:5173/'; // Change this to your landing page URL
    };
</script>
<body class="mybg">
</body>
  
<style>
    /* Add your custom styles here */
    /* Example: */
    form {
      max-width: 400px;
      margin: auto;
    }
  
    label {
      display: block;
      margin-bottom: 8px;
      color: #fff;
    }
  
    input,
    textarea {
      width: 100%;
      padding: 8px;
      margin-bottom: 16px;
    }
  
    button {
      background-color: #007bff;
      color: #fff;
      padding: 10px 15px;
      cursor: pointer;
      border: none;
      
    }
</style>
<div class="background">
    <form on:submit|preventDefault={handleSubmit}>
        <label for="name">Name:</label>
        <input type="text" id="name" bind:value={name} required />
      
        <label for="email">Email:</label>
        <input type="email" id="email" bind:value={email} required />
      
        <label for="comment">Message:</label>
        <textarea id="comment" bind:value={message} rows="4" required></textarea>
      
        <button type="submit">Submit</button>
        <button on:click={navigateToLandingPage} class="back-button">Back to Home Page</button>
    </form>
</div>