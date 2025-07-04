import { useState, useEffect } from 'react'
import { FaSpotify } from "react-icons/fa";
import './App.css'


function App() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [artist, setArtist] = useState(null);
  const [track, setTrack] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [album, setAlbum] = useState(null);
  
  const fetchArtist = async (e) => {
    e.preventDefault();
    if(!input.trim()) return;
    setIsLoading(true);

    setAlbum("");
    setTracks("");

    try {
      // const res = await fetch(`http://localhost:5000/album/getAlbum/${input}`);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/album/getAlbum/${input}`);
      const data = await res.json();

      setIsLoading(false);

      document.body.style.backgroundColor = "rgb(246, 188, 27)";

      setAlbum(data.album);
      setTracks(data.tracks);
    } catch(err) {}

    setInput("");
  };

  return (
    <div className='card'>
      {(
        <>
          <h1>Shine</h1>
          <form onSubmit={fetchArtist} className='searchForm'>
            <input
              className='searchInput'
              type='text'
              placeholder='Album, Track, Artist'
              value={input}
              onChange={(e) => {setInput(e.target.value)}}
            />
            <button type="submit" className='searchButton'>Search</button>
            {/* <button type='button' onClick={fetchArtist}>Load artist info</button> */}
          </form>
        </>
      )}
      {isLoading && (
        <>
          <p className='loading-text'>Loading...</p>
        </>
      )}

      {album && (
        <>
          <a href={`https://open.spotify.com/album/${album.id}`} target='_blank'>
            <img className="albumCoverImage" src={album.images[0].url} alt="Album Cover" />
          </a>
          <h2 className='albumTitle'>{album.name}</h2>
          <p className='albumMeta'>{album.artists.map(a => a.name).join(", ")} Released: {album.release_date}</p>
          <p></p>

          <ul className="track-list">
            {tracks.map((track, index) => (
              <li key={track.id} className="track-item">
                <div className="track-header">
                  <div className="track-title">
                    #{index+1}<span style={{ color: "#030339" }}>/</span><span style={{ color: "#bbb" }}>#{track.popularity}</span> {track.name}
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
              </li>

              
            ))}
          </ul>

          {/* <li key={track.id} className="track-item">
                <div className="track-header">
                  <div className="track-title">
                    #{index + 1} / {track.name}
                  </div>
                  <div className="track-popularity">
                    {track.popularity}
                  </div>
                </div>

                <div className="track-meta">
                  {track.artists.map(a => a.name).join(", ")}
                </div>

                <a href={`https://open.spotify.com/track/${track.id}`} target='_blank' rel='noopener noreferrer'>
                  Listen Now
                </a>
              </li> */}


          
          {/* <ul className="track-list">
            {tracks.map((track, index) => (
              <li key={track.id} className="track-item">
                <div className="track-title">
                  <div> #{index+1}<span style={{ color: "#030339" }}>/</span><span style={{ color: "#bbb" }}>#{track.popularity}</span> </div>
                  </div>
                <div className="track-meta">
                  <div className='track-title'> {track.name} </div>
                  {track.artists.map(a => a.name).join(", ")}<br />
                </div>
                <a href={`https://open.spotify.com/track/${track.id}`} target='_blank'>
                  Listen Now
                </a>
              </li>
            ))}
          </ul> */}
        </>
      )}
    </div>
  );

  /* return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        
        <iframe 
          style={{borderRadius:"12px"}} 
          src="https://open.spotify.com/embed/track/1CPZ5BxNNd0n0nF4Orb9JS?utm_source=generator" 
          width="100%" 
          height="352"
          allowfullscreen="" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
        />

        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/album/14JkAa6IiFaOh5s0nMyMU9?utm_source=generator"
          width="100%"
          height="520"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </>
  ) */
}

export default App
