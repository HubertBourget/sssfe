import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Dashboard = ({user}) => {
    const [recombeeDataResponse, setRecombeeDataResponse] = useState("");
    // console.log(`${process.env.REACT_APP_API_BASE_URL}/api/getRecommendations/${user}`)

    //Suspending recommendastion useEffect for now:
    // useEffect(() => {
    //     const fetchRecommendations = async () => {
    //         try {
    //             if (user) { // Check if user and user.name are defined
    //                 const response = await axios.get(
    //                     `${process.env.REACT_APP_API_BASE_URL}/api/getRecommendations/${user}`
    //                 );
    //                 setRecombeeDataResponse(response.data || "");
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     fetchRecommendations();
    // }, [user]);

    // useEffect(() => {
    //     // console.log("recombeeDataResponse after render:", recombeeDataResponse);
    // }, [recombeeDataResponse]);

    const mockData = [
        { trackName: "Track 1", artistName: "Artist A" },
        { trackName: "Track 2", artistName: "Artist B" },
        { trackName: "Track 3", artistName: "Artist C" },
        { trackName: "Track 4", artistName: "Artist D" },
        { trackName: "Track 5", artistName: "Artist E" },
        { trackName: "Track 6", artistName: "Artist F" }
    ];


return (
        <Container>
            <h1 style={{ marginLeft: '3vw' }}>Dashboard</h1>
            <CardContainer>
                {mockData.map((item, index) => (
                    <Card key={index}>
                        <TrackName>{item.trackName}</TrackName>
                        <ArtistName>{item.artistName}</ArtistName>
                    </Card>
                ))}
            </CardContainer>
        </Container>
    );
};

export default Dashboard;

const Container = styled.div`
    padding: 20px;
    // Rest of your Container styles...
`;

const CardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between; // This will evenly space the cards in the row
    /* gap: 1vw; // Adjust this gap if necessary */
    // Make sure there's no additional padding or margin reducing the available space
`;

const Card = styled.div`
    width: calc(29.5%); // Subtract the total horizontal gap from the width
    background-color: #f0f0f0; // Sets card background to white
    padding-left: 20px;
    padding-top: 80px;
    padding-bottom: 20px;
    margin-bottom: 1vw; // Adjust margin as necessary
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Adds a subtle shadow to the cards
    border-radius: 8px; // Rounds the corners of the cards
    // Ensure there is no additional margin on the sides of the cards
`;

const TrackName = styled.h3`
    // Your TrackName styles...
`;

const ArtistName = styled.p`
    // Your ArtistName styles...
`;