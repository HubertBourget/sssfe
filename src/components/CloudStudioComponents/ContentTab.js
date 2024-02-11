import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import EditIcon from '../../assets/EditIcon.png';
import TrashIcon from '../../assets/TrashIcon.png';
import axios from 'axios';

const ContentTab = ({user}) => {
    const artistId = user;
    const [contentDocuments, setContentDocuments] = useState([]);
    const [artistName, setArtistName] = useState('');
    const [filter, setFilter] = useState('audio'); // Default view is audio
    const navigate = useNavigate();

    
    useEffect(() => {
    const fetchData = async () => {
        try {
            const encodedArtistId = encodeURIComponent(artistId);
            let url = `${process.env.REACT_APP_API_BASE_URL}/api/getContentByArtist?artistId=${encodedArtistId}`;
            
            // If the filter is set to 'album', change the URL to fetch albums instead
            if (filter === 'album') {
                url = `${process.env.REACT_APP_API_BASE_URL}/api/getAlbumsByArtist?artistId=${encodedArtistId}`;
            }

            const response = await Axios.get(url);
            if (response.status === 200) {
                setContentDocuments(response.data);
            } else {
                console.error(`Request failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error(`An error occurred: ${error}`);
        }
    };

    fetchData();
}, [artistId, filter]);

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

    const handleDeleteAlbum = async (albumId, artistId) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/deleteAlbum/${albumId}?artistId=${artistId}`);
            console.log(response.data.message);
            // After successful deletion, filter out the deleted album from the state
            setContentDocuments(prevContentDocuments =>
                prevContentDocuments.filter((contentDocument) => contentDocument.albumId !== albumId)
            );
        } catch (error) {
            console.error('Error deleting album:', error.response.data.message);
        }
    };


    const handleModify = (videoId) => {
        navigate(`/prepareForQA/${videoId}`);
    };

    const handleModifyAlbum = (albumId) => {
        navigate(`/ModifyAlbum/${albumId}`);
    }


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

    // Function to handle filter change
    const handleFilterChange = (filterType) => {
        setFilter(filterType);
    };


    const getFilteredContent = () => {
    let filteredContent = [];
    switch (filter) {
        case 'audio':
            filteredContent = contentDocuments.filter(doc => doc.isOnlyAudio);
            break;
        case 'video':
            filteredContent = contentDocuments.filter(doc => !doc.isOnlyAudio);
            break;
        case 'album':
            // Assuming 'type' attribute specifies if the document is an album
            filteredContent = contentDocuments.filter(doc => doc.albumId !== null);
            break;
    }
    return filteredContent;
};


return (
    <>
        {/* Filter buttons */}
        <div>
            <FilterButton onClick={() => handleFilterChange('audio')} selected={filter === 'audio'}>
                Music
            </FilterButton>
            <FilterButton onClick={() => handleFilterChange('video')} selected={filter === 'video'}>
                Video
            </FilterButton>
            <FilterButton onClick={() => handleFilterChange('album')} selected={filter === 'album'}>
                Album
            </FilterButton>
        </div>

        <div style={{ marginTop: '5vw' }}>
            {filter !== 'album' ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', marginBottom: '3vw' }}>
                        <span style={{ marginLeft:'3vw'}}>Track</span>
                        <span>Status</span>
                        <span></span>
                        <span></span>
                    </div>
                    {getFilteredContent().map((item) => (
                        <div
                        key={item.videoId}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '0.1vw solid #ccc',
                            padding: '1vw 0',
                            margin: '1vw 0',
                            justifyContent:'space-between'
                        }}>
                            <TrackInfo>
                                <TrackName>{item.title}</TrackName>
                                <ArtistName>{artistName}</ArtistName>
                            </TrackInfo>
                            <span>{getStatus(item)}</span>
                            <span>
                                <TransparentButton onClick={() => handleModify(item.videoId)}>
                                    <img src={EditIcon} alt="Edit" style={{ width: '2vw', height: '2vw' }} />
                                </TransparentButton>
                            </span>
                            <span>
                                <TransparentButton onClick={() => handleDelete(item.videoId, artistId)}>
                                    <img src={TrashIcon} alt="Delete" style={{ width: '2vw', height: '2vw' }} />
                                </TransparentButton>
                            </span>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', marginBottom: '3vw' }}>
                        <span style={{ marginLeft:'3vw'}}>Album</span>
                        <span >Date added</span>
                        <span ></span>
                        
                    </div>
                    {getFilteredContent().map((album) => (
                        <div
                            key={album.albumId}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                borderBottom: '0.1vw solid #ccc',
                                padding: '1vw 0',
                                margin: '1vw 0',
                                justifyContent:'space-between'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center' }}>
                                <TrackInfo>
                                <TrackName>{album.albumName|| 'Unnamed Album'}</TrackName>
                                <ArtistName>{artistName}</ArtistName>
                                </TrackInfo>
                                <p>{new Date(album.timestamp).toLocaleDateString()}</p>
                                <TransparentButton onClick={() => handleModifyAlbum(album.albumId)}>
                                    <img src={EditIcon} alt="Edit" style={{ width: '2vw', height: '2vw' }} />
                                </TransparentButton>
                                <TransparentButton onClick={() => handleDeleteAlbum(album.albumId, artistId)}>
                                    <img src={TrashIcon} alt="Delete" style={{ width: '2vw', height: '2vw' }} />
                                </TransparentButton>
                            </div>
                            {/* <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            </div> */}
                        </div>
                    ))}
                </>
            )}
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
    margin-left: 3vw; // Use vw for margin
`;

const TrackName = styled.span`
    font-size: 2em; // Adjusted from 24px to viewport relative units
    color: #434289; // Your primary color
`;

const ArtistName = styled.span`
    font-size: 1.6em; // Adjusted from 16px to viewport relative units
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

// Styled components for the buttons
const FilterButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #434289;
    margin-right: 1rem;
    padding-bottom: 0.25rem;
    font-size: 1rem;
    border-radius: 0px;

    // Apply a thick underline if the button is selected
    ${props => props.selected && css`
        border-bottom: 2px solid #434289;
    `}
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