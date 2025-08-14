import { createSongs } from './songs.js';

async function fetchSongs() {
    const response = await fetch("/get_songs");
    return response.json();
}

async function init() {
    const songs = await fetchSongs()
    createSongs(songs)
}



document.addEventListener("DOMContentLoaded", () => {
    init()
})
