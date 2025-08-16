async function Upload(formData) {
    try {
        const response = await fetch("/upload_song", {
            method: "POST",
            body: formData
        });
        
       
        const result = await response.json();
        console.log(response.ok)
        if (response.ok) {
            alert("Song uploaded successfully!");
            console.log("Upload success:", result);
        } else {
            alert("Something went wrong while uploading.");
        }
        
    } catch (error) {
        console.error("Upload error:", error);
        alert("Something went wrong while uploading.");
    }
}



async function initializeUpload() {
    document.getElementById("uploadForm").addEventListener("submit", function (event) {
        event.preventDefault();

        console.log("INITIALIZED")

        const songName = document.getElementById("songName").value.trim();
        const artistName = document.getElementById("artistName").value.trim();
        const audioFile = document.getElementById("audioFile").files[0];
        const coverImage = document.getElementById("coverImage").files[0];

        if (!songName || !artistName || !audioFile || !coverImage) {
            alert("Please fill in all fields before uploading.");
            return;
        }

        alert(`Uploading "${songName}" by ${artistName}...`);

        const formData = new FormData();
        formData.append("songName", songName);
        formData.append("artistName", artistName);
        formData.append("audioFile", audioFile);
        formData.append("coverImage", coverImage);
        console.log(coverImage)
        Upload(formData)
    })
}



function init() {
    initializeUpload()
}



document.addEventListener("DOMContentLoaded", () => {
    init()
})

