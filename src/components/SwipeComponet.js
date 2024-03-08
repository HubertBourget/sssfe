import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
import video from "../assets/footage.png";
import music from "../assets/music-file.png";
import SliderArrow from "../assets/slider-arrow.svg";
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import picture from '../assets/picture.png'
export default function SwipeComponet({ arr }) {
  let navigate = useNavigate();
  return (
    <Discography>
      <Swiper
        className="swiper-slider"
        spaceBetween={30}
        slidesPerView={4}
        modules={[Navigation]}
        navigation
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          575: {
            slidesPerView: 2,
          },
          992: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          },
        }}
      >
        {arr.map((content) => {
          let thumbnail =
            content?.selectedImageThumbnail?.length > 0
              ? content.selectedImageThumbnail
              : content.isOnlyAudio !== undefined ?
                (content.isOnlyAudio === true ? music : video): picture;
                const handleClick = () => {
                  if (content.contentType === 'album') {
                      navigate(`/main/album?id=${content._id}`);
                  } 
                  // else if (content.contentType === 'music' || content.contentType === 'video') {
                  //     play();
                  // }
              };
          return (
              <SwiperSlide key={content._id}>
                <div className="item" id="content-card" onClick={() => handleClick()} style={{ cursor: content.contentType === 'album' ? 'pointer' : 'default' }}>
                  <img src={thumbnail} alt="Disc Thumb"></img>
                  <div style={{marginLeft: 0}}>
                  <h1 className="slider-trackname">{content.title}</h1>
                  <h1 className="slider-artist">
                   
                    Artist -
                    <span
                      onClick={() =>
                        navigate(`/main/artist?id=${content.user._id}`)
                      }
                      style={{textDecoration: 'underline', cursor: 'pointer'}}
                    >
                      {content.user.accountName}
                    </span>
                  </h1>
                  </div>
                </div>
              </SwiperSlide>
          );
        })}
      </Swiper>
    </Discography>
  );
}

const Discography = styled.div`
  background: rgba(0,0,0,0.0);
  width: 100%;
  padding: 20px;
  .swiper-slider {
    background: rgba(0,0,0,0.0);
    margin: 20px 0;
    overflow: visible;
    @media (max-width: 991px) {
    }
    .item {
        
      background: rgba(0,0,0,0.0);
      h1 {
        font-weight: 400;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .slider-trackname {
        font-size: 16px;
      }
      .slider-artist {
        font-size: 14px;
      }
      img {
        width: 100%;
        text-align: center;
        height: 250px;
      }
    }
    .swiper-container {
      background: rgba(0,0,0,0.0);
      
      position: relative;
    }

    .swiper-button-prev,
    .swiper-button-next {
      position: absolute;
      top: -35px;
      right: 30px;
      width: 35px;
      height: 35px;
      background-color: #fff;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      @media (max-width: 575px) {
        top: -85px;
      }
      &::after {
        content: "";
        background-image: url(${SliderArrow});
        background-size: contain;
        height: 35px;
        width: 35px;
        background-repeat: no-repeat;
      }
    }

    // .swiper-button-next {
    //   right: 0px;
    // }

    .swiper-button-prev {
      right: 80px;
      left: auto;
      &::after {
        transform: rotate(180deg);
      }
    }
  }
`;