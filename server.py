from flask import Flask, render_template, request, jsonify
from waitress import serve
from firebase import *
from songs import *
app = Flask(__name__)


@app.route("/")
@app.route("/index")
def home():
    return render_template("home.html")



@app.route("/get_songs")
def get_songs():
    return jsonify(getSongs()["dict"]) 



@app.route("/play", methods=["POST"])
def play_song():
     data = request.json
     song_id = data["song_id"]
     print(song_id)
     return getSongs()["object"][song_id].play()



if __name__ == "__main__":
    print("******RUNNING WEB APPLICATION******")
    initializeApplication()
    initializeSongs()
    serve(app, host="0.0.0.0", port=8000)
