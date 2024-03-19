import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import HomePage from './pageComponents/HomePage';
import ArtistProfilePage from './pageComponents/ArtistProfilePage';
import AccountNameSelection from './pageComponents/ArtistAccountNameSelectionPage';
import NewCloudStudio from './pageComponents/NewCloudStudio';
import { GlobalStyle } from './components/GlobalStyle';
import ModifySingleTrackComponent from './components/CloudStudioComponents/ModifySingleTrackComponent';
import ArtistLandingPage from './pageComponents/ArtistLandingPage';
import VideoPlayer from './components/CloudStudioComponents/VideoPlayer';
import ModifyAlbum from './components/CloudStudioComponents/ModifyAlbum';
import NowPlaying from './pageComponents/NowPlaying';
import Search from './components/CloudStudioComponents/Search';
import Library from './pageComponents/Library';
import SidebarComponent from './components/SidebarComponent';
import Artist from './pageComponents/Artist';
import TrackPage from './pageComponents/Track';
import Album from './pageComponents/Album';
import Concert from './pageComponents/Concert';
import PlayScreen from './pageComponents/PlayScreen';

const App = () => {
  const { isLoading, error } = useAuth0();
  return (
    <>
      <BrowserRouter>
        <GlobalStyle></GlobalStyle>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/profile/:artistId" element={<ArtistProfilePage />} />
          <Route exact path="/prepareForQA/:videoId" element={<ModifySingleTrackComponent />} />
          <Route exact path="/studio" element={<NewCloudStudio />} />
          <Route exact path="/create" element={<ArtistLandingPage />} />
          <Route exact path="/AccountNameSelection" element={<AccountNameSelection />} />
          <Route exact path="/play/:videoId" element={<VideoPlayer />} />
          <Route exact path="/ModifyAlbum/:albumId" element={<ModifyAlbum />} />
          <Route exact path="/play-screen" element={<PlayScreen />} />
          <Route exact path="/search/:searchQuery" element={<Search/>}/>
          <Route exact path="/" element={<NowPlaying/>}>
            <Route exact path="/main" element={<SidebarComponent/>}>
              <Route exact path="library" element={<Library/>}/>
              <Route exact path="artist" element={<Artist/>}/>
              <Route exact path="track" element={<TrackPage/>}/>
              <Route exact path="album" element={<Album/>}/>
              <Route exact path="concert" element={<Concert/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>

  );
}

export default App;