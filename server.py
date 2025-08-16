from flask import Flask, render_template, request, jsonify
from waitress import serve
from firebase import *
from songs import *

app = Flask(__name__)


@app.route("/")
@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/upload")
def upload():
    return render_template("upload.html")

@app.route("/get_songs")
def get_songs():
    return jsonify(getSongs()["dict"]) 


@app.route("/play", methods=["POST"])
def play_song():
     data = request.json
     song_id = data["song_id"]
     return getSongs()["object"][song_id].play()


@app.route("/upload_song", methods=["POST"])
def upload_song():
    audioFile = request.files.get("audioFile")
    artistName = request.form.get("artistName")
    songName = request.form.get("songName")
    coverImage = request.files.get("coverImage")

    
    if not audioFile or not artistName or not songName or not coverImage:
        return jsonify({"error": "Some files are missing"}), 400

    return uploadSong(audioFile, artistName, songName, coverImage)


if __name__ == "__main__":
    print("******RUNNING WEB APPLICATION******")
    initializeApplication()
    initializeSongs()
    serve(app, host="0.0.0.0", port=8000)
