import React from "react";
import styled from "styled-components";

import ProfileIcon from "../assets/Profile-Icon.svg";
import Thumb from "../assets/thumb-up.svg";
import Thanks from "../assets/thanks.svg";
import AlbumImg from "../assets/picture.png";
import ThanksGivingPopup from "../components/common/ThanksGivingPopup";

export default function FavoriteArtists() {
  return (
    <PageWrapper className="concert-wrapper">
      <ProfileHead>
        <div className="profile-icon d-flex align-item-center">
          <img className="" src={ProfileIcon} alt="Album Cover" />
        </div>
        <div className="head-title d-flex align-item-center">
          <img className="" src={Thumb} alt="Album Cover" />
          <h1>Favorite Artists</h1>
        </div>
      </ProfileHead>
      <FavoriteArtist>
        <ThanksGivingPopup/>
        <ArtistList>
          <Box>
            <img src={AlbumImg} alt="Album" />
            <p>Artist Name</p>
          </Box>
          <Box>
            <img src={AlbumImg} alt="Album" />
            <p>Artist Name</p>
          </Box>
          <Box>
            <img src={AlbumImg} alt="Album" />
            <p>Artist Name</p>
          </Box>
          <Box>
            <img src={AlbumImg} alt="Album" />
            <p>Artist Name</p>
          </Box>
          <Box>
            <img src={AlbumImg} alt="Album" />
            <p>Artist Name</p>
          </Box>
          <Box>
            <img src={AlbumImg} alt="Album" />
            <p>Artist Name</p>
          </Box>
          <Box>
            <img src={AlbumImg} alt="Album" />
            <p>Artist Name</p>
          </Box>
        </ArtistList>
      </FavoriteArtist>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  * {
    background-color: transparent;
  }
  .d-flex {
    display: flex;
  }
  .align-item-center {
    align-items: center;
  }
  .justify-between {
    justify-content: space-between;
  }
  .justify-end {
    justify-content: flex-end;
  }
`;

const ProfileHead = styled.div`
  background-color: #f1f4f8;
  padding: 30px;
  @media (max-width:991px){
    background-color: #bfbfbf;
  }
  @media (max-width: 575px) {
    padding: 15px;
  }
  .profile-icon {
    justify-content: flex-end;
    margin-bottom: 14px;
    img {
      cursor: pointer;
      width: 40px;
      height: 40px;
    }
  }
  .head-title {
    gap: 20px;
    h1 {
      @media (max-width: 575px) {
        font-size: 30px;
      }
    }
    img {
      height: 40px;
      width: 40px;
    }
  }
`;

const FavoriteArtist = styled.div`
  padding: 30px;
  @media (max-width: 575px) {
    padding: 15px;
  }
  .give-thanks {
    background-color: #687550;
    width: fit-content;
    border-radius: 50px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    cursor: pointer;
    margin: 0 0 0 auto;
  }
`;
const ArtistList = styled.div`
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  justify-content: center;
  @media (max-width: 1439px) {
    grid-template-columns: repeat(5, 1fr);
  }
  @media (max-width: 1240px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 575px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 380px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const Box = styled.div`
  text-align: center;
  max-width: 170px;
  margin: 0 auto;
  *{
    transition: all 0.5s;
  }
  img {
    height: 170px;
    width: 170px;
    object-fit: cover;
    border-radius: 50%;
    background-color: #f5f5f5;
    cursor: pointer;
    @media (max-width: 1070px) {
      height: 140px;
      width: 140px;
    }
    @media (max-width: 767px) {
      height: 100px;
      width: 100px;
    }
  }
  p {
    font-size: 18px;
    font-weight: 400;
    cursor: pointer;
    @media (max-width: 767px) {
      font-size: 14px;
    }
  }
`;
