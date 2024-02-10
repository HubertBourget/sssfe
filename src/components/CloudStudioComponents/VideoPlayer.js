import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

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
    font-size: 1em; // Set size as needed
    cursor: pointer;
    // Add more styles as needed
    `;

    const VideoPlayer = ({ videoUrl }) => {
    const navigate = useNavigate();

    return (
        <>
        <VideoPlayerHeader>
            <BackButton onClick={() => navigate(-1)} style={{color:'black'}}>Close</BackButton>
            {/* Add other header content here if necessary */}
        </VideoPlayerHeader>
        <div id="videoPlayerContainer" style={{display:'flex', justifyContent:'center'}}>
        <video width="80%" height="auto" controls>
            <source src={videoUrl} type="video/mp4" />
            <p>Your browser does not support HTML5 video. Here is a <a href={videoUrl}>link to the video</a> instead.</p>
        </video>
        </div>
        </>
    );
};

export default VideoPlayer;
