import { songs } from './songs.js';

function updateSearch(text) {
    for (const song_id in songs) {
        if (songs[song_id].songName.toLowerCase().includes(text.toLowerCase())) {
            songs[song_id].show = true
        } else {
            songs[song_id].show = false
        }
        songs[song_id].updateCard()
    }
}

export function initializeSearch() {
    console.log("Initializing search")

    const textbox = document.getElementById("songSearch");

    textbox.addEventListener("input", () => {
        updateSearch(textbox.value)
    });
}