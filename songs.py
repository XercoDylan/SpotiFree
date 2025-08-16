
from firebase import *
from flask import Flask, render_template, request, jsonify

currentSong = None
songs = {
    "object": {},
    "dict": {}
}


class Song():
    def __init__(self, id, songName, artist, audio):
        self.id = id
        self.songName = songName
        self.audio = audio
        self.artist = artist
        self.playing = False
        self.visible = True
    def __repr__(self):
        return f"Song(name='{self.songName}', artist='{self.artist}')"
    def play(self):
        global currentSong 

        if currentSong != None:
            currentSong.playing = not currentSong.playing

        self.playing = not self.playing
       
        if self.playing:
            print("Playing song:", self.id)
            currentSong = self
        else:
            print("Stopped Playing Song:", self.id)
            currentSong = None

        
        return jsonify({"status": self.playing})
       

def getCurrentSong():
    return currentSong

def getSongs():
    print("******GETTING SONGS******")
    return songs

def initializeSongs():
    print("******INITIALIZING SONGS******")
    songsData = getSongData()

    for song in songsData:
        data = song.to_dict()
        songs["object"][song.id] = Song(song.id, data["Name"], data["Artist"], data["Audio"]) 
        songs["dict"][song.id] =  {"Name": data["Name"], "Artist" : data["Artist"] , "Image" : data["Image"] , "Audio" : data["Audio"]}


