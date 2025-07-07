import { useState, useEffect } from 'react'
import { FaSpotify } from "react-icons/fa";
import { CiStar } from "react-icons/ci";


import './App.css'


function App() {
  const [input, setInput] = useState("");
  const [searchType, setSearchType] = useState("artist");
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState(null);
  const [track, setTrack] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [album, setAlbum] = useState(null);

  const [artistList, setArtistList] = useState([]);
  const [viewingArtistList, setViewingArtistList] = useState(false);


  useEffect(() => {
    const raw = localStorage.getItem('artistFollowingList');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setArtistList(parsed);
      } catch (err) {
        setArtistList([]);
      }
    }
  }, []);

  const loadArtistList = () => {
    let followingList = JSON.parse(localStorage.getItem('artistFollowingList')) || [];
    
    if(followingList.length > 0) {
      setArtistList(followingList);
      setViewingArtistList(true);
    }
  }

  const addToArtistList = (artist) => {
    let followingList;
    try {
      followingList = JSON.parse(localStorage.getItem('artistFollowingList')) || [];
    }
    catch(err){
      console.log("ouch");
      followingList = [artist];
    };

    if (!followingList.some((a) => a.id === artist.id)) {
      const simplified = {
        id: artist.id,
        name: artist.name,
        popularity: artist.popularity,
        image: artist.images?.[0]?.url || null,
      };
      followingList.push(simplified);

      setArtistList(followingList);
      localStorage.setItem('artistFollowingList', JSON.stringify(followingList));
    }
  }

  const clearArtistList = () => {
    localStorage.removeItem('artistFollowingList');
    setArtistList([]);
  }

  const fetchArtist = async (e) => {
    e.preventDefault();
    if(!input.trim()) return;
    setIsLoading(true);


    setTrack(null);
    setArtist(null);
    setAlbum(null);
    setTracks(null);

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

      // const res = await fetch(`http://localhost:5000/album/getAlbum/${input}`);

      res = await fetch(`${import.meta.env.VITE_API_URL}/album/getAlbum/${input}`);
      data = await res.json();
      setIsLoading(false);
      document.body.style.backgroundColor = "rgb(246, 188, 27)";

      setAlbum(data.album);
      setTracks(data.tracks);

    } catch(err) {
      alert(err);
    }

    setInput("");
  };

  if (viewingArtistList) {
    const sorted = [...artistList].sort((a, b) => b.popularity - a.popularity);

    return (
      <>
      <div className='card'>
        <h1>Shine</h1>
        <h2 style={{ color: "#030339" }}>🎧 Followed Artists Leaderboard</h2>

        <ul className="track-list">
          {[...artistList]
            .sort((a, b) => b.popularity - a.popularity)
            .map((artist, index) => (
              <li key={artist.id} className="track-item" >
                <div className="track-header">
                  <div className="track-title">
                    #{index + 1} <span style={{ color: "#bbb" }}>({artist.popularity})</span> {artist.name}
                  </div>
                </div>

                <div className="track-footer">
                  <div className="track-artists">
                    <a
                      href={`https://open.spotify.com/artist/${artist.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaSpotify size={24}/>
                    </a>
                  </div>

                  {artist.image && (
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className='leaderboard-image'
                    />
                  )}
                </div>
              </li>
            ))}
        </ul>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <button className="searchButton" onClick={() => setViewingArtistList(false)}>Back</button>
          <button className="searchButton" style={{ backgroundColor: "#ff5252" }} onClick={clearArtistList}>
            Clear All
          </button>
        </div>
      </div>
    </>
    );
  }
  
  else if(!viewingArtistList)
  return (
    <div className='card'>
      <h1>Shine</h1>
      <form onSubmit={fetchArtist} className='searchForm'>
        {artistList.length > 0 && (
          <button type="button" onClick={loadArtistList}>Load</button>
        )}
        <input
          className='searchInput'
          type='text'
          placeholder='Album, Track, Artist'
          value={input}
          onChange={(e) => {setInput(e.target.value)}}
        />

        {/* <select
          className="searchType"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="album">Album</option>
          <option value="track">Track</option>
          <option value="artist">Artist</option>
        </select> */}

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
            </>
          )}
          {artist && (
            <>
              <a href={`https://open.spotify.com/artist/${artist.id}`} target='_blank'>
                <img className="albumCoverImage" src={artist.images[0].url} alt="Artist Profile" />
              </a>
              <div className='header-items'>
                <h2 className='albumTitle'>{artist.name}</h2>
                <button type="button" style={{ backgroundColor: "transparent"}} onClick={() => addToArtistList(artist)}><CiStar size={24}/></button>
              </div>
              <p className='albumMeta'>Latest album: {album.name}</p>
            </>
          )}
          {track && (
            <>
              <a href={`https://open.spotify.com/track/${track.id}`} target='_blank'>
                <img className="albumCoverImage" src={track.album.images[0].url} alt="Artist Profile" />
              </a>
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
