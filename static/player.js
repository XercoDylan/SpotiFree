import { formatTime } from './utilities.js';
import { songs } from './songs.js';
const svgs = {
    "pause": "M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z",
    "play": "M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
}

const playButton = document.getElementById("playBtn");
const playBar = document.getElementById("playBar");
const currentSongDiv = document.getElementById("currentSong");
const currentArtistDiv = document.getElementById("currentArtist");
const currentImage = document.getElementById("currentImage");
const play_pause_svg = document.getElementById("Play/Pause");
const startTime = document.getElementById("currentTime");
const endTime = document.getElementById("totalTime");
const playbackBar = document.getElementById("playbackBar");
const volumeBar = document.getElementById("volumeBar");
const repeatButton = document.getElementById("repeatBtn");
const nextButton = document.getElementById("nextBtn");
const previousButton = document.getElementById("previousBtn");
const queueButton = document.getElementById("queueBtn");
const queuePanel = document.getElementById("queuePanel");
const queueList = document.getElementById("queueList");
const shuffleButton = document.getElementById("shuffleButton");
const queueListItems = queueList.querySelectorAll('li');

export class Player {
    constructor() {
        this.currentSong = null
        this.volume = 50
        this.settings = {
            shuffle: false,
            repeat: false,
            queue: true
        }

        this.queue = []
        this.currentQueue = 0

        shuffleButton.addEventListener("click", () => {
            this.settings.shuffle = !this.settings.shuffle
            this.shuffleQueue()
            this.updateCurrentSong()
        })

        queueButton.addEventListener("click", () => {
            this.settings.queue = !this.settings.queue
            this.updateCurrentSong()
        })

        nextButton.addEventListener("click", () => {
            this.chooseNextSong()
        })

        previousButton.addEventListener("click", () => {
            this.playPreviousSong()
        })

        repeatButton.addEventListener("click", () => {
            this.settings.repeat = !this.settings.repeat
            this.updateCurrentSong()
        })



        playButton.addEventListener("click", () => {
            if (this.currentSong != null) {
                this.currentSong.pause()
                this.updateCurrentSong()
            }
        })



        playbackBar.addEventListener('input', (event) => {
            if (this.currentSong != null) {
                this.currentSong.set_playback(event.target.value / 100)
                this.updateCurrentSong()
            }
        })

        volumeBar.addEventListener('input', (event) => {
            if (this.currentSong != null) {
                this.volume = event.target.value
                this.currentSong.set_volume()
                this.updateCurrentSong()
            }
        })
    }

    shuffleQueue() {
        for (var i = 1; i < 5; i++) {
            const choosenSong = songs[Math.floor(Math.random() * songs.length)]
            this.queue[i] = choosenSong
        }

        this.updateQueue()
    }

    updateCurrentSong() {


        this.updateQueue()

        if (this.currentSong != null) {
            playBar.style.visibility = "visible"
            startTime.textContent = formatTime(this.currentSong.audio.currentTime)
            endTime.textContent = formatTime(this.currentSong.audio.duration)
            currentSongDiv.textContent = this.currentSong.songName
            currentArtistDiv.textContent = this.currentSong.artist
            currentImage.src = this.currentSong.image
            play_pause_svg.setAttribute("d", this.currentSong.playing && svgs["pause"] || svgs["play"])
            playbackBar.value = (this.currentSong.audio.currentTime / this.currentSong.audio.duration) * 100
            volumeBar.value = this.volume

            if (this.settings.repeat) {
                repeatButton.setAttribute("class", "btn primary")
            } else {
                repeatButton.setAttribute("class", "btn")
            }

            if (this.settings.shuffle) {
                shuffleButton.setAttribute("class", "btn primary")
            } else {
                shuffleButton.setAttribute("class", "btn")
            }

            if (this.settings.queue) {
                queuePanel.style.visibility = "visible"
                queueButton.setAttribute("class", "btn primary")
            } else {
                queuePanel.style.visibility = "hidden"
                queueButton.setAttribute("class", "btn")
            }

            if (this.currentSong.audio.currentTime >= this.currentSong.audio.duration) {
                this.chooseNextSong()
            }
        } else {
            queuePanel.style.visibility = "hidden"
            playBar.style.visibility = "hidden"
            play_pause_svg.setAttribute("d", svgs["pause"])
        }


    }

    playPreviousSong() {
        if (this.currentQueue - 1 >= 0) {
            const choosenSong = this.queue[this.currentQueue - 1]
            this.currentQueue -= 1
            choosenSong.play()
            this.updateCurrentSong()
        }
    }

    async chooseNextSong(song) {
        if (song != null) {
            this.queue[this.currentQueue] = song
            await song.play()
        } else {
            const choosenSong = this.queue[this.currentQueue + 1]
            this.currentQueue += 1
            await choosenSong.play()
        }
        this.updateCurrentSong()
    }

    updateQueue() {
        if ((this.queue.length - this.currentQueue) < 5) {
            const needSongs = 5 - (this.queue.length - this.currentQueue)

            for (var i = 1; i <= needSongs; i++) {

                if (this.settings.shuffle) {
                    const choosenSong = songs[Math.floor(Math.random() * songs.length)]
                    this.queue.push(choosenSong)
                } else {

                    if (this.queue.length == 0) {
                        this.queue.push(songs[0])
                    } else {
                        const lastSongQueue = this.queue[this.queue.length - 1]
                        const lastSongIndex = lastSongQueue.index

                        if (lastSongIndex + 1 < songs.length) {
                            this.queue.push(songs[lastSongIndex + 1])
                        } else {
                            this.queue.push(songs[0])
                        }
                    }

                }
            }
        }

        queueListItems.forEach((item, index) => {
            const song = this.queue[this.currentQueue + index]

            if (song != null) {
                item.style.visibility = ""
                item.innerText = song.songName

                const imgElement = item.querySelector('img');

                if (imgElement) {
                } else {
                    const newImg = document.createElement('img');
                    const firstChild = item.firstChild;
                    newImg.alt = "Album"
                    newImg.src = song.image
                    newImg.className = "album-cover1"
                    item.insertBefore(newImg, firstChild);
                }

                if (this.currentQueue + index == this.currentQueue) {
                    item.style.backgroundColor = 'var(--accent)';
                } else {
                    item.style.backgroundColor = '';
                }
            } else {
                item.style.visibility = "none"
            }
        })

    }
}


