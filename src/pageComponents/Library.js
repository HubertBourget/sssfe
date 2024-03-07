import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ContentCard from "../components/lirbary/ContentCard";
import axios from "axios";

export default function Library() {
  const [filter, setFilter] = useState("audio");
  const [contents, setContents] = useState([]);
  const fetchData = async (type) => {
    try {
      setFilter(type)
      const artistId = 'debug9@debug.com'
      const encodedArtistId = encodeURIComponent(artistId);
      console.log(encodedArtistId);
      let url = `${process.env.REACT_APP_API_BASE_URL}/api/getAllContent?type=${type}`;

      const response = await axios.get(url);

      if (response.status === 200) {
      
        setContents(response.data);
      } else {
        console.error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }
  };

  useEffect(() => {
    fetchData('audio')
  }, [])
  return (
    <MainContainer2>
      <CoverSection>
        <ButtonTabs>
          <button onClick={() => fetchData('audio')} style={{backgroundColor: filter === 'audio' ? '#687550' : '#434289'}}>Musics</button>
          <button onClick={() => fetchData('video')} style={{backgroundColor: filter === 'video' ? '#687550' : '#434289'}}>Videos</button>
          {/* <button onClick={() => fetchData('albums')} style={{backgroundColor: filter === 'video' ? '#687550' : '#434289'}}>Videos</button> */}
        </ButtonTabs>
      </CoverSection>
      <Content>
      {contents.map((content) => {
          return <ContentCard content={content} key={content._id} />
        })}
      </Content>
    </MainContainer2>
  );
}

const MainContainer2 = styled.div`
  height: 100vh; /* Set height to 100% of viewport height */
  margin: 0; /* Reset default margin */
  padding: 0; /* Reset default padding */
`;

const CoverSection = styled.div`
  width: 100%;
  height: 300px;
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

const Content = styled.div`
  width: 100%;
  margin: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
