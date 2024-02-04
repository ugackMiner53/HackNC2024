<script lang="ts">
    async function formSubmitEvent(event : SubmitEvent) {
        event.preventDefault();

        const form = <HTMLFormElement>event.target;
        const formData = new FormData(form);

        const fileInput = <HTMLInputElement>document.getElementById("fileToUpload");

        if (fileInput.files == null) return;

        console.log(formData.get("fileToUpload"));

        const response = await fetch(`/api/image?id=${"dcb66720-c0ac-41b3-adfa-339f294cc2e7"}`, {
            method: "POST",
            body: formData
        })

        console.log(response);
        return false;
    }

</script>


<form on:submit={formSubmitEvent} enctype="multipart/form-data" method="post">
    <input type="file" name="fileToUpload" id="fileToUpload" accept=".png" required>
    <button type="submit">Submit</button>
</form>