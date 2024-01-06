import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

//Clean the console.log() once finished.
const Dashboard = ({user}) => {
    const [recombeeDataResponse, setRecombeeDataResponse] = useState("");
    console.log(`${process.env.REACT_APP_API_BASE_URL}/api/getRecommendations/${user}`)
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                if (user) { // Check if user and user.name are defined
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_BASE_URL}/api/getRecommendations/${user}`
                    );
                    setRecombeeDataResponse(response.data || "");
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchRecommendations();
    }, [user]);

    useEffect(() => {
        // console.log("recombeeDataResponse after render:", recombeeDataResponse);
    }, [recombeeDataResponse]);

    return (
        <h1>Dashboard</h1>
    );
};

export default Dashboard;
