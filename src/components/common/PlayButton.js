import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { usePlayingContext } from "../../pageComponents/NowPlaying";
import Pause from "../../assets/pause.svg";
import Play from "../../assets/playicon.svg";
export default function PlayButton({track, large}) {
    const currentSong = usePlayingContext(state=>state.getCurrentSong)
    const setSongs = usePlayingContext(state=>state.setSongs)
    const playingStatus = usePlayingContext(state=>state.state)
    const [playButton, setPlay] = useState(true)
    useEffect(() => {
        if(track.id !== currentSong()){
          console.log(track.id)
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
