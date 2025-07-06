import { useState, useEffect } from 'react'
import { FaSpotify } from "react-icons/fa";

import './App.css'


function App() {
  const [input, setInput] = useState("");
  const [searchType, setSearchType] = useState("album");
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState(null);
  const [track, setTrack] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [album, setAlbum] = useState(null);
  
  const fetchArtist = async (e) => {
    e.preventDefault();
    if(!input.trim()) return;
    setIsLoading(true);


    setTrack(null);
    setArtist(null);
    setAlbum(null);
    setTracks(null);

    // alert(searchType);

    try {
      let res = null;
      let data = null;

      if(searchType === "track"){
        res = await fetch(`${import.meta.env.VITE_API_URL}/track/getTrack/${input}`);
        data = await res.json();
        setTrack(data);
      }
      else if(searchType === "artist"){
        res = await fetch(`${import.meta.env.VITE_API_URL}/artist/getArtist/${input}`);
        data = await res.json();
        setArtist(data);
      }

      // const res = await fetch(`${import.meta.env.VITE_API_URL}/album/getAlbum/${input}`);
      // const res = await fetch(`http://localhost:5000/album/getAlbum/${input}`);
      // const data = await res.json();

      res = await fetch(`${import.meta.env.VITE_API_URL}/album/getAlbum/${input}`);
      data = await res.json();
      setIsLoading(false);
      document.body.style.backgroundColor = "rgb(246, 188, 27)";

      setAlbum(data.album);
      setTracks(data.tracks);


      


      /* setAlbum(data.album);
      setTracks(data.tracks); */
    } catch(err) {
      alert(err);
    }

    setInput("");
  };

  return (
    <div className='card'>
      <h1>Shine</h1>
      <form onSubmit={fetchArtist} className='searchForm'>
        <input
          className='searchInput'
          type='text'
          placeholder='Album, Track, Artist'
          value={input}
          onChange={(e) => {setInput(e.target.value)}}
        />

        <select
          className="searchType"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="track">Track</option>
          <option value="album">Album</option>
          <option value="artist">Artist</option>
        </select>

        <button type="submit" className='searchButton'>Search</button>
      </form>
      
      {isLoading && (
        <>
          <p className='loading-text'>Loading...</p>
        </>
      )}

      {album && (
        <>
          {!(artist || track) && (
            <>
              <a href={`https://open.spotify.com/album/${album.id}`} target='_blank'>
              <img className="albumCoverImage" src={album.images[0].url} alt="Album Cover" />
              </a>
              <h2 className='albumTitle'>{album.name}</h2>
              <p className='albumMeta'>{album.artists.map(a => a.name).join(", ")} ({album.release_date})</p>
              <p></p>
            </>
          )}
          {artist && (
            <>
              <a href={`https://open.spotify.com/artist/${artist.id}`} target='_blank'>
              <img className="albumCoverImage" src={artist.images[0].url} alt="Artist Profile" />
              </a>
              <h2 className='albumTitle'>{artist.name}</h2>
              <p className='albumMeta'>Latest album: {album.name}</p>
              <p></p>
            </>
          )}
          {track && (
            <>
              <a href={`https://open.spotify.com/track/${track.id}`} target='_blank'>
                <img className="albumCoverImage" src={track.album.images[0].url} alt="Artist Profile" />
              </a>
              <p></p>
            </>
          )}

          <ul className="track-list">
            {track === null && tracks.map((aTrack, index) => (
              <li key={aTrack.id} className="track-item">
                {(
                  <>
                    <div className="track-header">
                      <div className="track-title">
                        #{index+1}<span style={{ color: "#030339" }}>/</span><span style={{ color: "#bbb" }}>#{aTrack.popularity}</span> {aTrack.name}
                      </div>
                    </div>

                    <div className="track-footer">
                      <div className="track-artists">
                        {aTrack.artists.map((a) => a.name).join(", ")}
                      </div>
                      <a
                        className="track-link"
                        href={`https://open.spotify.com/track/${aTrack.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaSpotify size={24}/>
                      </a>
                    </div>
                  </>
                )}
              </li>              
            ))}
            {track !== null && (
              <li key={track.id} className="track-item">
                {(
                  <>
                    <div className="track-header">
                      <div className="track-title">
                        #{track.popularity} {track.name}
                      </div>
                    </div>

                    <div className="track-footer">
                      <div className="track-artists">
                        {track.artists.map((a) => a.name).join(", ")}
                      </div>
                      <a
                        className="track-link"
                        href={`https://open.spotify.com/track/${track.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaSpotify size={24}/>
                      </a>
                    </div>
                  </>
                )}
              </li>              
            )}
          </ul>
        </>
      )}

    </div>
  );
}

export default App
