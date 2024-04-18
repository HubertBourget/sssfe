import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth0 } from '@auth0/auth0-react';
import axios from "axios";
import SwipeComponet from "../components/SwipeComponet";
import { useOutletContext } from 'react-router-dom';
export default function Library() {
  const { user, isAuthenticated } = useAuth0();
  // const isAuthenticated = true;
  // const user ={ name: "debug9@debug.com" }

  const context = useOutletContext();
  const { isSearched, result } = context;
  // useEffect(() => {
  //   console.log(result)
  // }, [isSearched, result])
  // const user = { name: "debug9@debug.com" };
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
              `${process.env.REACT_APP_API_BASE_URL}/api/getVideoMetaDataFromObjectId/${id}`
            );
            const videoData = videoResp.data;
            if (videoData) {
              list.push({
                ...videoData, contentType: 'recommendation',
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
        if(type !== 'all'){
          response.data = response.data.map((element) => ({...element, contentType: type}))
        }else{
          response.data = response.data.map((element) => {
            if(element.isOnlyAudio){
              return {...element, contentType: 'audio'}
            }else{
              return {...element, contentType: 'video'}
            }
          })
        }
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
        response.data.events = response.data.events.map((content) => ({...content, contentType:'event'}))
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
        {!isSearched ? <>
        {filter !== "all" ? (
          <SwipeComponet arr={contents}></SwipeComponet>
        ) : (
          <>
          <h2 style={{marginLeft: '2%', marginBottom: '-10px'}}>Recommendation</h2>
            <SwipeComponet arr={recommendations}></SwipeComponet>

            <h2 style={{marginLeft: '2%', marginBottom: '-10px'}}>All Contents</h2>
            <SwipeComponet arr={allContent}></SwipeComponet>
            <h2 style={{marginLeft: '2%', marginBottom: '-10px'}}>Events</h2>
            <SwipeComponet arr={events}></SwipeComponet>        
          </>
        )
        }</>: <>
           <h2 style={{marginLeft: '1%', marginBottom: '-10px'}}>Tracks</h2>
            <SwipeComponet arr={result.tracks}></SwipeComponet>

            <h2 style={{marginLeft: '1%', marginBottom: '-10px'}}>Artists</h2>
            <SwipeComponet arr={result.artists}></SwipeComponet>

            <h2 style={{marginLeft: '1%', marginBottom: '-10px'}}>Albums</h2>
            <SwipeComponet arr={result.albums}></SwipeComponet>
        </>}
        
      </Main>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0; 
  padding: 0;
  height: 90vh;
  @media (max-width: 1000px) {
    height: 80vh;
  }
`;


const CoverSection = styled.div`
  width: 100%;
  height: 350px;
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
  // margin-top: -200px;
  background-color: rgba(0,0,0,0.0);
`