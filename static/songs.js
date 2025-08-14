export const songs = {}
const svgs = {
    "pause": "M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z",
    "play": "M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
}
var currentSong = null

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatTime() {
    const minutes = Math.floor(audio.duration / 60);
    const seconds = Math.floor(audio.duration % 60);
    return `${minutes}:${seconds}`
}

function updateCurrentSong() {
    const playBar = document.getElementById("playBar");
    const currentSongDiv = document.getElementById("currentSong");
    const currentArtistDiv = document.getElementById("currentArtist");
    const currentImage = document.getElementById("currentImage");
    const play_pause_svg = document.getElementById("Play/Pause");
    const startTime = document.getElementById("currentTime");
    const endTime = document.getElementById("totalTime");

    if (currentSong != null) {
        playBar.style.visibility = "visible"
        startTime.textContent = formatTime(currentSong.audio.currentTime)
        endTime.textContent = formatTime(currentSong.audio.duration)
        currentSongDiv.textContent = currentSong.songName
        currentArtistDiv.textContent = currentSong.artist
        currentImage.src = currentSong.image
        play_pause_svg.setAttribute("d", currentSong.playing && svgs["pause"] || svgs["play"])

    } else {
        playBar.style.visibility = "hidden"
        play_pause_svg.setAttribute("d", svgs["pause"])
        console.log("empty")
    }


}

class Song {
    constructor(id, songName, artist, image, audio) {
        this.id = id
        this.songName = songName
        this.image = image
        this.artist = artist
        this.playing = false
        this.show = true
        console.log(audio)
        this.audio = new Audio(audio);
    }

    async play() {
        fetch("/play", { 
            method: "POST",              
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"song_id": this.id})
        })
        .then(response => response.json()) 
        .then(result => {
            this.playing = result["status"]

            if (this.playing) {
                this.audio.play()
                
                if (currentSong != null) {
                    if (currentSong.id != this.id) {
                        currentSong.audio.pause();
                    }
                    currentSong.audio.currentTime = 0;
                }
            }

            console.log("got 1")
            if (currentSong != null && currentSong.id != this.id) {
                console.log("got")
                currentSong = songs[result["currentSong"]] 
                const intervalId = setInterval(() => {
                    if (!this.playing || currentSong.id !== this.id) {
                        console.log("Clear")
                        clearInterval(intervalId); // stop checking
                    } else {
                        console.log("GGGGG")
                        updateCurrentSong();
                    }
                    }, 1000);
            }
  
            


            
        })
        .catch(error => {
            console.error("Error:", error);
        });

    }

    pause() {
        this.playing = !this.playing

        if (this.playing ) {
            this.audio.play()
        } else {
            this.audio.pause()
        }

        updateCurrentSong()
    }

    connect_button() {
        const button = document.getElementById(this.id);
        button.addEventListener("click", () => {
            this.play()
        
        });
    }

    updateCard() {
        if (this.card == null) {
            this.card = document.createElement("article");
            this.card.className = "card";
            this.card.innerHTML =  `<article class="card"><div class="cover"><img class="album-cover" src=${this.image} alt="Album"></div><button name="song_id" id="${this.id}" class="play" aria-label="Play"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7L8 5z"/></svg></button><div class="meta"><h4 class="title ellip">${this.songName}</h4><p class="artist ellip">${this.artist}</p></div></article>`
            songsContainer.appendChild(this.card);
        }
        
        this.card.style.visibility = this.show && "visible" || "hidden"
        this.card.style.display = this.show && "block" || "none"

    }

 

}

function renderSongs() {
    const songsContainer = document.getElementById("songsContainer");
    for (const song_id in songs) {
        songs[song_id].updateCard()
        songs[song_id].connect_button()
    }

}

export function createSongs(songsData) {
    updateCurrentSong()

    for (const song_id in songsData) {
        const song = new Song(song_id, songsData[song_id]["Name"], songsData[song_id]["Artist"], songsData[song_id]["Image"], songsData[song_id]["Audio"] );
        songs[song_id] = song
    }

    renderSongs()

    const playButton = document.getElementById("playBtn");

    playButton.addEventListener("click", () => {
        if (currentSong != null) {
            console.log("CLICK")
            currentSong.pause()
        }
    })


}

