import { Player } from './player.js';
export const songs  = []
const player = new  Player()

class Song {
    constructor(id, index, songName, artist, image, audio) {
        this.id = id
        this.index = index
        this.songName = songName
        this.image = image
        this.artist = artist
        this.playing = false
        this.show = true
        this.audio = new Audio(audio);
        this.timeout = null
    }

    update() {
        if (player.currentSong.id !== this.id) {
           return
        } else {
            player.updateCurrentSong();
        }

        setTimeout(() => this.update(), 1000);
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
                
                if (player.currentSong != null) {
                    if (player.currentSong.id != this.id) {
                        player.currentSong.audio.pause();
                    }
                    player.currentSong.audio.currentTime = 0;
                }

                player.currentSong = this
                this.update();
                this.set_volume()
            }

        })
        .catch(error => {
            console.error("Error:", error);
        });

    }

    set_volume() {
        if (this.playing ) {
            this.audio.volume = (player.volume/100)
        }
    }

    pause() {
        this.playing = !this.playing

        if (this.playing ) {
            this.audio.play()
        } else {
            this.audio.pause()
        }
    }

    set_playback(percentage) {
        this.audio.currentTime = this.audio.duration * percentage
    }
    connect_button() {
        const button = document.getElementById(this.id);
        button.addEventListener("click", () => {
            player.chooseNextSong(this)
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

    for (let i = 0; i < songs.length; i++) {
        songs[i].updateCard()
        songs[i].connect_button()
    }



}

export function createSongs(songsData) {

    for (const song_id in songsData) {
        const song = new Song(song_id,songs.length, songsData[song_id]["Name"], songsData[song_id]["Artist"], songsData[song_id]["Image"], songsData[song_id]["Audio"] );
        songs.push(song)
    }
    renderSongs()

    player.updateCurrentSong()
}

