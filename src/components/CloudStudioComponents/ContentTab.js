import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import EditIcon from '../../assets/EditIcon.png';
import TrashIcon from '../../assets/TrashIcon.png';

const ContentTab = ({user}) => {
    const artistId = user;
    const [contentDocuments, setContentDocuments] = useState([]);
    const [artistName, setArtistName] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchContentByArtist = async () => {
            try {
                const encodedArtistId = encodeURIComponent(artistId);
                const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/getContentByArtist?artistId=${encodedArtistId}`);
                if (response.status === 200) {
                    const fetchedContentDocuments = response.data;
                    setContentDocuments(fetchedContentDocuments);
                } else {
                    console.error(`Request failed with status: ${response.status}`);
                }
            } catch (error) {
                console.error(`An error occurred: ${error}`);
            }
        };

        // Call the function to fetch content by artist when the component mounts
        fetchContentByArtist();
    }, [artistId]); // Make sure to include artistId in the dependencies array

    useEffect(() => {
        const fetchArtistName = async () => {
            try {
                const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/getUserProfile/${artistId}`, {
                    params: { userEmail: user }
                });
                if (response.status === 200) {
                    setArtistName(response.data.accountName); // Set the artist name here
                } else {
                    console.error(`Request failed with status: ${response.status}`);
                }
            } catch (error) {
                console.error(`An error occurred: ${error}`);
                setArtistName(''); // Set to default if there is an error
            }
        };

        if (user) { // Only fetch if user is not null/undefined
            fetchArtistName();
        }
    }, [user]); // Depend on user prop


    const handleModify = (videoId) => {
        // Handle modify action for the specified videoId
        // You can navigate to the PrepareForQA page with the videoId
        navigate(`/prepareForQA/${videoId}`);
    };


    const handleDelete = async (videoId, artistId) => {
        try {
            // Include the user ID in the request data or headers
            const response = await Axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/deleteContent?videoId=${videoId}`, {
                headers: {
                    'user-id': artistId, // Send the user ID as a custom header
                },
            });

            if (response.status === 200) {
                // Delete was successful, you can update the UI accordingly
                console.log(`Deleted video with ID: ${videoId}`);
                
                // Now, you can update the contentDocuments state to reflect the changes
                // For example, you can filter out the deleted video from the state
                setContentDocuments((prevContentDocuments) =>
                    prevContentDocuments.filter((contentDocument) => contentDocument.videoId !== videoId)
                );
            } else {
                console.error(`Request failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error(`An error occurred: ${error}`);
        }
    };

    const getStatus = (content) => {
        if (content.b_isApproved) {
        return 'Published';
        } else if (content.b_hasBeenReviewed) {
        return 'Currently being reviewed';
        } else if (content.b_isPreparedForReview) {
        return 'Awaiting feedback';
        }
        return 'Not started';
    };


return (
    <>
        <div style={{ marginTop: '5vw' }}> {/* Adjusted from 5% to 5vw */}
            {/* Check if contentDocuments is defined before mapping */}
            {contentDocuments && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-around', 
                    alignItems: 'center', 
                    fontWeight: 'bold',
                    marginBottom: '2vw'  // Adjusted for spacing
                }}>
                    <span style={{ width: '20vw' }}></span> 
                    <span style={{ width: '20vw' }}>Track</span>
                    <span style={{ width: '20vw' }}>Status</span>
                </div>
            )}
            {/* Render contentDocument details */}
            {contentDocuments &&
                contentDocuments.map((contentDocument) => (
                    <div
                        key={contentDocument.videoId}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '0.1vw solid #ccc', // Use vw for border
                            padding: '1vw 0', // Use vw for padding
                            margin: '1vw 0', // Use vw for margin
                        }}
                    >
                        {/* ... */}
                        <TrackInfo>
                            <TrackName>{contentDocument.title}</TrackName>
                            {contentDocument.title && <ArtistName>{artistName}</ArtistName>}
                        </TrackInfo>
                        {/* ... */}
                        <span style={{ width: '30vw' }}>{getStatus(contentDocument)}</span> {/* Adjusted width */}
                        {/* Render action buttons */}
                        <span style={{ width: '10vw' }}> {/* Adjusted width */}
                            <TransparentButton onClick={() => handleModify(contentDocument.videoId)}>
                                <img src={EditIcon} alt="Edit" style={{ width: '2vw', height: '2vw' }} /> {/* Use vw for image size */}
                            </TransparentButton>
                        </span>
                        <span style={{ width: '10vw' }}> {/* Adjusted width */}
                            <TransparentButton onClick={() => handleDelete(contentDocument.videoId, artistId)}>
                                <img src={TrashIcon} alt="Delete" style={{ width: '2vw', height: '2vw' }} /> {/* Use vw for image size */}
                            </TransparentButton>
                        </span>
                    </div>
                ))
            }
        </div>
    </>
);
}

export default ContentTab;

const TrackInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 20vw; // Adjusted from 10vw
    margin-left: 2vw; // Use vw for margin
`;

const TrackName = styled.span`
    font-size: 2.4vw; // Adjusted from 24px to viewport relative units
    color: #434289; // Your primary color
`;

const ArtistName = styled.span`
    font-size: 1.6vw; // Adjusted from 16px to viewport relative units
    color: #434289; // You can use a slightly different color if needed
`;

const TransparentButton = styled.button`
    background-color: transparent;
    border: none;
    box-shadow: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
`;


//Archives:
{/* The old Render content type */}
{/* <span style={{ width: '60px', marginLeft:'3vw' }}>
    {contentDocument.isOnlyAudio ? (
        <FontAwesomeIcon icon={faMusic} />
    ) : (
        <FontAwesomeIcon icon={faFilm} />
    )}
</span> */}