import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import FileUploadPage from './pageComponents/FileUploadPage';
import HomePage from './pageComponents/HomePage';
import ArtistProfilePage from './pageComponents/ArtistProfilePage';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import ProfileTest from './components/ProfileTest';
import PrepareForQAPage from './pageComponents/PrepareForQAPage';
import EditProfilePage from './pageComponents/EditProfilePage';
import CloudStudioPage from './pageComponents/CloudStudioPage';
import ArtistCreatePage from './pageComponents/ArtistCreatePage';
import TestPage from './pageComponents/TestPage'

const App = () => {
  const { isLoading, error } = useAuth0();
  return (
    <BrowserRouter>
    {/* {error && <p>Authentication Error</p>}
      {!error && isLoading && <p>Loading...</p>}
      {!error && !isLoading && (
        <>
          <LoginButton />
          <LogoutButton />
          <ProfileTest />
        </>
      )} */}
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile/:artistId" element={<ArtistProfilePage />} />
        <Route exact path="/upload" element={<FileUploadPage/>} />
        <Route exact path="/prepareForQA/:videoId" element={<PrepareForQAPage/>}/>
        <Route exact path="/editProfile/:userId" element={<EditProfilePage/>}/>
        <Route exact path="/studio" element={<CloudStudioPage/>}/>
        <Route exact path="/create" element={<ArtistCreatePage/>}/>
        <Route exact path="/test" element={<TestPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;