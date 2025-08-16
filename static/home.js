import { createSongs } from './songs.js';
import { initializeSearch } from './search.js';
async function fetchSongs() {
    const response = await fetch("/get_songs");
    return response.json();
}

async function init() {
    const songs = await fetchSongs()
    console.log(songs)
    createSongs(songs)
    initializeSearch()
}



document.addEventListener("DOMContentLoaded", () => {
    console.log("GGGGG")
    init()
})

