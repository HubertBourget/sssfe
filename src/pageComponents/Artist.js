import React from 'react'
import styled from "styled-components";
import artistCover from '../assets/artist-cover.png'
export default function Artist() {
  return (
    <MainContainer>
      <HeadPart>
        <CoverImage>
          <img src={artistCover} alt='not loaded'></img>
        </CoverImage>
        <ProfileImage>
          <img src={artistCover} alt='not loaded'></img>
          <p>artist name</p>
        </ProfileImage>
      </HeadPart>
    
  </MainContainer>
  )
}

const HeadPart = styled.div`
  position: relative
`

const MainContainer = styled.div`
  height: 100vh; 
  margin: 0; 
  padding: 0; 
`;

const CoverImage = styled.div`
  img{
    width: 100%;
    height: 400px;
  }
`

const ProfileImage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  bottom: 20px;
  left: 20px;
  img{
    width: 10%;
    height: 200px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 10px;
  }
`
