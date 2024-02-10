import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import uploadEditIcon from '../../assets/uploadEditIcon.png';
import uploadHamburgerIcon from '../../assets/uploadHamburgerIcon.png';
import uploadTrashIcon from '../../assets/uploadTrashIcon.png';

const ModifyAlbum = () => {
    const { user } = useAuth0();

    const { albumId } = useParams();
    const navigate = useNavigate();
    const [albumData, setAlbumData] = useState({
        albumName: '',
        description: '',
        title: '',
        visibility: '',
        albumImageUrl: '',
        albumOrder: [],
    });
    const [formError, setFormError] = useState('');
    const [uploadedAlbumCover, setUploadedAlbumCover] = useState(null);
    const [previewAlbumCover, setPreviewAlbumCover] = useState(null);

    useEffect(() => {
        const fetchAlbumData = async () => {
        if (!albumId) return;

        try {
            // Fetch the album data as before
            const albumResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/getAlbumById`, {
            params: { albumId: albumId },
            });

            const album = albumResponse.data;

            // Fetch titles for each videoId
            const trackDetailsPromises = album.albumOrder.map(videoId => getTitleForVideoId(videoId));
            const trackDetails = await Promise.all(trackDetailsPromises);

            setAlbumData({
                albumId: album.albumId || '',
                title: album.title || '',
                albumName: album.albumName || '',
                description: album.description || '',
                visibility: album.visibility || 'public', // Default to 'public' if not specified
                albumImageUrl: album.albumImageUrl || '',
                albumOrder: trackDetails,
            });

                if (album.albumImageUrl) {
                    setPreviewAlbumCover(album.albumImageUrl);
                }
            } catch (error) {
                console.error('Error fetching album data:', error);
            }
        };

        fetchAlbumData();
    }, [albumId]);


    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const newAlbumOrder = Array.from(albumData.albumOrder);
        const [movedItem] = newAlbumOrder.splice(result.source.index, 1);
        newAlbumOrder.splice(result.destination.index, 0, movedItem);
        console.log(albumData.albumOrder)

        setAlbumData({ ...albumData, albumOrder: newAlbumOrder });

        try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/updateAlbumMetaData`, {
            albumId: albumData.albumId,
            albumOrder: newAlbumOrder.map(item => item.id) // Assuming the item structure has an 'id' field
        });

        if (response.status === 200) {
            console.log('Album order updated successfully');
            // Handle successful update here
        } else {
            console.error('Failed to update album order');
            // Handle error here
        }
    } catch (error) {
        console.error('Error updating album order:', error);
        // Handle error here
    }
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAlbumData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Function to handle album cover upload to Firebase and get URL
    const uploadAlbumCover = async () => {
    if (!uploadedAlbumCover) return null; // Return null to explicitly indicate no upload happened
    const fileRef = ref(storage, `album-covers/${user.name}/${uuidv4()}`);
    try {
        await uploadBytes(fileRef, uploadedAlbumCover);
        const coverUrl = await getDownloadURL(fileRef);
        console.log("Uploaded Album Cover URL:", coverUrl); // Debug log
        return coverUrl;
    } catch (error) {
        console.error("Error uploading album cover:", error);
        return null;
    }
};


    const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if a new album cover has been uploaded; if so, upload it and get the URL
    const coverUrl = uploadedAlbumCover ? await uploadAlbumCover() : albumData.albumImageUrl;

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/updateAlbumMetaData`, {
            albumId: albumId,
            title: albumData.albumName,
            description: albumData.description,
            visibility: albumData.visibility,
            // Assuming albumOrder is managed elsewhere or not applicable here. If needed, include it in your albumData state and payload.
            albumImageUrl: coverUrl, // Use the new cover URL if a new cover has been uploaded, else use existing cover URL from state
        });

        if (response.status === 200) {
            console.log('Album metadata updated successfully', response.data);
            navigate('/studio'); // Redirect to studio page or another relevant page
        } else {
            setFormError('Failed to update album metadata. Please try again.');
        }
    } catch (error) {
        console.error('Error updating album metadata:', error);
        setFormError('An error occurred while updating the album.');
    }
};

    const handleCoverChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedAlbumCover(file);
            setPreviewAlbumCover(URL.createObjectURL(file));
        }
    };

    const getTitleForVideoId = async (videoId) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/getVideoMetadata/${videoId}`);
        // Ensure that the response contains the video data you expect
        if (response.data && response.data.title) {
        return { id: videoId, title: response.data.title }; // Assuming the backend returns an object with a title property
        }
        throw new Error(`No data returned for videoId ${videoId}`);
    } catch (error) {
        console.error(`Failed to get title for videoId ${videoId}:`, error);
        return { id: videoId, title: '' }; // Return an object with id and an empty title as fallback
    }
    };

    const handleEdit = (trackId) => {
        navigate(`/prepareForQA/${trackId}`);
};

const handleDelete = (trackId) => {
  // Logic to handle delete
};

    // Render form for album metadata editing
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div style={{height:'12vh', display:'flex', justifyContent:'space-between'}}>
                    <CloseButton>Close</CloseButton>
                    <SaveButton type="submit">Save</SaveButton>
                </div>
                <h1 style={{marginLeft:'3vw', marginBottom:'6vh'}}>Edit Album</h1>
                <div style={{display:'flex', flexDirection:'row'}}>
                    <div style={{display:'flex', flexDirection:'column', width:'50%'}}>
                    <label style={{marginLeft:'3vw'}} htmlFor="albumName">Title</label>
                    <input style={{marginLeft:'3vw', width:'80%', padding:'22px'}} type="text" name="albumName" value={albumData.albumName} onChange={handleInputChange} placeholder="Write a catchy title for the content" />
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                        <AlbumCoverInput
                            onClick={() => document.getElementById('albumCover').click()}
                            image={previewAlbumCover}
                        >
                        </AlbumCoverInput>
                        <input 
                            style={{ display: 'none' }}
                            id="albumCover"
                            type="file" 
                            accept="image/*" 
                            onChange={handleCoverChange}
                        />
                        {!previewAlbumCover && <span style={{cursor:'pointer'}} onClick={() => document.getElementById('albumCover').click()} >Upload<br />Cover Image</span>}
                        {previewAlbumCover && <span onClick={() => document.getElementById('albumCover').click()} >Change<br />Cover Image</span>}
                    </div>
                    <label style={{marginLeft:'3vw', marginTop:'3vh'}} htmlFor="description">Description</label>
                    <textarea style={{marginLeft:'3vw', width:'80%', padding:'22px'}} name="description" value={albumData.description} onChange={handleInputChange} placeholder="What describes this album"/>
                    <label style={{marginLeft:'3vw', marginTop:'3vh'}} htmlFor="visibility">Visibility</label>
                    <select
                    style={{marginLeft:'3vw', width: '36%', padding:'22px'}}
                    name="visibility"
                    value={albumData.visibility || 'public'}
                    onChange={handleInputChange}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginRight:'3vw' }}>
                    <label htmlFor='DragDropContext' style={{marginLeft:'3vw'}}>Tracks from this album</label>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="albumTracks">
                            {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {albumData.albumOrder.map((track, index) => (
                                <Draggable key={track.id} draggableId={track.id} index={index}>
                                    {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <TrackComponent 
                                        track={track} 
                                        onEdit={handleEdit} 
                                        onDelete={handleDelete}
                                        dragHandleProps={provided.dragHandleProps}
                                        />
                                    </div>
                                    )}
                                </Draggable>
                                ))}
                                
                                {provided.placeholder}
                            </div>
                            )}
                        </Droppable>
                        </DragDropContext>
            </div>
                </div>
                
            </form>
            {formError && <p>{formError}</p>}
        </div>
    );
};

export default ModifyAlbum;

const SaveButton = styled.button`
    margin: 3%;
`;
const CloseButton = styled.button`
    background-color: rgb(0, 0, 0, 0);
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-size: 20px;
    color: rgb(67, 66, 137);
    text-decoration: underline;
    margin: 3%;
`;

const AlbumCoverInput = styled.div`
    width: 65%;
    height: 170px;
    background-color: ${props => props.image ? 'transparent' : '#f0f0f0'};
    background-image: url(${props => props.image});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    display: flex;
    justify-content: space-between; /* Align children to the left and right */
    align-items: center; /* Align children vertically */
    position: relative; /* Position relative to the parent */
    margin-bottom: 3vh;
    margin-left: 3vw;
    margin-top: 3vh;
    padding: 0 10px; /* Add horizontal padding */
`;

const TrackComponent = ({ track, onEdit, onDelete, dragHandleProps }) => {
    return (
        <TrackContainer>
        <Icon src={uploadHamburgerIcon} alt="Drag handle" {...dragHandleProps} />
        <FileName>{track.title}</FileName>
        <Icon 
            src={uploadEditIcon} 
            alt="Edit" 
            onClick={() => onEdit(track.id)}
        />
        {/* <Icon 
            src={uploadTrashIcon} 
            alt="Delete" 
            onClick={() => onDelete(track.id)}
        /> */}
        </TrackContainer>
    );
    };

const TrackContainer = styled.div`
    background-color: #F5F5F5;
    padding: 22px;
    margin-bottom: 10px; // Add space between the items
    border: 1px solid #D9D9D9;
    display: flex;
    align-items: center; // Align items vertically in the center
    justify-content: space-between; // Space out the children evenly
`;

const Icon = styled.img`
    cursor: pointer;
    // Adjust size if necessary
    width: 24px; // Example size
    height: 24px; // Example size
`;

const FileName = styled.span`
    color: #434289;
    font-size: 20px;
    flex-grow: 1;
    margin: 0 15px; // Adjust margin as needed
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;


