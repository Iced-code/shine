from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import base64
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()

CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")


def get_token():
    auth_string = f"{CLIENT_ID}:{CLIENT_SECRET}"
    b64_auth_string = base64.b64encode(auth_string.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth_string}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "client_credentials"
    }

    r = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)
    
    return r.json().get("access_token")

@app.route('/artist/getArtist')
def get_artist_info():
    TOKEN = get_token()
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }

    params = {
        "q": "HUNTR/X",
        "type": "artist",
        "limit": 1
    }

    r = requests.get(f"https://api.spotify.com/v1/search", headers=headers, params=params)
    print(r.json())
    artist = r.json()["artists"]["items"][0]
    artist_id = artist["id"]

    r = requests.get(f"https://api.spotify.com/v1/artists/{artist_id}", headers=headers)
    return jsonify(r.json())


@app.route('/track/getTrack/<track_name>')
def get_track_info(track_name):
    TOKEN = get_token()
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }

    params = {
        "q": f"{track_name}",
        "type": "track",
        "limit": 1
    }

    r = requests.get(f"https://api.spotify.com/v1/search", headers=headers, params=params)
    track = r.json()["tracks"]["items"][0]
    track_id = track["id"]

    r = requests.get(f"https://api.spotify.com/v1/tracks/{track_id}", headers=headers)
    print(r.json())
    return jsonify(r.json())


def get_track_info_with_ID(track_ID):
    TOKEN = get_token()
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }

    r = requests.get(f"https://api.spotify.com/v1/tracks/{track_ID}", headers=headers)
    # print(r.json())
    return r.json()

@app.route('/album/getAlbum/<album_name>')
def get_album_info(album_name):
    TOKEN = get_token()
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }

    params = {
        "q": f"{album_name}",
        "type": "album",
        "limit": 1
    }

    r = requests.get(f"https://api.spotify.com/v1/search", headers=headers, params=params)
    album = r.json()["albums"]["items"][0]
    album_id = album["id"]

    r = requests.get(f"https://api.spotify.com/v1/albums/{album_id}", headers=headers)
    
    album_info = r.json()
    album_tracks = album_info["tracks"]["items"]

    tracks_info = []
    for track in album_tracks:
        track_ID = track["id"]
        r_track = get_track_info_with_ID(track_ID)
        if r_track:
            tracks_info.append(r_track)

    sorted_tracks = sorted(tracks_info, key=lambda t: t["popularity"], reverse=True)

    return jsonify({
        "album": {
            "name": album_info["name"],
            "release_date": album_info["release_date"],
            "artists": album_info["artists"],
            "images": album_info["images"], 
            "id": album_info["id"]
        },
        "tracks": sorted_tracks
    })

@app.route('/search/<search_input>')
def search_item(search_input):
    TOKEN = get_token()
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }

    params = {
        "q": f"{search_input}",
        "type": "album,track,artist",
        "limit": 1
    }

    r = requests.get(f"https://api.spotify.com/v1/search", headers=headers, params=params)
    result = r.json()
    print(f"{result}")

    return jsonify({
        "result": result,
    })

if __name__ == '__main__':
    app.run(debug=True)
