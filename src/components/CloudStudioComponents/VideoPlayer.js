import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const VideoPlayerHeader = styled.div`
    width: 100%;
    height: 12vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px; // Adjust padding as needed
    box-sizing: border-box;
    `;

    const BackButton = styled.button`
    background: transparent;
    border: none;
    color: #fff; // Set the color as needed
    font-size: 18px; // Set size as needed
    cursor: pointer;
    // Add more styles as needed
    `;

    const VideoPlayer = () => {
        const { videoId } = useParams();
        const [videoData, setVideoData] = useState(null);
        const navigate = useNavigate();

        useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/getVideoMetadata/${videoId}`);
                setVideoData(response.data);
            } catch (error) {
                console.error('Error fetching video data:', error);
            }
        };

        if (videoId) {
            fetchVideoData();
        }
    }, [videoId]);

    if (!videoData) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <VideoPlayerHeader>
            <BackButton onClick={() => navigate(-1)} style={{color:'black'}}>Close</BackButton>
        </VideoPlayerHeader>
        <div id="videoPlayerContainer" style={{display:'flex', justifyContent:'center'}}>
        <video width="80%" height="auto" controls>
            <source src={videoData.fileUrl} type="video/mp4" />
            <p>Your browser does not support HTML5 video. Here is a <a href={videoData.fileUrl}>link to the video</a> instead.</p>
        </video>
        </div>
        </>
    );
};

export default VideoPlayer;
