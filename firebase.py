import firebase_admin
from firebase_admin import credentials, firestore

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