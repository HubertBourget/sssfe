import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DefaultImageThumbnailImage from '../../assets/DefautlImageThumbnail.png';
import ContentCard from './ContentCard';

const Dashboard = ({ user }) => {
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                if (user) {
                    console.log('user :', user);
                    const recoResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/getItemToUserRecommendations/${user}`);
                    console.log("recoResponse: ", recoResponse )
                    const objectIds = recoResponse.data.recomms.map(recomm => recomm.id);
                    console.log("objectIds: ", objectIds);

                    const videosData = await Promise.all(objectIds.map(async (id) => {
                        const videoResp = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/getVideoMetaDataFromObjectId/${id}`);
                        const videoData = videoResp.data;
                        console.log("videoData: ", videoData);

                        const userResp = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/getUserProfile/${videoData.owner}`);
                        const userData = userResp.data;

                        return {
                            ...videoData,
                            accountName: userData.accountName // Assume this field exists in your user response
                        };
                    }));

                    setVideos(videosData);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchRecommendations();
    }, [user]);

    const handleCardClick = (videoId) => {
        navigate(`/play/${videoId}`);
    };

    return (
    <Container>
        <h1 style={{ marginBottom: '10vh' }}>Dashboard</h1>
        <h2 style={{ marginBottom: '3vh', fontWeight:'400' }}>Latest Content</h2>
        <CardsScrollContainer>
            {videos.map((video, index) => (
                <Card 
                    key={index}
                    onClick={() => handleCardClick(video.videoId)}
                >
                    <ContentCard 
                        imageThumbnailUrl={video.selectedImageThumbnail || DefaultImageThumbnailImage} 
                        title={video.title} 
                        artistName={video.accountName} 
                    />
                </Card>
            ))}
        </CardsScrollContainer>
    </Container>
);

};

export default Dashboard;

const Container = styled.div`
    padding: 3%;
    // Rest of your Container styles...
`;

const CardsScrollContainer = styled.div`
    display: flex;
    overflow-x: auto; // Enable horizontal scrolling
    gap: 20px; // Space between cards, adjust as needed
    padding-bottom: 20px; // Adds padding to the bottom

    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;


const Card = styled.div`
    min-width: calc(29.5%); // Subtract the total horizontal gap from the width
    background-color: 'transparent'; // Sets card background to white
    padding-left: 20px;
    padding-top: 80px;
    padding-bottom: 20px;
    margin-bottom: 1vw; // Adjust margin as necessary
    border-radius: 8px; // Rounds the corners of the cards
    // Ensure there is no additional margin on the sides of the cards
`;

const TrackName = styled.h3`
    // Your TrackName styles...
`;

const ArtistName = styled.p`
    // Your ArtistName styles...
`;



//For default cards use this :
// background-image: url(${DefaultImageThumbnailImage});