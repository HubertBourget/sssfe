import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { usePlayingContext } from "../../pageComponents/NowPlaying";
import Pause from "../../assets/pause.svg";
import { useAuth0 } from '@auth0/auth0-react';
import Play from "../../assets/playicon.svg";
export default function PlayButton({track, large}) {
    const { user, isAuthenticated } = useAuth0();
  // const isAuthenticated = true;
  // const user = { name: "debug9@debug.com" };
    const currentSong = usePlayingContext(state=>state.getCurrentSong)
    const setSongs = usePlayingContext(state=>state.setSongs)
    const playingStatus = usePlayingContext(state=>state.state)
    const [playButton, setPlay] = useState(true)
    useEffect(() => {
        if(track.id !== currentSong()){
          setPlay(true)
        }
        if(track.id === currentSong() && playingStatus.playing === true){
          setPlay(false)
        }
        if(track.id === currentSong() && playingStatus.playing === false){
            setPlay(true)
        }
    }, [currentSong, track, playingStatus])
  const onPlay = (event) => {
    event.stopPropagation()
    setPlay(!playButton)
    setSongs([{
      id: track.id,
      songUrl: track.songUrl,
      songTitle: track.title,
      isVideo: false, 
      artistName: track.accountName,
      img: track.selectedImageThumbnail,
    }], 0)
    addToPlaybackHistory()
  }
  async function addToPlaybackHistory(){
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/updateUserPlaybackHistory`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ 
        user: user.name,
        videoId: track.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
    
  }
  return (
    <PlayComponent>
        <img className="album-cover" src={playButton=== true ? Play : Pause} alt="Album Cover" onClick={onPlay}/>
    </PlayComponent>
  )
}

const PlayComponent = styled.div`
    // background-color: #434289;
    border-radius: 50px;
    height: 60px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    @media (max-width: 991px) {
      width: 50px;
      height: 50px;
    }
    img {
      width: 28px;
      @media (max-width: 991px) {
        width: 22px;
      }
      filter: invert(27%) sepia(69%) saturate(6315%) hue-rotate(211deg)
          brightness(56%) contrast(86%);
    }
`
