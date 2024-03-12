import React, { useEffect, useState, createContext, useContext } from "react";
import MusicPlayer from "../components/MusicPlayer";
import styled from "styled-components";
import useAudioPlayer from "../Hooks/useAudioPlayer";

const NowPlayingContext = createContext({});

const MemoizedComponent = React.memo(({ children }) => {
  return <>{children}</>
});

function NowPlaying({ children }) {
  const [smallScreen, setSmallScreen] = useState(false);
  const {
    state,
    setState,
    audioRef,
    getCurrentTime,
    playNext,
    togglePlay,
    toggleHeart,
    handleVolume,
    handleTimeline,
    getSongDuration,
    handleLoop,
    playPrev,
    handleShuffle,
    handlePlay,
    setSongs,
    getCurrentSong,
    getCurrentRunningStatus
  } = useAudioPlayer();
  useEffect(() => {
    const updateTimeline = () => {
      if (audioRef.current) {
        setState((prevState) => ({
          ...prevState,
          time: audioRef.current.currentTime,
        }));
      }
    };
    const currentAudioRef = audioRef.current;
    currentAudioRef.addEventListener("timeupdate", updateTimeline);

    return () => {
      currentAudioRef.removeEventListener("timeupdate", updateTimeline);
    };
  }, [audioRef, setState, state.currentSongIndex, state.song]);
  return (
    <NowPlayingContext.Provider
      value={{
        state,
        setState,
        audioRef,
        getCurrentTime,
        playNext,
        togglePlay,
        toggleHeart,
        handleVolume,
        handleTimeline,
        getSongDuration,
        handleLoop,
        playPrev,
        handleShuffle,
        handlePlay,
        setSongs,
        getCurrentSong,
        getCurrentRunningStatus
      }}
    >
      <MemoizedComponent>
        {children}
      </MemoizedComponent>
      <MainContainer>
        <MusicPlayer
          audioRef={audioRef}
          setSmallScreen={setSmallScreen}
          smallScreen={smallScreen}
          setState={setState}
          state={state}
          playNext={playNext}
          getCurrentTime={getCurrentTime}
          togglePlay={togglePlay}
          toggleHeart={toggleHeart}
          handleVolume={handleVolume}
          handleTimeline={handleTimeline}
          getSongDuration={getSongDuration}
          handleLoop={handleLoop}
          playPrev={playPrev}
          handlePlay={handlePlay}
          handleShuffle={handleShuffle}
        />
        </MainContainer>
    </NowPlayingContext.Provider>
  );
}

export const usePlayingContext = (cb) => {
 let val =  useContext(NowPlayingContext);
 if(cb) val = cb(val);
 return val
}

export default NowPlaying;



const MainContainer = styled.div`
  position: absolute;
`
