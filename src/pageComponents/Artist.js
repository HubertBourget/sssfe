import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "swiper/css";
import "swiper/css/navigation";
import Share from "../assets/share-android.svg";
import PersonAdd from "../assets/person-add-outline.svg";
import Play from "../assets/playicon.svg";
import Shuffle from "../assets/Shuffle-blue.svg";
import Thanks from "../assets/thanks.svg";
import Thumb from "../assets/playlist.jpg";
import TrackLike from "../assets/track-like.svg";
import axios from "axios";
import SwipeComponet from "../components/SwipeComponet";
import SwipeEventComponet from "../components/lirbary/SwipeEventComponet";
import BackButton from "../components/common/BackButton";
import PlayButton from "../components/common/PlayButton";

export default function Artist() {
  const [artist, setArtist] = useState({});
  // const navigate = useNavigate()
  const [featured, setFeatured] = useState([]);
  const [tab, setTab] = useState(0);
  const [contents, setContent] = useState([]);
  const [events, setEvents] = useState([]);
  async function fetchArtist() {
    const queryParams = new URLSearchParams(window.location.search);
    const artistId = queryParams.get("id");
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/getUserProfileById/${artistId}`
    );
    setArtist(response.data);
  }
  useEffect(() => {
    fetchArtist();
  }, []);
  useEffect(() => {
    fetchEvents();
    fetchFeatured();
  }, [artist]);
  useEffect(() => {
    fetchContent();
  }, [tab, artist]);

  const fetchContent = async () => {
    try {
      let type;
      if (tab === 1) type = "video";
      else if (tab === 2) type = "audio";
      else if (tab === 0) type = "album";
      if (tab !== 0) {
        let url = `${process.env.REACT_APP_API_BASE_URL}/api/getAllContent?type=${type}`;

        const response = await axios.get(url);
        if (response.status === 200) {
          response.data = response.data.map((ele) => {return {...ele, contentType: type}});
          setContent(response.data);
        } else {
          console.error(`Request failed with status: ${response.status}`);
        }
      } else {
        let url = `${process.env.REACT_APP_API_BASE_URL}/api/getAlbumsByArtist?artistId=${artist.email}`;

        const response = await axios.get(url);
        response.data = response.data.map((ele) => {return {...ele, contentType: type}});
        if (response.status === 200) {
          setContent(response.data);
        } else {
          console.error(`Request failed with status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }
  };
  const fetchFeatured = async () => {
    try {
      let url = `${process.env.REACT_APP_API_BASE_URL}/api/getFeaturedByArtist?artistId=${artist.email}`;

      const response = await axios.get(url);
      if (response.status === 200) {
        console.log(response.data);
        setFeatured(response.data)
      } else {
        console.error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }
  };

  const fetchEvents = async () => {
    try {
      let url = `${process.env.REACT_APP_API_BASE_URL}/api/getEvents/${artist._id}`;

      const response = await axios.get(url);
      if (response.status === 200) {
        console.log(response.data);
        setEvents(response.data.events);
      } else {
        console.error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }
  };

  return (
    <MainContainer>
      <HeadPart>
       <BackButton/>
        <CoverImage>
          <img src={artist.bannerImageUrl} alt="not loaded"></img>
        </CoverImage>
        <HeadProfile>
          <ProfileImage>
            <img src={artist.profileImageUrl} alt="not loaded"></img>
            <div className="artist-info">
              <span>Artist</span>
              <h3>{artist.artistTitle}</h3>
              <span># Followers</span>
            </div>
          </ProfileImage>
          <HeadAction>
            <img src={PersonAdd} alt="not loaded"></img>
            <img src={Share} alt="not loaded"></img>
          </HeadAction>
        </HeadProfile>
      </HeadPart>

      <MusicInfo>
        <div>
          <h5 className="music-disc">{artist.bio}</h5>
        </div>
        <div className="music-play">
          <div className="music-icons">
            <div className="play">
              <img className="album-cover" src={Play} alt="Album Cover" />
            </div>
            {/* <div className="pause">
            <img className="album-cover" src={Pause} alt="Album Cover" />
          </div> */}
            <div className="repeat-play">
              <img className="album-cover" src={Shuffle} alt="Album Cover" />
            </div>
          </div>
          <div className="give-thanks">
            <img className="album-cover" src={Thanks} alt="Album Cover" />
            Give Thanks
          </div>
        </div>
      </MusicInfo>

      <FeaturedTracks>
        <HeadingText>
          <h1>Featured tracks</h1>
        </HeadingText>
        {featured.map((element, index) => (
          <div className="track-bar active" key={element._id}>
            <div className="track-left">
              <div className="icon-number">
                {/* <img src={Play} className="track-icon" alt="track-icon"></img> */}
                <PlayButton track={{id: element._id, songUrl: element.fileUrl,
                                  songTitle: element.title,
                                  isVideo: false,
                                  artistName: element.user.accountName,
                                  img: element.selectedImageThumbnail}} />
                {/* <h5>{index + 1}</h5> */}
              </div>
              <img
                className="track-thumb"
                src={
                  element.selectedImageThumbnail
                    ? element.selectedImageThumbnail
                    : Thumb
                }
                alt="track-thumb"
              ></img>
              <div className="flex-line">
                <h5 className="track-title">{element.title}</h5>
                <h5 className="album-title">Album title</h5>
              </div>
            </div>
            <div className="track-right">
              <h5 className="track-time">02:36</h5>
              <img src={TrackLike} alt="track-like"></img>
            </div>
          </div>
        ))}
      </FeaturedTracks>
      <HeadingText>
        <h1>Discography</h1>
      </HeadingText>
      <Tabs>
        <button
          className={`btn btn-tab ${tab === 0 ? "active" : ""}`}
          onClick={() => setTab(0)}
        >
          Albums
        </button>
        <button
          className={`btn btn-tab ${tab === 1 ? "active" : ""}`}
          onClick={() => setTab(1)}
        >
          Videos
        </button>
        <button
          className={`btn btn-tab ${tab === 2 ? "active" : ""}`}
          onClick={() => setTab(2)}
        >
          Audio
        </button>
      </Tabs>
      <SwipeComponet arr={contents}></SwipeComponet>

      <HeadingText>
        <h1>Upcoming Events</h1>
      </HeadingText>
      <Events>
        <SwipeEventComponet arr={events} />
      </Events>
    </MainContainer>
  );
}

const Events = styled.div``;
const MainContainer = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
  height: 90vh;
  @media (max-width: 1000px) {
    height: 80vh;
  }
`;
const HeadPart = styled.div`
  position: relative;
  * {
    background-color: transparent;
  }
`;

const BackIcon = styled.div`
  position: absolute;
  z-index: 9;
  padding: 15px;
  margin: 30px 10px 10px;
  cursor: pointer;
  @media (max-width: 991px) {
    top: 20px;
  }
`;

const CoverImage = styled.div`
  position: relative;
  z-index: 2;
  height: 400px;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    height: 99%;
    width: 100%;
    background-color: #00000061;
    overflow: hidden;
    z-index: 1;
  }
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    @media (max-width: 767px) {
      height: 270px;
    }
  }
`;

const HeadProfile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 35px;
  z-index: 2;
  @media (max-width: 767px) {
    position: relative;
    bottom: 0;
    display: block;
  }
  * {
    color: #fff;
    @media (max-width: 767px) {
      color: #434289;
    }
  }
`;

const ProfileImage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  h3 {
    margin: 0;
    font-weight: 400;
    font-size: 48px;
    @media (max-width: 575px) {
      font-size: 27px;
    }
  }
  img {
    width: 175px;
    height: 175px;
    object-fit: cover;
    border-radius: 50%;
    @media (max-width: 767px) {
      position: absolute;
      top: -190px;
      left: 50%;
      transform: translateX(-50%);
      width: 105px;
      height: 105px;
    }
  }
  .artist-info {
    @media (max-width: 767px) {
      text-align: center;
      width: 100%;
      margin-top: 25px;
    }
  }
`;

const HeadAction = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  @media (max-width: 991px) {
    position: absolute;
    right: 20px;
    top: -170px;
  }
  @media (max-width: 767px) {
    top: -255px;
  }
  img {
    cursor: pointer;
    @media (max-width: 767px) {
      width: 24px;
    }
  }
`;

const MusicInfo = styled.div`
  display: flex;
  gap: 15px;
  padding: 20px;
  margin-top: 15px;
  @media (max-width: 767px) {
    flex-direction: column;
  }
  > div:first-child {
    width: 50%;
    padding-right: 25px;
    @media (max-width: 767px) {
      width: 100%;
      padding-right: 0px;
    }
  }
  .music-disc {
    font-size: 18px;
    font-weight: 300;
    margin: 0;
    @media (max-width: 575px) {
      font-size: 14px;
    }
  }
  .music-play {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 50%;
    @media (max-width: 767px) {
      width: 100%;
      justify-content: center;
      gap: 20px;
    }
    .music-icons {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .pause,
    .play {
      background-color: #434289;
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
      }
    }
    .repeat-play {
      img {
        width: 40px;
        @media (max-width: 991px) {
          width: 22px;
        }
      }
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
    }
  }
`;

const HeadingText = styled.div`
  h1 {
    margin-left: 2%;
    font-size: 24px;
    font-weight: 400;
  }
`;

const FeaturedTracks = styled.div`
  padding: 20px;
  .track-bar {
    padding: 10px;
    display: flex;
    border-bottom: 1px solid #d9d9d9;
    &:hover,
    &.active {
      background-color: #f5f5f5;
    }
    * {
      font-weight: 400;
      font-size: 16px;
      background-color: transparent;
    }
    h5 {
      margin: 0;
    }
    .track-left {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      .icon-number {
        min-width: 20px;
      }
      .track-icon {
        width: 20px;
        cursor: pointer;
        filter: invert(27%) sepia(69%) saturate(6315%) hue-rotate(211deg)
          brightness(56%) contrast(86%);
      }
      .track-thumb {
        width: 50px;
        height: 50px;
        object-fit: cover;
      }
      .flex-line {
        display: flex;
        flex: 1;
        @media (max-width: 767px) {
          flex-direction: column;
        }
      }
      .track-title,
      .album-title {
        width: 50%;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        @media (max-width: 767px) {
          width: 100%;
        }
      }
    }
    .track-right {
      display: flex;
      align-items: center;
      gap: 40px;
      @media (max-width: 767px) {
        gap: 20px;
      }
      img {
        cursor: pointer;
      }
    }
  }
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 0;
  margin-left: 2%;
  @media (max-width: 575px) {
    gap: 10px;
    justify-content: space-between;
  }
  .btn-tab {
    height: 40px;
    background-color: #d9d9d9;
    color: #434289;
    transition: all 0.5s ease;
    @media (max-width: 575px) {
      padding: 10px 18px;
    }
    &:hover,
    &.active {
      background-color: #434289;
      color: #fff;
    }
  }
`;
