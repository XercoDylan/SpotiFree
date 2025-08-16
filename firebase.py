import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, render_template, request, jsonify
import requests
from dotenv import load_dotenv
import os

load_dotenv()

def uploadImage(coverImage):
    print("uploading image")

    data = {
        "type": "file",
        "action": "upload",
        "timestamp": "1755346110123",
        "auth_token": "776441dda6b764d3f7b409d5eadd8d23d623899"
    }


    files = {
        "source": coverImage
    }
    resp = requests.post('https://imgbb.com/json', data=data, files=files)

    if resp.ok:
        print("Request sucessfull")
        print(resp.json())
        return resp.json()["image"]["display_url"]
    else:
        print("Error:", resp.status_code, resp.text)
        return None

def uploadAudio(audioFile):
    print("uploading song")
    
    token = os.getenv("DROPBOX_TOKEN")
    dropbox_path = f"/{os.path.basename(audioFile.filename)}"
    url = "https://content.dropboxapi.com/2/files/upload"
    headers = {
    "Authorization": f"Bearer {token}",
    "Dropbox-API-Arg": f'{{"path": "{dropbox_path}", "mode": "add", "autorename": true, "mute": false}}',
    "Content-Type": "application/octet-stream",
    }
    resp = requests.post(url, headers=headers, data=audioFile.read())

    if not resp.ok:
        print("Error:", resp.status_code, resp.text)
        return None
    
    share_url = "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings"
    share_headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    share_data = {"path": dropbox_path}

    share_resp = requests.post(share_url, headers=share_headers, json=share_data)

    if share_resp.ok:
        link = share_resp.json()["url"]
        direct_link = link.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "?raw=1")
        return direct_link
    else:
        print("Error:", resp.status_code, resp.text)
        return None

def uploadSongToFirebase(audioLink, artistName, songName, imageLink):
    data = {
         
     }
    db = firestore.client()
    try:
        doc_ref = db.collection("songs").add({
            "Artist": artistName,
            "Audio": audioLink,
            "Image": imageLink,
            "Name": songName,
        })
        print("✅ Upload successful, document ID:", doc_ref[1].id)
        return doc_ref
    except Exception as error:
        print("❌ Upload failed:", error)
        return None



def uploadSong(audioFile, artistName, songName, coverImage):
    displayImage = uploadImage(coverImage)

    if displayImage == None:
        return jsonify({"message": f"Failed to upload image"}), 400

    displaySong = uploadAudio(audioFile)

    if displaySong == None:
        return jsonify({"message": f"Failed to upload audio"}), 400
    
    firebaseUpload = uploadSongToFirebase(displaySong, artistName, songName, displayImage)

    if firebaseUpload == None:
        return jsonify({"message": f"Failed to upload song to firebase"}), 400
    
    return jsonify({"message": f"Uploaded {songName} by {artistName}"})

def getSongData():
    db = firestore.client()
    songsData = db.collection("songs").stream()
    return songsData

def initializeApplication():
    cred = credentials.Certificate("serviceAccountKey.json")
    app = firebase_admin.initialize_app(cred)
    print("******INITIALIZED FIREBASE******")




if __name__ == "__main__":
    initializeApplication()