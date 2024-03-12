import React, { useState } from 'react'
import styled from "styled-components";
import { usePlayingContext } from "../../pageComponents/NowPlaying";
import Pause from "../../assets/pause.svg";
import Play from "../../assets/playicon.svg";

export default function PlayButton({track}) {
    console.log("🚀 ~ PlayButton ~ track:", track)
  const setSongs = usePlayingContext(state=>state.setSongs)
  const [playButton, setPlay] = useState(true)
  const onPlay = (event) => {
    event.stopPropagation()
    setPlay(!playButton)
    setSongs([{
      id: 1,
      songUrl: track.fileUrl,
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
    width: 60px;
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
