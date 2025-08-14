const songs = {}
var currentSong = null


function updateCurrentSong() {
    const playBar = document.getElementById("playBar");
    const currentSongDiv = document.getElementById("currentSong");
    const currentArtistDiv = document.getElementById("currentArtist");
    const currentImage = document.getElementById("currentImage");
    
    if (currentSong != null) {
        playBar.style.visibility = "visible"
        currentSongDiv.textContent = currentSong.songName
        currentArtistDiv.textContent = currentSong.artist
        currentImage.src = currentSong.image
    } else {
        playBar.style.visibility = "hidden"
    }
}

class Song {
    constructor(id, songName, artist, image) {
        this.id = id
        this.songName = songName
        this.image = image
        this.artist = artist
        this.playing = false
    }

    async play() {
        fetch("/play", { // Your server endpoint
            method: "POST",                // POST request
            headers: {
                "Content-Type": "application/json" // Send JSON
            },
            body: JSON.stringify({"song_id": this.id})      // Convert JS object to JSON string
        })
        .then(response => response.json()) // Parse JSON response
        .then(result => {
            this.playing = result["status"]
            currentSong = songs[result["currentSong"] ] 
            updateCurrentSong()
        })
        .catch(error => {
            console.error("Error:", error);
        });


    }

    connect_button() {
        const button = document.getElementById(this.id);
        button.addEventListener("click", () => {
            this.play()
        
        });
    }


}

function renderSongs() {
    const songsContainer = document.getElementById("songsContainer");
    for (const song_id in songs) {
        const cardHTML = `<article class="card"><div class="cover"><img  src=${songs[song_id].image} alt="Album" width="150" height="150"></div><button name="song_id" id="${song_id}" class="play" aria-label="Play"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7L8 5z"/></svg></button><div class="meta"><h4 class="title ellip">${songs[song_id].songName}</h4><p class="artist ellip">${songs[song_id].artist}</p></div></article>`
        songsContainer.innerHTML += cardHTML;
        songs[song_id].connect_button()
    }

}

export function createSongs(songsData) {
    updateCurrentSong()

    for (const song_id in songsData) {
        const song = new Song(song_id, songsData[song_id]["Name"], songsData[song_id]["Artist"], songsData[song_id]["Image"]);
        songs[song_id] = song
    }

    renderSongs()
}

