import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ContentCard from "../components/lirbary/ContentCard";
import axios from "axios";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import SwipeComponet from "../components/SwipeComponet";

export default function Library() {
  // const { user, isAuthenticated } = useAuth0();
  // const isAuthenticated = true;
  const user = { name: "debug9@debug.com" };
  const [filter, setFilter] = useState("all");
  const [contents, setContents] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [events, setEvents] = useState([]);
  const fetchRecommendations = async () => {
    try {
      if (user) {
        const recoResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/getItemToUserRecommendations/${user.name}`
        );
        const videoIds = recoResponse.data.recomms.map((recomm) => recomm.id);
        const list = [];
        await Promise.allSettled(
          videoIds.map(async (id) => {
            const videoResp = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/api/getVideoMetadata/${id}`
            );
            const videoData = videoResp.data;
            if (videoData) {
              list.push({
                ...videoData,
              });
            }
          })
        );

        setRecommendations(list);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchData = async (type, setState) => {
    try {
      let url = `${process.env.REACT_APP_API_BASE_URL}/api/getAllContent?type=${type}`;

      const response = await axios.get(url);
      if (response.status === 200) {
        setState(response.data);
      } else {
        console.error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }
  };

  const fetchEvents = async (type, setState) => {
    try {
      let url = `${process.env.REACT_APP_API_BASE_URL}/api/getEvents/all`;

      const response = await axios.get(url);
      if (response.status === 200) {

        setEvents(response.data.events);
      } else {
        console.error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }
  };

  useEffect(() => {
    if (filter === "audio") {
      fetchData(filter, setContents);
    } else if (filter === "video") {
      fetchData(filter, setContents);
    } else if (filter === "all") {
      fetchData(filter, setAllContent);
      fetchRecommendations();
      fetchEvents();
    }
  }, [filter]);
  return (
    <MainContainer>
      <CoverSection>
        <ButtonTabs>
          <button
            onClick={() => setFilter("all")}
            style={{
              backgroundColor: filter === "all" ? "#687550" : "#434289",
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter("audio")}
            style={{
              backgroundColor: filter === "audio" ? "#687550" : "#434289",
            }}
          >
            Music
          </button>
          <button
            onClick={() => setFilter("video")}
            style={{
              backgroundColor: filter === "video" ? "#687550" : "#434289",
            }}
          >
            Video
          </button>
        </ButtonTabs>
      </CoverSection>
      <Main>
        {filter !== "all" ? (
          <SwipeComponet arr={contents}></SwipeComponet>
        ) : (
          <>
          <h2 style={{marginLeft: '2%', marginBottom: '-10px', marginTop: '40px'}}>Recommendation</h2>
            <SwipeComponet arr={recommendations}></SwipeComponet>

            <h2 style={{marginLeft: '2%'}}>All Contents</h2>
            <SwipeComponet arr={allContent}></SwipeComponet>
            <h2 style={{marginLeft: '2%'}}>Events</h2>
            <SwipeComponet arr={events}></SwipeComponet>        
          </>
        )}
      </Main>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0; 
  padding: 0;
`;


const CoverSection = styled.div`
  width: 100%;
  height: 450px;
  background-color: #d9d9d9;
`;

const ButtonTabs = styled.div`
  display: flex;
  height: 100%;
  background-color: #d9d9d9;
  flex-direction: row;
  margin-left: 2%;
  align-items: center;
  button {
    height: 50px;
    margin-right: 10px;
  }
`;

const Main = styled.div`
  margin-top: -200px;
  background: rgba(0,0,0,0.0);
`